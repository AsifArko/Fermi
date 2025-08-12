'use client';

import { useState, useMemo } from 'react';
import { MobileResponsiveCategoryFilter } from './MobileResponsiveCategoryFilter';
import { ScientificHero } from './ScientificHero';
import { StatsSection } from './StatsSection';
import { FeaturedCoursesSection } from './FeaturedCoursesSection';
import { GetCoursesQueryResult } from '../../../sanity.types';

interface MobileResponsiveHomepageContentProps {
  courses: GetCoursesQueryResult;
}

export function MobileResponsiveHomepageContent({
  courses,
}: MobileResponsiveHomepageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories from courses
  const categories = useMemo(() => {
    return courses.reduce((acc: string[], course) => {
      if (course.category?.name && !acc.includes(course.category.name)) {
        acc.push(course.category.name);
      }
      return acc;
    }, []);
  }, [courses]);

  // Count unique instructors
  const uniqueInstructors = useMemo(() => {
    return new Set(courses.map(course => course.instructor?.name)).size;
  }, [courses]);

  // Filter courses based on selected category
  const filteredCourses = useMemo(() => {
    if (!selectedCategory) return courses;
    return courses.filter(course => course.category?.name === selectedCategory);
  }, [courses, selectedCategory]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Scientific Hero Section */}
        <ScientificHero />

        {/* Category Filter */}
        <MobileResponsiveCategoryFilter
          categories={categories}
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
        />

        {/* Stats Section */}
        <StatsSection
          coursesCount={courses.length}
          categoriesCount={categories.length}
          instructorsCount={uniqueInstructors}
          filteredCoursesCount={filteredCourses.length}
        />

        {/* Featured Courses Section */}
        <FeaturedCoursesSection
          filteredCourses={filteredCourses}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </div>
  );
}
