import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getEnrolledCourses } from '@/sanity/lib/student/getEnrolledCourses';
import Link from 'next/link';
import { GraduationCap, BookOpen, ArrowRight, Plus } from 'lucide-react';
import { getCourseProgress } from '@/sanity/lib/courses/getCourseProgress';
import { MobileResponsiveCourseCard } from '@/components/shared/MobileResponsiveCourseCard';
import { MyCoursesGrid } from '@/components/layout/MobileResponsiveGrid';
import { generateRandomHash } from '@/lib/utils';
import { EnhancedCourse } from '@/sanity/lib/courses/getCourses';

export default async function MobileResponsiveMyCoursesPage() {
  const user = await currentUser();
  if (!user?.id) {
    return redirect('/');
  }

  const enrolledCourses = await getEnrolledCourses(user.id);

  // Get progress for each enrolled course
  const coursesWithProgress = await Promise.all(
    enrolledCourses.map(async enrollment => {
      const { course } = enrollment;
      if (!course) return null;
      const progress = await getCourseProgress(user.id, course._id);
      return {
        course,
        progress: progress.courseProgress,
      };
    })
  );

  // Filter out courses with null slugs
  const validCourses = coursesWithProgress.filter(
    item => item && item.course && item.course.slug !== null
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <GraduationCap className="h-6 sm:h-8 w-6 sm:w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  My Courses
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Continue learning where you left off
                </p>
              </div>
            </div>

            {/* Browse Courses Button */}
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base font-medium"
            >
              <Plus className="h-4 w-4" />
              Browse Courses
            </Link>
          </div>

          {/* Progress Overview */}
          {validCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Courses
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {validCourses.length}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      In Progress
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {
                        validCourses.filter(
                          item => item && item.progress && item.progress < 100
                        ).length
                      }
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-gray-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Completed
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {
                        validCourses.filter(
                          item => item && item.progress && item.progress === 100
                        ).length
                      }
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-gray-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Courses Section */}
        {validCourses.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-gray-500 dark:text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                No courses yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm sm:text-base">
                You haven&apos;t enrolled in any courses yet. Start your
                learning journey by exploring our course catalog!
              </p>
              <Link
                href="/"
                prefetch={false}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <BookOpen className="h-4 w-4" />
                Browse Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="pb-8 sm:pb-12">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Your Learning Path
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Pick up where you left off or start a new course
              </p>
            </div>

            <MyCoursesGrid>
              {validCourses.map(item => {
                if (!item || !item.course) return null;

                return (
                  <MobileResponsiveCourseCard
                    key={`${item.course._id}::${generateRandomHash()}`}
                    course={item.course as unknown as EnhancedCourse}
                    progress={item.progress}
                    href={`/dashboard/courses/${item.course._id}`}
                    variant="default"
                  />
                );
              })}
            </MyCoursesGrid>
          </div>
        )}
      </div>
    </div>
  );
}
