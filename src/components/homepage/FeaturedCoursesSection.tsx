import {
  BookOpen,
  Filter,
  Target,
  Users,
  MoveLeft,
  MoveRight,
  Brackets,
  Split,
  Globe,
  NotebookPen,
} from 'lucide-react';
import { MobileResponsiveCourseCard } from '@/components/shared';
import { CourseGrid } from '@/components/layout';
import { EnhancedCourse } from '@/sanity/lib/courses/getCourses';
import { MobileResponsiveCategoryFilter } from './MobileResponsiveCategoryFilter';

interface FeaturedCoursesSectionProps {
  filteredCourses: EnhancedCourse[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories: string[];
}

export function FeaturedCoursesSection({
  filteredCourses,
  selectedCategory,
  onCategoryChange,
  categories,
}: FeaturedCoursesSectionProps) {
  // Calculate metadata
  const totalCourses = filteredCourses.length;
  const hasActiveFilter = selectedCategory !== null;
  const categoryCount = categories.length;

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      {/* Enhanced Section Header with Ornaments */}
      <div className="mb-8 sm:mb-10">
        {/* Decorative Top Border */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
          <div className="mx-4 flex items-center space-x-2">
            <MoveLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-light text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] font-serif">
              Featured Courses
            </span>
            <MoveRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
        </div>

        {/* Main Header */}
        <div className="text-center mb-6">
          {/* Subtitle with metadata */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
            {hasActiveFilter && (
              <>
                <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Filtered by: {selectedCategory}</span>
                </div>
              </>
            )}
          </div>

          {/* Category Filter - Now integrated */}
          <div className="mb-6">
            <MobileResponsiveCategoryFilter
              categories={categories}
              onCategoryChange={onCategoryChange}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>

        {/* Metadata Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <NotebookPen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {totalCourses} Total Courses
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <Split className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {categoryCount} Categories
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {
                  new Set(
                    filteredCourses.map(course => course.instructor?.name)
                  ).size
                }{' '}
                Instructors
              </span>
            </div>
          </div>
        </div>

        {/* Additional Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <Brackets className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Jupyter Notebook
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Colab Integration
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Multiple Media/Doc Files per Lesson
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="flex items-center justify-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
          <div className="mx-4 w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
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
          <div className="relative mb-6">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.5s' }}
            ></div>
          </div>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {selectedCategory
              ? `No courses available in the "${selectedCategory}" category.`
              : 'No courses are currently available.'}
          </p>

          {selectedCategory && (
            <button
              onClick={() => onCategoryChange(null)}
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gray-700 hover:bg-gray-800 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Filter className="h-4 w-4 mr-2" />
              View All Courses
            </button>
          )}
        </div>
      )}
    </div>
  );
}
