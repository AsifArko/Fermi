'use client';

import { useState, useMemo } from 'react';
import { UnifiedCourseCard } from '@/components/shared/UnifiedCourseCard';
import { Container, CourseGrid } from '@/components/layout';
import { CategoryFilter } from './CategoryFilter';
import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GetCoursesQueryResult } from '../../../sanity.types';

interface HomepageContentProps {
  courses: GetCoursesQueryResult;
}

export function HomepageContent({ courses }: HomepageContentProps) {
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
    <div className="min-h-screen bg-background pt-16 sm:pt-20">
      <Container maxWidth="7xl" padding="lg">
        {/* Product Catalogue Header */}
        <section className="py-8 sm:py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Course Catalogue
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore our comprehensive collection of advanced technology
              courses
            </p>
          </div>
        </section>

        {/* Category Navigation */}
        <CategoryFilter
          categories={categories}
          onCategoryChange={handleCategoryChange}
        />

        {/* Featured Courses Section */}
        <div className="py-6 sm:py-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {selectedCategory
                  ? `${selectedCategory} Courses`
                  : 'Featured Courses'}
              </h2>
              <span className="text-sm text-muted-foreground bg-accent/60 px-3 py-1 rounded-full">
                {filteredCourses.length} courses available
              </span>
            </div>

            {/* View Controls and Stats */}
            <div className="flex items-center gap-3">
              {/* Course Statistics */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border/50">
                  {filteredCourses.length} courses
                </span>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border/50">
                  {categories.length} categories
                </span>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border/50">
                  {uniqueInstructors} instructors
                </span>
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" className="h-9 px-3">
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <CourseGrid className="pb-8 sm:pb-12">
            {filteredCourses.map(course => (
              <UnifiedCourseCard
                key={course._id}
                course={course}
                href={`/courses/${course.slug}`}
              />
            ))}
          </CourseGrid>
        </div>
      </Container>
    </div>
  );
}
