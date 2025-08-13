'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, GraduationCap } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import { Loader } from '@/components/ui/loader';
import { GetCoursesQueryResult } from '../../../sanity.types';
import { cn } from '@/lib/utils';

interface CourseCardBaseProps {
  course: GetCoursesQueryResult[number];
  variant?: 'home' | 'dashboard' | 'search';
  showProgress?: boolean;
  className?: string;
  href: string;
}

const cardVariants = {
  home: 'h-[400px] sm:h-[450px]',
  dashboard: 'h-[500px] sm:h-[540px]',
  search: 'h-[450px] sm:h-[500px]',
} as const;

const imageVariants = {
  home: 'h-48 sm:h-56',
  dashboard: 'h-56 sm:h-64',
  search: 'h-52 sm:h-60',
} as const;

export function CourseCardBase({
  course,
  variant = 'home',
  showProgress = false,
  className,
  href,
}: CourseCardBaseProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group hover:no-underline block"
    >
      <div
        className={cn(
          'relative bg-gradient-to-bl from-card via-card to-card/80 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-primary/10 hover:translate-y-[-8px] border border-border/50 hover:border-primary/20 group-hover:bg-gradient-to-bl group-hover:from-card group-hover:via-card/95 group-hover:to-primary/5',
          cardVariants[variant],
          className
        )}
      >
        {/* Floating background elements - only on hover */}
        <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {/* Floating particles */}
          <div
            className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <div
            className="absolute bottom-6 left-6 w-1 h-1 bg-secondary/40 rounded-full animate-pulse"
            style={{ animationDuration: '4s', animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '2s' }}
          />

          {/* Geometric shapes */}
          <div
            className="absolute top-6 right-6 w-4 h-4 border border-primary/10 rotate-45 animate-spin"
            style={{ animationDuration: '20s' }}
          />
          <div
            className="absolute bottom-8 left-8 w-3 h-3 border border-secondary/15 rotate-45 animate-spin"
            style={{ animationDuration: '25s', animationDirection: 'reverse' }}
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
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Loader size="lg" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />

          {/* Floating play button */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <Play
                className="w-4 sm:w-5 h-4 sm:h-5 text-white ml-0.5"
                fill="white"
              />
            </div>
          </div>

          {/* Category and price badges */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1.5 sm:py-2 bg-black/60 backdrop-blur-md text-white rounded-full border border-white/20 shadow-lg">
              {course.category?.name || 'Uncategorized'}
            </span>
            {'price' in course && typeof course.price === 'number' && (
              <span className="text-white font-bold px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/80 to-primary/60 backdrop-blur-md rounded-full border border-primary/30 shadow-lg text-xs sm:text-sm">
                {course.price === 0
                  ? 'Free'
                  : `$${course.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}`}
              </span>
            )}
          </div>
        </div>

        {/* Content section */}
        <div className="p-4 sm:p-6 flex flex-col flex-1 relative">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/80 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 leading-tight">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 line-clamp-2 flex-1 leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">
            {course.description}
          </p>

          {/* Instructor information */}
          {course.instructor && (
            <div className="flex items-center justify-between mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl border border-border/50 overflow-hidden group-hover:border-primary/20 transition-all duration-300 bg-gradient-to-r from-background to-primary/5">
              <div className="flex items-center">
                {course.instructor.photo ? (
                  <div className="relative h-8 sm:h-10 w-8 sm:w-10 mr-2 sm:mr-3">
                    <Image
                      src={urlFor(course.instructor.photo).url() || ''}
                      alt={course.instructor.name || 'Instructor'}
                      fill
                      className="rounded-full object-cover border-2 border-white/20 shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="h-8 sm:h-10 w-8 sm:w-10 mr-2 sm:mr-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white/20">
                    <Loader size="sm" />
                  </div>
                )}
                <div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    by {course.instructor.name}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Expert Instructor
                  </div>
                </div>
              </div>
              <GraduationCap className="h-4 sm:h-5 w-4 sm:w-5 text-primary/80 group-hover:text-primary transition-colors duration-300" />
            </div>
          )}

          {/* Progress display placeholder - will be implemented separately */}
          {showProgress && (
            <div className="mt-auto">
              {/* Progress component will be added here */}
              <div className="h-8 bg-muted rounded animate-pulse" />
            </div>
          )}

          {/* Decorative accent line */}
          <div className="absolute bottom-0 left-4 sm:left-6 right-4 sm:right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </Link>
  );
}
