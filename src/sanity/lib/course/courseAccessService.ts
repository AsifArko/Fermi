import { getEnrollmentStatus } from '../enrollment/enrollmentService';
import { getStudentByClerkId } from '../student/studentService';

// Types for course access management
export interface CourseAccess {
  hasAccess: boolean;
  accessLevel: 'none' | 'preview' | 'full' | 'admin';
  enrollmentStatus?: 'pending' | 'active' | 'completed' | 'cancelled';
  enrolledAt?: string;
  expiresAt?: string;
  canEnroll: boolean;
  enrollmentRequired: boolean;
}

export interface CourseAccessParams {
  clerkId: string;
  courseId: string;
  courseSlug?: string;
}

/**
 * Check if user has access to a course
 */
export async function checkCourseAccess(
  params: CourseAccessParams
): Promise<CourseAccess> {
  try {
    const { clerkId, courseId } = params;

    if (!clerkId || !courseId) {
      return {
        hasAccess: false,
        accessLevel: 'none',
        canEnroll: false,
        enrollmentRequired: true,
      };
    }

    // Check if user is a student
    const student = await getStudentByClerkId(clerkId);
    if (!student || !student.isActive) {
      return {
        hasAccess: false,
        accessLevel: 'preview',
        canEnroll: true,
        enrollmentRequired: true,
      };
    }

    // Get enrollment status
    const enrollmentStatus = await getEnrollmentStatus(clerkId, courseId);

    if (!enrollmentStatus.isEnrolled) {
      return {
        hasAccess: false,
        accessLevel: 'preview',
        canEnroll: true,
        enrollmentRequired: true,
      };
    }

    // User is enrolled, determine access level based on status
    switch (enrollmentStatus.status) {
      case 'active':
        const activeResult: {
          hasAccess: boolean;
          accessLevel: 'full';
          enrollmentStatus?: 'pending' | 'active' | 'completed' | 'cancelled';
          canEnroll: boolean;
          enrollmentRequired: boolean;
          enrolledAt?: string;
          expiresAt?: string;
        } = {
          hasAccess: true,
          accessLevel: 'full',
          enrollmentStatus: enrollmentStatus.status,
          canEnroll: false,
          enrollmentRequired: false,
        };

        if (enrollmentStatus.enrolledAt)
          activeResult.enrolledAt = enrollmentStatus.enrolledAt;
        if (enrollmentStatus.expiresAt)
          activeResult.expiresAt = enrollmentStatus.expiresAt;

        return activeResult;

      case 'completed':
        const completedResult: {
          hasAccess: boolean;
          accessLevel: 'full';
          enrollmentStatus?: 'pending' | 'active' | 'completed' | 'cancelled';
          canEnroll: boolean;
          enrollmentRequired: boolean;
          enrolledAt?: string;
          expiresAt?: string;
        } = {
          hasAccess: true,
          accessLevel: 'full',
          enrollmentStatus: enrollmentStatus.status,
          canEnroll: false,
          enrollmentRequired: false,
        };

        if (enrollmentStatus.enrolledAt)
          completedResult.enrolledAt = enrollmentStatus.enrolledAt;
        if (enrollmentStatus.expiresAt)
          completedResult.expiresAt = enrollmentStatus.expiresAt;

        return completedResult;

      case 'pending':
        const pendingResult: {
          hasAccess: boolean;
          accessLevel: 'preview';
          enrollmentStatus?: 'pending' | 'active' | 'completed' | 'cancelled';
          canEnroll: boolean;
          enrollmentRequired: boolean;
          enrolledAt?: string;
        } = {
          hasAccess: false,
          accessLevel: 'preview',
          enrollmentStatus: enrollmentStatus.status,
          canEnroll: false,
          enrollmentRequired: false,
        };

        if (enrollmentStatus.enrolledAt)
          pendingResult.enrolledAt = enrollmentStatus.enrolledAt;

        return pendingResult;

      case 'cancelled':
        const cancelledResult: {
          hasAccess: boolean;
          accessLevel: 'preview';
          enrollmentStatus?: 'pending' | 'active' | 'completed' | 'cancelled';
          canEnroll: boolean;
          enrollmentRequired: boolean;
          enrolledAt?: string;
        } = {
          hasAccess: false,
          accessLevel: 'preview',
          enrollmentStatus: enrollmentStatus.status,
          canEnroll: true,
          enrollmentRequired: true,
        };

        if (enrollmentStatus.enrolledAt)
          cancelledResult.enrolledAt = enrollmentStatus.enrolledAt;

        return cancelledResult;

      default:
        return {
          hasAccess: false,
          accessLevel: 'preview',
          canEnroll: true,
          enrollmentRequired: true,
        };
    }
  } catch {
    return {
      hasAccess: false,
      accessLevel: 'none',
      canEnroll: false,
      enrollmentRequired: true,
    };
  }
}

