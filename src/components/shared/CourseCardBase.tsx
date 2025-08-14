'use client';

import { Play, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Loader } from '@/components/ui/loader';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';

import { GetCoursesQueryResult } from '../../../sanity.types';
import { ProgressBadge } from '../progress/ProgressBadge';

import { Tooltip } from './Tooltip';
import {
  CourseTitle,
  CourseDescription,
  CategoryBadge,
  PriceBadge,
  InstructorName,
  InstructorRole,
} from './Typography';

interface CourseCardBaseProps {
  course: GetCoursesQueryResult[number];
  variant?: 'featured' | 'my-courses' | 'search';
  showProgress?: boolean;
  progress?: number;
  className?: string;
  href: string;
}

const cardVariants = {
  featured: 'h-[580px] md:h-[560px]',
  'my-courses': 'h-[580px] md:h-[560px]',
  search: 'h-[580px] md:h-[560px]',
} as const;

const imageVariants = {
  featured: 'h-48 sm:h-56 md:h-64',
  'my-courses': 'h-48 sm:h-56 md:h-64',
  search: 'h-48 sm:h-56 md:h-64',
} as const;

export function CourseCardBase({
  course,
  variant = 'featured',
  showProgress = false,
  progress,
  className,
  href,
}: CourseCardBaseProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className='group hover:no-underline block'
    >
      <div
        className={cn(
          'relative bg-gradient-to-bl from-card via-card to-card/80 rounded-xl sm:rounded-2xl overflow-hidden',
          'shadow-lg transition-all duration-300 ease-out',
          'hover:shadow-2xl hover:shadow-primary/10 hover:translate-y-[-4px]',
          'border border-border/50 hover:border-primary/20',
          'group-hover:bg-gradient-to-bl group-hover:from-card group-hover:via-card/95 group-hover:to-primary/5',
          cardVariants[variant],
          className
        )}
      >
        {/* Floating background elements - only on hover */}
        <div className='absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
          {/* Subtle floating elements */}
          <div
            className='absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full animate-pulse'
            style={{ animationDuration: '3s' }}
          />
          <div
            className='absolute bottom-6 left-6 w-1 h-1 bg-secondary/40 rounded-full animate-pulse'
            style={{ animationDuration: '4s', animationDelay: '1s' }}
          />
          <div
            className='absolute top-1/2 right-8 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse'
            style={{ animationDuration: '5s', animationDelay: '2s' }}
          />
        </div>

        {/* Image section */}
        <div
          className={cn(
            'relative w-full overflow-hidden',
            imageVariants[variant]
          )}
        >
          {course.image ? (
            <Image
              src={urlFor(course.image).url() || ''}
              alt={course.title || 'Course Image'}
              fill
              className='object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1'
            />
          ) : (
            <div className='h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50'>
              <Loader size='lg' />
            </div>
          )}

          {/* Gradient overlay */}
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

          {/* Category and price badges */}
          <div className='absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between'>
            <CategoryBadge>
              {course.category?.name || 'Uncategorized'}
            </CategoryBadge>
            {'price' in course && typeof course.price === 'number' && (
              <PriceBadge>
                {course.price === 0
                  ? 'Free'
                  : `$${course.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </PriceBadge>
            )}
          </div>
        </div>

        {/* Content section */}
        <div className='p-3 sm:p-4 lg:p-5 flex flex-col flex-1 relative'>
          {/* Title */}
          <CourseTitle className='mb-2 sm:mb-3'>{course.title}</CourseTitle>

          {/* Description with tooltip */}
          <Tooltip content={course.description || ''} position='top'>
            <div className='flex-1'>
              <CourseDescription className='mb-3 sm:mb-4'>
                {course.description}
              </CourseDescription>
            </div>
          </Tooltip>

          {/* Instructor information */}
          {course.instructor && (
            <div className='flex items-center justify-between mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl border border-border/50 overflow-hidden group-hover:border-primary/20 transition-all duration-300 bg-gradient-to-r from-background to-primary/5'>
              <div className='flex items-center'>
                {course.instructor.photo ? (
                  <div className='relative h-7 sm:h-8 w-7 sm:w-8 mr-2 sm:mr-3'>
                    <Image
                      src={urlFor(course.instructor.photo).url() || ''}
                      alt={course.instructor.name || 'Instructor'}
                      fill
                      className='rounded-full object-cover border-2 border-white/20 shadow-sm'
                    />
                  </div>
                ) : (
                  <div className='h-7 sm:h-8 w-7 sm:w-8 mr-2 sm:mr-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white/20'>
                    <Loader size='sm' />
                  </div>
                )}
                <div>
                  <InstructorName>by {course.instructor.name}</InstructorName>
                  <InstructorRole>Expert Instructor</InstructorRole>
                </div>
              </div>
              <GraduationCap className='h-4 sm:h-5 w-4 sm:w-5 text-primary/80 group-hover:text-primary transition-colors duration-300' />
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

          {/* Decorative accent line */}
          <div className='absolute bottom-0 left-3 sm:left-4 lg:left-5 right-3 sm:right-4 lg:right-5 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
        </div>
      </div>
    </Link>
  );
}
