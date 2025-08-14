import { client } from '../adminClient';
import { sanityFetch } from '../live';
import { defineQuery } from 'groq';

// Types for the new enrollment system
export interface EnrollmentStatus {
  isEnrolled: boolean;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | null;
  enrollmentId?: string;
  enrolledAt?: string;
  expiresAt?: string;
  amount: number;
  paymentId?: string;
}

export interface CreateEnrollmentParams {
  studentId: string;
  courseId: string;
  amount: number;
  paymentId?: string;
  metadata?: {
    enrollmentSource?: string;
    referralCode?: string;
    campaign?: string;
  };
}

export interface Enrollment {
  _id: string;
  _type: 'enrollment';
  student: {
    _ref: string;
    _type: 'reference';
  };
  course: {
    _ref: string;
    _type: 'reference';
  };
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  amount: number;
  paymentId?: string;
  enrolledAt: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Get enrollment status for a user and course
 */
export async function getEnrollmentStatus(
  clerkId: string,
  courseId: string
): Promise<EnrollmentStatus> {
  try {
    const query = defineQuery(`
      *[_type == "student" && clerkId == $clerkId][0] {
        _id,
        "enrollments": *[_type == "enrollment" && student._ref == ^._id && course._ref == $courseId] {
          _id,
          status,
          enrolledAt,
          expiresAt,
          amount,
          paymentId
        }[0]
      }
    `);

    const result = await sanityFetch({
      query,
      params: { clerkId, courseId },
    });

    if (!result?.data) {
      return {
        isEnrolled: false,
        status: null,
        amount: 0,
      };
    }

    const enrollment = result.data.enrollments;

    if (!enrollment) {
      return {
        isEnrolled: false,
        status: null,
        amount: 0,
      };
    }

    return {
      isEnrolled: true,
      status: enrollment.status,
      enrollmentId: enrollment._id,
      enrolledAt: enrollment.enrolledAt,
      expiresAt: enrollment.expiresAt,
      amount: enrollment.amount,
      paymentId: enrollment.paymentId,
    };
  } catch (error) {
    console.error('Error getting enrollment status:', error);
    return {
      isEnrolled: false,
      status: null,
      amount: 0,
    };
  }
}

/**
 * Create a new enrollment
 */
export async function createEnrollment(
  params: CreateEnrollmentParams
): Promise<Enrollment> {
  try {
    const { studentId, courseId, amount, paymentId, metadata } = params;

    // Validate required fields
    if (!studentId || !courseId || amount === undefined) {
      throw new Error('Missing required enrollment parameters');
    }

    // Check if enrollment already exists
    const existingEnrollment = await client.fetch(
      `*[_type == "enrollment" && student._ref == $studentId && course._ref == $courseId][0]`,
      { studentId, courseId }
    );

    if (existingEnrollment) {
      throw new Error('Enrollment already exists for this student and course');
    }

    // Create enrollment
    const enrollment = await client.create({
      _type: 'enrollment',
      student: {
        _type: 'reference',
        _ref: studentId,
      },
      course: {
        _type: 'reference',
        _ref: courseId,
      },
      status: 'active', // Default to active for new enrollments
      amount,
      paymentId: paymentId || (amount === 0 ? 'free' : undefined),
      enrolledAt: new Date().toISOString(),
      metadata: metadata || {},
    });

    console.log('Enrollment created successfully:', enrollment);
    return enrollment as unknown as Enrollment;
  } catch (error) {
    console.error('Error creating enrollment:', error);
    throw error;
  }
}

/**
 * Update enrollment status
 */
export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: 'pending' | 'active' | 'completed' | 'cancelled'
): Promise<Enrollment> {
  try {
    const updatedEnrollment = await client
      .patch(enrollmentId)
      .set({ status })
      .commit();

    console.log('Enrollment status updated:', updatedEnrollment);
    return updatedEnrollment as unknown as Enrollment;
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    throw error;
  }
}

/**
 * Cancel an enrollment
 */
export async function cancelEnrollment(
  enrollmentId: string
): Promise<Enrollment> {
  try {
    const cancelledEnrollment = await client
      .patch(enrollmentId)
      .set({
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log('Enrollment cancelled:', cancelledEnrollment);
    return cancelledEnrollment as unknown as Enrollment;
  } catch (error) {
    console.error('Error cancelling enrollment:', error);
    throw error;
  }
}

/**
 * Get all enrollments for a student
 */
export async function getStudentEnrollments(
  clerkId: string
): Promise<Enrollment[]> {
  try {
    const query = defineQuery(`
      *[_type == "student" && clerkId == $clerkId][0] {
        "enrollments": *[_type == "enrollment" && student._ref == ^._id] {
          _id,
          status,
          enrolledAt,
          expiresAt,
          amount,
          paymentId,
          "course": course-> {
            _id,
            title,
            slug,
            image,
            category->{ name }
          }
        } | order(enrolledAt desc)
      }
    `);

    const result = await sanityFetch({
      query,
      params: { clerkId },
    });

    return result?.data?.enrollments || [];
  } catch (error) {
    console.error('Error getting student enrollments:', error);
    return [];
  }
}

/**
 * Check if a user has access to a course
 */
export async function hasCourseAccess(
  clerkId: string,
  courseId: string
): Promise<boolean> {
  try {
    const enrollmentStatus = await getEnrollmentStatus(clerkId, courseId);

    // User has access if they have an active or completed enrollment
    return (
      enrollmentStatus.isEnrolled &&
      (enrollmentStatus.status === 'active' ||
        enrollmentStatus.status === 'completed')
    );
  } catch (error) {
    console.error('Error checking course access:', error);
    return false;
  }
}

/**
 * Get active enrollments count for a course
 */
export async function getCourseEnrollmentCount(
  courseId: string
): Promise<number> {
  try {
    const count = await client.fetch(
      `count(*[_type == "enrollment" && course._ref == $courseId && status in ["active", "completed"]])`,
      { courseId }
    );

    return count || 0;
  } catch (error) {
    console.error('Error getting course enrollment count:', error);
    return 0;
  }
}
