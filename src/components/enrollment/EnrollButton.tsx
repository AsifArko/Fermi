'use client';

import { useUser } from '@clerk/nextjs';
import { CheckCircle, Loader2, Lock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  enrollInFreeCourse,
  getEnrollmentStatusAction,
  checkCourseAccessAction,
} from '@/actions/enrollmentActions';
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge';

// Types for the enhanced enroll button
interface EnrollButtonProps {
  courseId: string;
  coursePrice: number;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
}

interface EnrollmentState {
  isLoading: boolean;
  isEnrolled: boolean;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | null;
  canEnroll: boolean;
  accessLevel: 'none' | 'preview' | 'full' | 'admin';
}

export function EnrollButton({
  courseId,
  coursePrice,
  className,
  variant = 'default',
}: EnrollButtonProps) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>({
    isLoading: true,
    isEnrolled: false,
    status: null,
    canEnroll: false,
    accessLevel: 'none',
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const loadEnrollmentState = useCallback(async () => {
    if (!user?.id) return;

    try {
      setEnrollmentState(prev => ({ ...prev, isLoading: true }));

      // Get enrollment status and course access
      const [enrollmentResult, accessResult] = await Promise.all([
        getEnrollmentStatusAction(courseId, user.id),
        checkCourseAccessAction(courseId, user.id),
      ]);

      if (enrollmentResult.success && accessResult.success) {
        setEnrollmentState({
          isLoading: false,
          isEnrolled: enrollmentResult.status !== null,
          status: enrollmentResult.status || null,
          canEnroll: accessResult.canEnroll,
          accessLevel: accessResult.accessLevel,
        });
      } else {
        setEnrollmentState({
          isLoading: false,
          isEnrolled: false,
          status: null,
          canEnroll: false,
          accessLevel: 'none',
        });
      }
    } catch (error) {
      console.error('Error loading enrollment state:', error);
      setEnrollmentState({
        isLoading: false,
        isEnrolled: false,
        status: null,
        canEnroll: false,
        accessLevel: 'none',
      });
    }
  }, [courseId, user?.id]);

  // Check for successful payment and refresh enrollment state
  useEffect(() => {
    const paymentSuccess = searchParams.get('success');
    if (paymentSuccess === 'true' && user?.id) {
      // Show success message
      setShowSuccessMessage(true);

      // Try to refresh enrollment state
      loadEnrollmentState();

      // If enrollment still doesn't exist after refresh, try to create it manually
      setTimeout(async () => {
        if (!enrollmentState.isEnrolled) {
          try {
            // Extract session ID from URL or try to create enrollment manually
            const { createEnrollmentFromStripeSession } = await import(
              '@/actions/enrollmentActions'
            );
            const result = await createEnrollmentFromStripeSession(
              'manual-fallback', // Placeholder session ID
              courseId,
              user.id
            );

            if (result.success) {
              await loadEnrollmentState();
            }
          } catch (error) {
            console.error('Error in manual enrollment creation:', error);
          }
        }
      }, 2000); // Wait 2 seconds for webhook to process

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [
    searchParams,
    user?.id,
    loadEnrollmentState,
    enrollmentState.isEnrolled,
    courseId,
  ]);

  // Load enrollment state on mount and when user changes
  useEffect(() => {
    if (!isUserLoaded || !user?.id) {
      setEnrollmentState({
        isLoading: false,
        isEnrolled: false,
        status: null,
        canEnroll: false,
        accessLevel: 'none',
      });
      return;
    }

    loadEnrollmentState();
  }, [isUserLoaded, user?.id, courseId, loadEnrollmentState]);

  const handleEnroll = async () => {
    if (!user?.id || !enrollmentState.canEnroll) return;

    startTransition(async () => {
      try {
        if (coursePrice === 0) {
          // Handle free course enrollment
          const result = await enrollInFreeCourse({
            courseId,
            userId: user.id,
            metadata: {
              enrollmentSource: 'web',
            },
          });

          if (result.success) {
            // For free courses, just refresh enrollment state and stay on current page
            await loadEnrollmentState();
          } else {
            console.error('Free enrollment failed:', result.error);
            // Refresh enrollment state
            await loadEnrollmentState();
          }
        } else {
          // Handle paid course enrollment - redirect to Stripe checkout
          const { createStripeCheckout } = await import(
            '@/actions/createStripeCheckout'
          );
          const result = await createStripeCheckout(courseId, user.id);

          if (result.success) {
            // Free course enrollment completed
            await loadEnrollmentState();
          } else if (result.url) {
            // Paid course - redirect to Stripe checkout
            window.location.href = result.url;
          } else {
            console.error('Course enrollment failed');
          }
        }
      } catch (error) {
        console.error('Enrollment failed:', error);
        await loadEnrollmentState();
      }
    });
  };

  // Show loading state while checking user or enrollment state
  if (!isUserLoaded) {
    return (
      <Button
        disabled
        className={cn('w-full relative', getButtonClasses(variant), className)}
      >
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  // Show loading state while checking enrollment state
  if (enrollmentState.isLoading || isPending) {
    return (
      <Button
        disabled
        className={cn('w-full relative', getButtonClasses(variant), className)}
      >
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Checking enrollment...
      </Button>
    );
  }

  // Show success message if payment was successful
  if (showSuccessMessage) {
    return (
      <div className="w-full space-y-2">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-2" />
          <p className="text-green-800 text-sm font-medium">
            Payment successful! Refreshing enrollment status...
          </p>
        </div>
        <Button
          disabled
          className={cn(
            'w-full relative',
            getButtonClasses(variant),
            className
          )}
        >
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Updating...
        </Button>
      </div>
    );
  }

  // Show sign-in prompt for unauthenticated users
  if (!user?.id) {
    return (
      <Button
        asChild
        className={cn('w-full', getButtonClasses(variant), className)}
      >
        <Link href="/sign-in">
          <Lock className="w-4 h-4 mr-2" />
          Sign in to Enroll
        </Link>
      </Button>
    );
  }

  // Show enrolled state with access to course
  if (enrollmentState.isEnrolled && enrollmentState.status === 'active') {
    return (
      <Button
        asChild
        className={cn(
          'w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white',
          getButtonClasses(variant),
          className
        )}
      >
        <Link href={`/dashboard/courses/${courseId}`}>Access Course</Link>
      </Button>
    );
  }

  // Show completed enrollment state
  if (enrollmentState.isEnrolled && enrollmentState.status === 'completed') {
    return (
      <div className="w-full space-y-2">
        <Button
          asChild
          className={cn(
            'w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white',
            getButtonClasses(variant),
            className
          )}
        >
          <Link href={`/dashboard/courses/${courseId}`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            View Course
          </Link>
        </Button>
        <EnrollmentStatusBadge status="completed" />
      </div>
    );
  }

  // Show pending enrollment state
  if (enrollmentState.isEnrolled && enrollmentState.status === 'pending') {
    return (
      <div className="w-full space-y-2">
        <Button
          disabled
          className={cn(
            'w-full bg-yellow-500 hover:bg-yellow-600 text-white',
            getButtonClasses(variant),
            className
          )}
        >
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Enrollment Pending
        </Button>
        <EnrollmentStatusBadge status="pending" />
      </div>
    );
  }

  // Show cancelled enrollment state with re-enroll option
  if (enrollmentState.isEnrolled && enrollmentState.status === 'cancelled') {
    return (
      <div className="w-full space-y-2">
        <Button
          onClick={handleEnroll}
          disabled={!enrollmentState.canEnroll}
          className={cn(
            'w-full bg-orange-500 hover:bg-orange-600 text-white',
            getButtonClasses(variant),
            className
          )}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Re-enroll
        </Button>
        <EnrollmentStatusBadge status="cancelled" />
      </div>
    );
  }

  // Show enroll button for eligible users
  if (enrollmentState.canEnroll) {
    return (
      <div className="w-full space-y-2">
        <Button
          onClick={handleEnroll}
          disabled={isPending}
          className={cn(
            'w-full bg-primary hover:bg-primary/90 text-primary-foreground',
            getButtonClasses(variant),
            className
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              {coursePrice === 0 ? 'Enroll Free' : `Enroll for $${coursePrice}`}
            </>
          )}
        </Button>
      </div>
    );
  }

  // Show disabled state for users who cannot enroll
  return (
    <Button
      disabled
      className={cn(
        'w-full bg-gray-300 text-gray-600 cursor-not-allowed',
        getButtonClasses(variant),
        className
      )}
    >
      <XCircle className="w-4 h-4 mr-2" />
      Enrollment Unavailable
    </Button>
  );
}

// Helper function to get button classes based on variant
function getButtonClasses(variant: 'default' | 'compact' | 'hero') {
  switch (variant) {
    case 'compact':
      return 'h-10 px-4 text-sm';
    case 'hero':
      return 'h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow';
    default:
      return 'h-12 px-6 text-base';
  }
}
