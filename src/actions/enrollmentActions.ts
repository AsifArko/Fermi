'use server';

import { clerkClient } from '@clerk/nextjs/server';

import {
  checkCourseAccess,
  canEnrollInCourse,
} from '@/sanity/lib/course/courseAccessService';
import getCourseById from '@/sanity/lib/courses/getCourseById';
import {
  createEnrollment,
  getEnrollmentStatus,
} from '@/sanity/lib/enrollment/enrollmentService';
import {
  createStudent,
  getStudentByClerkId,
} from '@/sanity/lib/student/studentService';

// Types for enrollment actions
export interface EnrollmentResult {
  success: boolean;
  enrollmentId?: string;
  redirectUrl?: string;
  error?: string;
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
}

export interface FreeEnrollmentParams {
  courseId: string;
  userId: string;
  metadata?: {
    enrollmentSource?: string;
    referralCode?: string;
    campaign?: string;
  };
}

export interface PaidEnrollmentParams {
  courseId: string;
  userId: string;
  metadata?: {
    enrollmentSource?: string;
    referralCode?: string;
    campaign?: string;
  };
}

/**
 * Enroll user in a free course
 */
export async function enrollInFreeCourse(
  params: FreeEnrollmentParams
): Promise<EnrollmentResult> {
  try {
    const { courseId, userId, metadata } = params;

    // Validate inputs
    if (!courseId || !userId) {
      return {
        success: false,
        error: 'Missing required parameters',
      };
    }

    // Get course details
    const course = await getCourseById(courseId);
    if (!course) {
      return {
        success: false,
        error: 'Course not found',
      };
    }

    // Verify course is free
    if (course.price !== 0) {
      return {
        success: false,
        error: 'Course is not free',
      };
    }

    // Check if user can enroll
    const enrollmentEligibility = await canEnrollInCourse(userId, courseId);
    if (!enrollmentEligibility.canEnroll) {
      return {
        success: false,
        error: enrollmentEligibility.reason || 'Cannot enroll in this course',
      };
    }

    // Get or create student
    let student = await getStudentByClerkId(userId);

    if (!student) {
      // Create student only when enrolling
      const clerkUser = await (await clerkClient()).users.getUser(userId);
      const { emailAddresses, firstName, lastName, imageUrl } = clerkUser;
      const email = emailAddresses[0]?.emailAddress;

      if (!email) {
        return {
          success: false,
          error: 'User email not found',
        };
      }

      const studentParams: {
        clerkId: string;
        email: string;
        firstName?: string;
        lastName?: string;
        imageUrl?: string;
      } = {
        clerkId: userId,
        email,
      };

      if (firstName) studentParams.firstName = firstName;
      if (lastName) studentParams.lastName = lastName;
      if (imageUrl) studentParams.imageUrl = imageUrl;

      student = await createStudent(studentParams);
    }

    // Create enrollment
    const enrollment = await createEnrollment({
      studentId: student._id,
      courseId,
      amount: 0,
      paymentId: 'free',
      metadata: {
        enrollmentSource: 'web',
        ...metadata,
      },
    });

    return {
      success: true,
      enrollmentId: enrollment._id,
      status: enrollment.status,
      redirectUrl: `/dashboard/courses/${courseId}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get enrollment status for a user and course
 */
export async function getEnrollmentStatusAction(
  courseId: string,
  userId: string
): Promise<EnrollmentResult> {
  try {
    if (!courseId || !userId) {
      return {
        success: false,
        error: 'Missing required parameters',
      };
    }

    const enrollmentStatus = await getEnrollmentStatus(userId, courseId);

    const result: {
      success: boolean;
      status?: 'pending' | 'active' | 'completed' | 'cancelled';
      enrollmentId?: string;
    } = {
      success: true,
      status: enrollmentStatus.status || undefined,
    };

    if (enrollmentStatus.enrollmentId) {
      result.enrollmentId = enrollmentStatus.enrollmentId;
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Check course access for a user
 */
export async function checkCourseAccessAction(
  courseId: string,
  userId: string
): Promise<{
  success: boolean;
  hasAccess: boolean;
  accessLevel: 'none' | 'preview' | 'full' | 'admin';
  canEnroll: boolean;
  error?: string;
}> {
  try {
    if (!courseId || !userId) {
      return {
        success: false,
        hasAccess: false,
        accessLevel: 'none',
        canEnroll: false,
        error: 'Missing required parameters',
      };
    }

    const access = await checkCourseAccess({ clerkId: userId, courseId });

    return {
      success: true,
      hasAccess: access.hasAccess,
      accessLevel: access.accessLevel,
      canEnroll: access.canEnroll,
    };
  } catch (error) {
    return {
      success: false,
      hasAccess: false,
      accessLevel: 'none',
      canEnroll: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Cancel enrollment for a user
 */
export async function cancelEnrollmentAction(
  courseId: string,
  userId: string
): Promise<EnrollmentResult> {
  try {
    if (!courseId || !userId) {
      return {
        success: false,
        error: 'Missing required parameters',
      };
    }

    // Get current enrollment status
    const enrollmentStatus = await getEnrollmentStatus(userId, courseId);

    if (!enrollmentStatus.isEnrolled || !enrollmentStatus.enrollmentId) {
      return {
        success: false,
        error: 'No active enrollment found',
      };
    }

    // Import the cancelEnrollment function
    const { cancelEnrollment } = await import(
      '@/sanity/lib/enrollment/enrollmentService'
    );

    // Cancel the enrollment
    const cancelledEnrollment = await cancelEnrollment(
      enrollmentStatus.enrollmentId
    );

    return {
      success: true,
      enrollmentId: cancelledEnrollment._id,
      status: cancelledEnrollment.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get enrollment summary for multiple courses
 */
export async function getEnrollmentsSummaryAction(
  courseIds: string[],
  userId: string
): Promise<{
  success: boolean;
  enrollments: Record<string, unknown>;
  error?: string;
}> {
  try {
    if (!courseIds.length || !userId) {
      return {
        success: false,
        enrollments: {},
        error: 'Missing required parameters',
      };
    }

    // Import the getCoursesAccessSummary function
    const { getCoursesAccessSummary } = await import(
      '@/sanity/lib/course/courseAccessService'
    );

    const enrollments = await getCoursesAccessSummary(userId, courseIds);

    return {
      success: true,
      enrollments,
    };
  } catch (error) {
    return {
      success: false,
      enrollments: {},
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Create enrollment from Stripe session data (fallback when webhooks fail)
 */
export async function createEnrollmentFromStripeSession(
  sessionId: string,
  courseId: string,
  userId: string
): Promise<EnrollmentResult> {
  try {
    if (!sessionId || !courseId || !userId) {
      return {
        success: false,
        error: 'Missing required parameters',
      };
    }

    // Get or create student
    let student = await getStudentByClerkId(userId);
    if (!student) {
      // Create student if it doesn't exist
      const clerkUser = await (await clerkClient()).users.getUser(userId);
      const { emailAddresses, firstName, lastName, imageUrl } = clerkUser;
      const email = emailAddresses[0]?.emailAddress;

      if (!email) {
        return {
          success: false,
          error: 'User email not found',
        };
      }

      student = await createStudent({
        clerkId: userId,
        email,
        firstName: firstName || email,
        lastName: lastName || '',
        imageUrl: imageUrl || '',
      });

      if (!student) {
        return {
          success: false,
          error: 'Failed to create student',
        };
      }
    }

    // Create enrollment
    const enrollment = await createEnrollment({
      studentId: student._id,
      courseId: courseId,
      paymentId: sessionId,
      amount: 0, // We'll get this from Stripe if needed
    });

    return {
      success: true,
      enrollmentId: enrollment._id,
      status: enrollment.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
