'use client';

import { useAuth } from '@clerk/nextjs';
import {
  Play,
  GraduationCap,
  Library,
  Tv,
  Brackets,
  FileText,
  LayoutGrid,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Loader } from '@/components/ui/loader';
import { getCourseStats } from '@/lib/courseUtils';
import { EnhancedCourse } from '@/sanity/lib/courses/getCourses';
import { urlFor } from '@/sanity/lib/image';

interface MobileResponsiveCourseCardProps {
  course: EnhancedCourse;
  progress?: number;
  href: string;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

// New Progress Component
function CourseProgress({ progress }: { progress: number }) {
  return (
    <div className='flex items-center gap-3'>
      {/* Thin progress line on the left */}
      <div className='flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-px'>
        <div
          className='bg-gray-400 dark:bg-gray-500 h-px rounded-full transition-all duration-300'
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Percentage text on the right */}
      <div className='text-xs text-gray-500 dark:text-gray-400 min-w-[3rem] text-right'>
        {progress}%
      </div>
    </div>
  );
}

export function MobileResponsiveCourseCard({
  course,
  progress,
  href,
  variant = 'default',
  className = '',
}: MobileResponsiveCourseCardProps) {
  const { isSignedIn } = useAuth();

  if (variant === 'compact') {
    return (
      <Link href={href} prefetch={false} className='block group'>
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
        >
          {/* Compact layout for mobile - increased height */}
          <div className='flex'>
            {/* Image section - reverted to original size */}
            <div className='relative w-24 h-24 flex-shrink-0'>
              {course.image ? (
                <Image
                  src={urlFor(course.image).url() || ''}
                  alt={course.title || 'Course Image'}
                  fill
                  className='object-cover'
                />
              ) : (
                <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center'>
                  <Loader size='sm' />
                </div>
              )}

              {/* Category badge */}
              <div className='absolute top-1 left-1'>
                <span className='text-xs font-medium px-2 py-1 bg-black/70 text-white rounded-full'>
                  {course.category?.name || 'Course'}
                </span>
              </div>
            </div>

            {/* Content section - increased padding */}
            <div className='flex-1 p-4 flex flex-col justify-between'>
              <div>
                <h3 className='font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-2'>
                  {course.title}
                </h3>
                <div className='group/desc relative mb-3'>
                  <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-4 text-justify leading-relaxed'>
                    {course.description}
                  </p>
                  {/* Tooltip for full description */}
                  {course.description && course.description.length > 80 && (
                    <div className='absolute bottom-full left-0 right-0 mb-2 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 rounded-lg p-3 opacity-0 group-hover/desc:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg border border-gray-700 dark:border-gray-600 max-w-xs'>
                      <p className='text-xs leading-relaxed text-justify'>
                        {course.description}
                      </p>
                      {/* Arrow pointing down */}
                      <div className='absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800'></div>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className='flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mb-2'>
                  {(() => {
                    const stats = getCourseStats(course);
                    return (
                      <>
                        <div className='flex items-center space-x-1'>
                          <LayoutGrid className='w-3 h-3' />
                          <span>{stats.modules}</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Library className='w-3 h-3' />
                          <span>{stats.lessons}</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Tv className='w-3 h-3' />
                          <span>{stats.videos}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Progress component */}
              {isSignedIn && typeof progress === 'number' && (
                <div className='mt-2'>
                  <CourseProgress progress={progress} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={href} prefetch={false} className='block group'>
        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
        >
          {/* Featured image - reverted to original size */}
          <div className='relative h-48 sm:h-56 overflow-hidden'>
            {course.image ? (
              <Image
                src={urlFor(course.image).url() || ''}
                alt={course.title || 'Course Image'}
                fill
                className='object-cover transition-transform duration-300 group-hover:scale-105'
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center'>
                <Loader size='lg' />
              </div>
            )}

            {/* Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

            {/* Play button */}
            <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30'>
                <Play className='w-5 h-5 text-white ml-0.5' fill='white' />
              </div>
            </div>

            {/* Badges */}
            <div className='absolute bottom-4 left-4 right-4 flex items-center justify-between'>
              <span className='text-xs font-semibold px-3 py-1.5 bg-black/70 text-white rounded-full'>
                {course.category?.name || 'Course'}
              </span>
              {'price' in course && typeof course.price === 'number' && (
                <span className='text-white font-bold px-3 py-1.5 bg-black/70 rounded-full text-xs'>
                  {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                </span>
              )}
            </div>
          </div>

          {/* Metadata under image */}
          <div className='px-4 py-2 bg-gray-50 dark:bg-gray-800/30'>
            <div className='flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400'>
              {(() => {
                const stats = getCourseStats(course);
                return (
                  <>
                    <div className='flex items-center space-x-1'>
                      <LayoutGrid className='w-3 h-3' />
                      <span>{stats.modules}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Library className='w-3 h-3' />
                      <span>{stats.lessons}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Tv className='w-3 h-3' />
                      <span>{stats.videos}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Brackets className='w-3 h-3' />
                      <span>{stats.notebooks}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <FileText className='w-3 h-3' />
                      <span>{stats.files}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Progress component under image */}
          {isSignedIn && typeof progress === 'number' && (
            <div className='px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700'>
              <CourseProgress progress={progress} />
            </div>
          )}

          {/* Content - increased padding for more height */}
          <div className='p-5 flex flex-col'>
            <h3 className='font-semibold text-base text-gray-900 dark:text-white mb-3 line-clamp-2'>
              {course.title}
            </h3>
            <div className='group/desc relative mb-5'>
              <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-3 text-justify leading-relaxed'>
                {course.description}
              </p>
              {/* Tooltip for full description */}
              {course.description && course.description.length > 100 && (
                <div className='absolute bottom-full left-0 right-0 mb-2 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 rounded-lg p-3 opacity-0 group-hover/desc:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg border border-gray-700 dark:border-gray-600 max-w-xs'>
                  <p className='text-xs leading-relaxed text-justify'>
                    {course.description}
                  </p>
                  {/* Arrow pointing down */}
                  <div className='absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800'></div>
                </div>
              )}
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    {course.instructor.photo ? (
                      <div className='relative h-8 w-8 mr-3'>
                        <Image
                          src={urlFor(course.instructor.photo).url() || ''}
                          alt={course.instructor.name || 'Instructor'}
                          fill
                          className='rounded-full object-cover border-2 border-gray-200 dark:border-gray-600'
                        />
                      </div>
                    ) : (
                      <div className='h-8 w-8 mr-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center'>
                        <GraduationCap className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                      </div>
                    )}
                    <div>
                      <span className='text-sm font-medium text-gray-900 dark:text-white'>
                        by {course.instructor.name}
                      </span>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        Expert Instructor
                      </div>
                    </div>
                  </div>
                  <GraduationCap className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={href} prefetch={false} className='block group'>
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      >
        {/* Image - reverted to original size */}
        <div className='relative h-40 sm:h-48 overflow-hidden'>
          {course.image ? (
            <Image
              src={urlFor(course.image).url() || ''}
              alt={course.title || 'Course Image'}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center'>
              <Loader size='md' />
            </div>
          )}

          {/* Category badge */}
          <div className='absolute top-3 left-3'>
            <span className='text-xs font-medium px-2 py-1 bg-black/70 text-white rounded-full'>
              {course.category?.name || 'Course'}
            </span>
          </div>

          {/* Price badge */}
          {'price' in course && typeof course.price === 'number' && (
            <div className='absolute top-3 right-3'>
              <span className='text-xs font-bold px-2 py-1 bg-black/70 text-white rounded-full'>
                {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
              </span>
            </div>
          )}
        </div>

        {/* Metadata under image */}
        <div className='px-4 py-2 bg-gray-50 dark:bg-gray-800/30'>
          <div className='flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400'>
            {(() => {
              const stats = getCourseStats(course);
              return (
                <>
                  <div className='flex items-center space-x-1'>
                    <LayoutGrid className='w-3 h-3' />
                    <span>{stats.modules}</span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <Library className='w-3 h-3' />
                    <span>{stats.lessons}</span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <Tv className='w-3 h-3' />
                    <span>{stats.videos}</span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <Brackets className='w-3 h-3' />
                    <span>{stats.notebooks}</span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <FileText className='w-3 h-3' />
                    <span>{stats.files}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Progress component under image */}
        {isSignedIn && typeof progress === 'number' && (
          <div className='px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700'>
            <CourseProgress progress={progress} />
          </div>
        )}

        {/* Content - increased padding for more height */}
        <div className='p-4 flex flex-col'>
          <h3 className='font-semibold text-sm text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors'>
            {course.title}
          </h3>
          <div className='group/desc relative mb-4'>
            <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-3 text-justify leading-relaxed'>
              {course.description}
            </p>
            {/* Tooltip for full description */}
            {course.description && course.description.length > 100 && (
              <div className='absolute bottom-full left-0 right-0 mb-2 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 rounded-lg p-3 opacity-0 group-hover/desc:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg border border-gray-700 dark:border-gray-600 max-w-xs'>
                <p className='text-xs leading-relaxed text-justify'>
                  {course.description}
                </p>
                {/* Arrow pointing down */}
                <div className='absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800'></div>
              </div>
            )}
          </div>

          {/* Instructor */}
          {course.instructor && (
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  {course.instructor.photo ? (
                    <div className='relative h-8 w-8 mr-3'>
                      <Image
                        src={urlFor(course.instructor.photo).url() || ''}
                        alt={course.instructor.name || 'Instructor'}
                        fill
                        className='rounded-full object-cover border-2 border-gray-200 dark:border-gray-600'
                      />
                    </div>
                  ) : (
                    <div className='h-8 w-8 mr-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center'>
                      <GraduationCap className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                    </div>
                  )}
                  <div>
                    <span className='text-sm font-medium text-gray-900 dark:text-white'>
                      by {course.instructor.name}
                    </span>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                      Expert Instructor
                    </div>
                  </div>
                </div>
                <GraduationCap className='h-5 w-5 text-gray-500 dark:text-gray-400' />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
