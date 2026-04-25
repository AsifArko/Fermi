'use client';

import { useAuth } from '@clerk/nextjs';
import { Play, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Loader } from '@/components/ui/loader';
import { urlFor } from '@/sanity/lib/image';

import { GetCoursesQueryResult } from '../../../sanity.types';

interface UnifiedCourseCardProps {
  course: GetCoursesQueryResult[number];
  progress?: number;
  href: string;
  className?: string;
}

export function UnifiedCourseCard({
  course,
  progress,
  href,
  className,
}: UnifiedCourseCardProps) {
  const { isSignedIn } = useAuth();

  return (
    <Link
      href={href}
      prefetch={false}
      className='group hover:no-underline block'
    >
      <div
        className={`relative h-[580px] md:h-[585px] bg-gradient-to-bl from-card via-card to-card/80 rounded-sm sm:rounded-m overflow-hidden  transition-all duration-500 ease-out hover:translate-y-[-8px] border border-border/50 hover:border-primary/20 group-hover:bg-gradient-to-bl group-hover:from-card group-hover:via-card/95 group-hover:to-primary/5 ${className || ''}`}
      >
        {/* Floating background elements */}
        <div className='absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
          {/* Floating particles */}
          <div
            className='absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full animate-pulse'
            style={{ animationDuration: '3s' }}
          ></div>
          <div
            className='absolute bottom-6 left-6 w-1 h-1 bg-secondary/40 rounded-full animate-pulse'
            style={{ animationDuration: '4s', animationDelay: '1s' }}
          ></div>
          <div
            className='absolute top-1/2 right-8 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse'
            style={{ animationDuration: '5s', animationDelay: '2s' }}
          ></div>

          {/* Geometric shapes */}
          <div
            className='absolute top-6 right-6 w-4 h-4 border border-primary/10 rotate-45 animate-spin'
            style={{ animationDuration: '20s' }}
          ></div>
          <div
            className='absolute bottom-8 left-8 w-3 h-3 border border-secondary/15 rotate-45 animate-spin'
            style={{ animationDuration: '25s', animationDirection: 'reverse' }}
          ></div>
        </div>

        {/* Image section with enhanced overlay */}
        <div className='relative h-48 sm:h-56 md:h-64 w-full overflow-hidden'>
          {course.image ? (
            <Image
              src={urlFor(course.image).url() || ''}
              alt={course.title || 'Course Image'}
              fill
              className='object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1'
            />
          ) : (
            <div className='h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50'>
              <Loader size='lg' />
            </div>
          )}

          {/* Enhanced gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500' />

          {/* Floating play button */}
          <div className='absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0'>
            <div className='w-10 sm:w-12 h-10 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30'>
              <Play
                className='w-4 sm:w-5 h-4 sm:h-5 text-white ml-0.5'
                fill='white'
              />
            </div>
          </div>

          {/* Category and price badges with enhanced styling */}
          <div className='absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between'>
            <span className='text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1.5 sm:py-2 bg-black/60 backdrop-blur-md text-white rounded-full border border-white/20 shadow-lg'>
              {course.category?.name || 'Uncategorized'}
            </span>
            {'price' in course && typeof course.price === 'number' && (
              <span className='text-white font-bold px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/80 to-primary/60 backdrop-blur-md rounded-full border border-primary/30 shadow-lg text-xs sm:text-sm'>
                {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
              </span>
            )}
          </div>
        </div>

        {/* Thin progress line - positioned below image, above title */}
        {isSignedIn && typeof progress === 'number' && (
          <div className='px-3 sm:px-4 lg:px-5 py-2 mb-0'>
            {/* Wrapper div for progress line and percentage */}
            <div className='flex items-center justify-center space-x-2'>
              {/* Progress line in its own div */}
              <div className='flex-1 h-px bg-muted/40 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-primary/60 transition-all duration-500 ease-out rounded-full'
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Percentage text */}
              <span className='text-[10px] text-muted-foreground/60 font-medium bg-background px-1'>
                {progress}%
              </span>
            </div>
          </div>
        )}

        {/* Content section */}
        <div className='p-3 sm:p-4 lg:p-5 flex flex-col flex-1 relative'>
          {/* Title */}
          <div className='p-2 sm:p-3 mb-2 sm:mb-3'>
            <h3 className='text-base sm:text-lg lg:text-m font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300'>
              {course.title}
            </h3>
          </div>

          {/* Description */}
          <div className='relative mb-4 sm:mb-6 flex-1 group'>
            <div className='h-24 sm:h-26 overflow-hidden p-2 sm:p-3'>
              <p className='text-xs sm:text-sm text-muted-foreground/70 line-clamp-5'>
                {course.description}
              </p>
            </div>
            {/* Full description tooltip on hover - positioned above to avoid overflow */}
            <div className='absolute bottom-full left-0 right-0 mb-2 bg-background/95 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg border border-border/50'>
              <p className='text-xs sm:text-sm text-foreground line-clamp-none'>
                {course.description}
              </p>
              {/* Arrow pointing down */}
              <div className='absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-background/95'></div>
            </div>
          </div>

          {/* Instructor information */}
          {course.instructor && (
            <div
              className='relative flex items-center justify-between mb-3 sm:mb-4 p-2 sm:p-3 rounded-sm border border-border/50 overflow-hidden group-hover:border-primary/20 transition-all duration-300'
              style={{
                background:
                  'linear-gradient(135deg, var(--background), var(--primary)/10 80%)',
              }}
            >
              {/* Softly pulsing ring SVG accent, top-left, non-overlapping */}
              <svg
                className='absolute top-2 left-2 w-4 sm:w-5 h-4 sm:h-5 opacity-10 animate-pulse-slow pointer-events-none'
                style={{ marginTop: '2px', marginLeft: '2px' }}
                viewBox='0 0 32 32'
                fill='none'
              >
                <circle
                  cx='16'
                  cy='16'
                  r='13'
                  stroke='currentColor'
                  strokeWidth='2'
                />
              </svg>
              <div className='flex items-center relative z-10'>
                {course.instructor.photo ? (
                  <div className='relative h-8 sm:h-10 w-8 sm:w-10 mr-2 sm:mr-3'>
                    <Image
                      src={urlFor(course.instructor.photo).url() || ''}
                      alt={course.instructor.name || 'Instructor'}
                      fill
                      className='rounded-full object-cover border-2 border-white/20 shadow-sm'
                    />
                  </div>
                ) : (
                  <div className='h-8 sm:h-10 w-8 sm:w-10 mr-2 sm:mr-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white/20'>
                    <Loader size='sm' />
                  </div>
                )}
                <div>
                  <span className='text-xs sm:text-sm font-medium text-foreground'>
                    by {course.instructor.name}
                  </span>
                  <div className='text-xs text-muted-foreground'>
                    Expert Instructor
                  </div>
                </div>
              </div>
              <GraduationCap className='h-4 sm:h-5 w-4 sm:w-5 text-primary/80 group-hover:text-primary transition-colors duration-300 relative z-10' />
            </div>
          )}

          {/* Decorative accent line */}
          <div className='absolute bottom-0 left-4 sm:left-6 right-4 sm:right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
        </div>
      </div>
    </Link>
  );
}
