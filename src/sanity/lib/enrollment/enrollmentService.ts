import { defineQuery } from 'groq';

import { client } from '../adminClient';
import { sanityFetch } from '../live';

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
    const enrollmentStatusQuery = defineQuery(`
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
      query: enrollmentStatusQuery,
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

    const enrollmentResult: {
      isEnrolled: boolean;
      status: 'pending' | 'active' | 'completed' | 'cancelled' | null;
      enrollmentId: string;
      amount: number;
      enrolledAt?: string;
      expiresAt?: string;
      paymentId?: string;
    } = {
      isEnrolled: true,
      status: enrollment.status || null,
      enrollmentId: enrollment._id || '',
      amount: enrollment.amount || 0,
    };

    if (enrollment.enrolledAt)
      enrollmentResult.enrolledAt = enrollment.enrolledAt;
    if (enrollment.expiresAt) enrollmentResult.expiresAt = enrollment.expiresAt;
    if (enrollment.paymentId) enrollmentResult.paymentId = enrollment.paymentId;

    return enrollmentResult;
  } catch {
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

    return enrollment as unknown as Enrollment;
  } catch (error) {
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

    return updatedEnrollment as unknown as Enrollment;
  } catch (error) {
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

    return cancelledEnrollment as unknown as Enrollment;
  } catch (error) {
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
    const studentEnrollmentsQuery = defineQuery(`
      *[_type == "student" && clerkId == $clerkId][0] {
        "enrollments": *[_type == "enrollment" && student._ref == ^._id] {
          _id,
          status,
          enrolledAt,
          expiresAt,
          amount,
          paymentId,
          course->{
            _id,
            title,
            slug,
            image
          }
        } | order(enrolledAt desc)
      }
    `);

    const result = await sanityFetch({
      query: studentEnrollmentsQuery,
      params: { clerkId },
    });

    const enrollments = result?.data?.enrollments || [];

    // Transform the query result to match the Enrollment interface
    return enrollments.map((enrollment: any) => ({
      _id: enrollment._id,
      _type: 'enrollment' as const,
      student: {
        _ref: enrollment.student?._ref || '',
        _type: 'reference' as const,
      },
      course: {
        _ref: enrollment.course?._id || '',
        _type: 'reference' as const,
      },
      status: enrollment.status || 'pending',
      amount: enrollment.amount || 0,
      paymentId: enrollment.paymentId,
      enrolledAt: enrollment.enrolledAt || new Date().toISOString(),
      expiresAt: enrollment.expiresAt,
      metadata: enrollment.metadata || {},
    }));
  } catch {
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
  } catch {
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
  } catch {
    return 0;
  }
}
