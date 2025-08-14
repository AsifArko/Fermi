'use client';

import { Play, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Loader } from '@/components/ui/loader';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';

import { GetCoursesQueryResult } from '../../../sanity.types';
import { ProgressBadge } from '../progress/ProgressBadge';
import { Tooltip } from '../shared/Tooltip';
import {
  CourseTitle,
  CourseDescription,
  CategoryBadge,
  PriceBadge,
  InstructorName,
  InstructorRole,
} from '../shared/Typography';

interface MobileCourseCardProps {
  course: GetCoursesQueryResult[number];
  variant?: 'featured' | 'my-courses' | 'search';
  showProgress?: boolean;
  progress?: number;
  className?: string;
  href: string;
}

export function MobileCourseCard({
  course,
  showProgress = false,
  progress,
  className,
  href,
}: Omit<MobileCourseCardProps, 'variant'>) {
  return (
    <Link
      href={href}
      prefetch={false}
      className='group block touch-manipulation'
    >
      <div
        className={cn(
          'relative bg-gradient-to-bl from-card via-card to-card/80 rounded-lg overflow-hidden',
          'shadow-md transition-all duration-200 ease-out',
          'active:scale-95 active:shadow-lg',
          'border border-border/50',
          'h-[340px] w-full', // Increased height for better proportions
          className
        )}
      >
        {/* Image section - smaller for mobile */}
        <div className='relative h-32 w-full overflow-hidden'>
          {course.image ? (
            <Image
              src={urlFor(course.image).url() || ''}
              alt={course.title || 'Course Image'}
              fill
              className='object-cover transition-all duration-300 group-active:scale-105'
            />
          ) : (
            <div className='h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50'>
              <Loader size='md' />
            </div>
          )}

          {/* Gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70' />

          {/* Play button - always visible on mobile */}
          <div className='absolute top-2 right-2'>
            <div className='w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30'>
              <Play className='w-4 h-4 text-white ml-0.5' fill='white' />
            </div>
          </div>

          {/* Category and price badges */}
          <div className='absolute bottom-2 left-2 right-2 flex items-center justify-between'>
            <CategoryBadge className='text-xs px-2 py-1'>
              {course.category?.name || 'Uncategorized'}
            </CategoryBadge>
            {'price' in course && typeof course.price === 'number' && (
              <PriceBadge className='text-xs px-2 py-1'>
                {course.price === 0
                  ? 'Free'
                  : `$${course.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </PriceBadge>
            )}
          </div>
        </div>

        {/* Content section - compact for mobile */}
        <div className='p-3 flex flex-col flex-1 relative'>
          {/* Title - smaller for mobile */}
          <CourseTitle className='mb-2 text-sm'>{course.title}</CourseTitle>

          {/* Description with tooltip - limited to 2 lines */}
          <Tooltip
            content={course.description || ''}
            position='top'
            delay={500}
          >
            <div className='flex-1'>
              <CourseDescription className='mb-2 text-xs'>
                {course.description}
              </CourseDescription>
            </div>
          </Tooltip>

          {/* Instructor information - compact for mobile */}
          {course.instructor && (
            <div className='flex items-center justify-between mb-2 p-2 rounded-lg border border-border/50 bg-gradient-to-r from-background to-primary/5'>
              <div className='flex items-center'>
                {course.instructor.photo ? (
                  <div className='relative h-6 w-6 mr-2'>
                    <Image
                      src={urlFor(course.instructor.photo).url() || ''}
                      alt={course.instructor.name || 'Instructor'}
                      fill
                      className='rounded-full object-cover border border-white/20'
                    />
                  </div>
                ) : (
                  <div className='h-6 w-6 mr-2 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/20'>
                    <Loader size='sm' />
                  </div>
                )}
                <div>
                  <InstructorName className='text-xs'>
                    by {course.instructor.name}
                  </InstructorName>
                  <InstructorRole className='text-xs'>
                    Expert Instructor
                  </InstructorRole>
                </div>
              </div>
              <GraduationCap className='h-4 w-4 text-primary/80' />
            </div>
          )}

          {/* Progress display */}
          {showProgress && typeof progress === 'number' && (
            <div className='mt-auto flex items-center justify-between'>
              <span className='text-xs text-muted-foreground font-medium'>
                Progress
              </span>
              <ProgressBadge
                progress={progress}
                size='sm'
                variant={progress >= 100 ? 'success' : 'default'}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
