'use client';

import { useState, useMemo } from 'react';
import { ScientificHero } from './ScientificHero';
import { FeaturedCoursesSection } from './FeaturedCoursesSection';
import { EnhancedCourse } from '@/sanity/lib/courses/getCourses';

interface MobileResponsiveHomepageContentProps {
  courses: EnhancedCourse[];
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

  // Filter courses based on selected category
  const filteredCourses = useMemo(() => {
    if (!selectedCategory) return courses;
    return courses.filter(course => course.category?.name === selectedCategory);
  }, [courses, selectedCategory]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Scientific Hero Section */}
        <ScientificHero />

        {/* Featured Courses Section - Now includes the category filter */}
        <FeaturedCoursesSection
          filteredCourses={filteredCourses}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />
      </div>
    </div>
  );
}
