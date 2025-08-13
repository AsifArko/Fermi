'use client';

import { ResponsiveCourseCard } from '@/components/cards';
import { GetCoursesQueryResult } from '../../../sanity.types';
import { cn } from '@/lib/utils';
import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseMatrixProps {
  courses: GetCoursesQueryResult;
  className?: string;
}

export function CourseMatrix({ courses, className }: CourseMatrixProps) {
  return (
    <section className={cn('py-6 sm:py-8', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Featured Courses
            </h2>
            <span className="text-sm text-muted-foreground">
              {courses.length} courses available
            </span>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" className="h-8 px-3">
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {courses.map(course => (
            <ResponsiveCourseCard
              key={course._id}
              course={course}
              href={`/courses/${course.slug}`}
              variant="featured"
              className="transform transition-all duration-300 hover:scale-[1.02]"
            />
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Grid3X3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-muted-foreground">
              No courses available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
