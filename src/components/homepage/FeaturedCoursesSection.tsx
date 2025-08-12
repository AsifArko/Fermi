import { BookOpen } from 'lucide-react';
import { MobileResponsiveCourseCard } from '@/components/shared/MobileResponsiveCourseCard';
import { CourseGrid } from '@/components/layout/MobileResponsiveGrid';
import { GetCoursesQueryResult } from '../../../sanity.types';

interface FeaturedCoursesSectionProps {
  filteredCourses: GetCoursesQueryResult;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function FeaturedCoursesSection({
  filteredCourses,
  selectedCategory,
  onCategoryChange,
}: FeaturedCoursesSectionProps) {
  return (
    <div className="py-6 sm:py-8 lg:py-12">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedCategory
                ? `${selectedCategory} Courses`
                : 'Featured Courses'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredCourses.length} course
              {filteredCourses.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {/* Mobile: Show selected category prominently */}
          {selectedCategory && (
            <div className="sm:hidden">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium">
                {selectedCategory}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <CourseGrid className="pb-8 sm:pb-12">
          {filteredCourses.map(course => (
            <MobileResponsiveCourseCard
              key={course._id}
              course={course}
              href={`/courses/${course.slug}`}
              variant="featured"
            />
          ))}
        </CourseGrid>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {selectedCategory
              ? `No courses available in the "${selectedCategory}" category.`
              : 'No courses are currently available.'}
          </p>
          {selectedCategory && (
            <button
              onClick={() => onCategoryChange(null)}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View All Courses
            </button>
          )}
        </div>
      )}
    </div>
  );
}
