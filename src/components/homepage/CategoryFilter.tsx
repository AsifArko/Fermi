'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  onCategoryChange: (category: string | null) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  onCategoryChange,
  className,
}: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      // If clicking the same category, deselect it (show all courses)
      setSelectedCategory(null);
      onCategoryChange(null);
    } else {
      // Select the new category
      setSelectedCategory(category);
      onCategoryChange(category);
    }
  };

  return (
    <section className={cn('py-6 border-b border-border/20 mb-8', className)}>
      <div className="flex flex-wrap justify-center gap-3">
        <span
          onClick={() => handleCategoryClick('all')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-full border cursor-pointer transition-colors',
            selectedCategory === null || selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'text-foreground bg-muted/50 border-border/50 hover:bg-primary/10 hover:border-primary/30'
          )}
        >
          All Courses
        </span>
        {categories.map(category => (
          <span
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-full border cursor-pointer transition-colors',
              selectedCategory === category
                ? 'bg-primary text-primary-foreground border-primary'
                : 'text-foreground bg-muted/50 border-border/50 hover:bg-primary/10 hover:border-primary/30'
            )}
          >
            {category}
          </span>
        ))}
      </div>
    </section>
  );
}