/**
 * Get user's access level for a course
 */
export async function getCourseAccessLevel(
  clerkId: string,
  courseId: string
): Promise<'none' | 'preview' | 'full' | 'admin'> {
  try {
    const access = await checkCourseAccess({ clerkId, courseId });
    return access.accessLevel;
  } catch {
    return 'none';
  }
}

/**
 * Validate if user can access course content
 */
export async function validateCourseAccess(
  clerkId: string,
  courseId: string
): Promise<{ isValid: boolean; reason?: string }> {
  try {
    const access = await checkCourseAccess({ clerkId, courseId });

    if (!access.hasAccess) {
      return {
        isValid: false,
        reason:
          access.enrollmentStatus === 'pending'
            ? 'Enrollment is pending approval'
            : access.enrollmentStatus === 'cancelled'
              ? 'Enrollment was cancelled'
              : 'Enrollment required to access this course',
      };
    }

    // Check if enrollment has expired
    if (access.expiresAt && new Date(access.expiresAt) < new Date()) {
      return {
        isValid: false,
        reason: 'Enrollment has expired',
      };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      reason: 'Unable to validate access',
    };
  }
}

/**
 * Check if user can preview course content
 */
export async function canPreviewCourse(): Promise<boolean> {
  try {
    // All users can preview course content (course listing, description, etc.)
    // This is different from accessing actual course materials
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if user can enroll in a course
 */
export async function canEnrollInCourse(
  clerkId: string,
  courseId: string
): Promise<{ canEnroll: boolean; reason?: string }> {
  try {
    if (!clerkId) {
      return {
        canEnroll: false,
        reason: 'Authentication required',
      };
    }

    const access = await checkCourseAccess({ clerkId, courseId });

    if (access.enrollmentStatus === 'pending') {
      return {
        canEnroll: false,
        reason: 'Enrollment already pending',
      };
    }

    if (
      access.enrollmentStatus === 'active' ||
      access.enrollmentStatus === 'completed'
    ) {
      return {
        canEnroll: false,
        reason: 'Already enrolled',
      };
    }

    return {
      canEnroll: access.canEnroll,
      ...(access.canEnroll ? {} : { reason: 'Enrollment not available' }),
    };
  } catch {
    return {
      canEnroll: false,
      reason: 'Unable to determine eligibility',
    };
  }
}

/**
 * Get course access summary for multiple courses
 */
export async function getCoursesAccessSummary(
  clerkId: string,
  courseIds: string[]
): Promise<Record<string, CourseAccess>> {
  try {
    const accessPromises = courseIds.map(courseId =>
      checkCourseAccess({ clerkId, courseId })
    );

    const accessResults = await Promise.all(accessPromises);

    const summary: Record<string, CourseAccess> = {};
    courseIds.forEach((courseId, index) => {
      summary[courseId] = accessResults[index];
    });

    return summary;
  } catch {
    return {};
  }
}
