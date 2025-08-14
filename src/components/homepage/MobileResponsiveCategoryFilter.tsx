'use client';

import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface MobileResponsiveCategoryFilterProps {
  categories: string[];
  onCategoryChange: (category: string | null) => void;
  selectedCategory: string | null;
}

export function MobileResponsiveCategoryFilter({
  categories,
  onCategoryChange,
  selectedCategory,
}: MobileResponsiveCategoryFilterProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCategorySelect = (category: string | null) => {
    onCategoryChange(category);
    setIsMobileMenuOpen(false);
  };

  const clearFilter = () => {
    onCategoryChange(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className='w-full'>
      {/* Desktop/Tablet View */}
      <div className='hidden sm:block'>
        <div className='flex flex-wrap items-center justify-center gap-3 mb-8'>
          {/* All Courses Button */}
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleCategorySelect(null)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
              selectedCategory === null
                ? 'bg-gray-700 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            All Courses
          </Button>

          {/* Category Buttons */}
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size='sm'
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gray-700 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className='sm:hidden'>
        <div className='mb-6'>
          {/* Mobile Filter Button */}
          <Button
            variant='outline'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='w-full justify-between px-4 py-3 text-left font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          >
            <span>
              {selectedCategory
                ? `Category: ${selectedCategory}`
                : 'All Categories'}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className='mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden'>
              {/* All Courses Option */}
              <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedCategory === null
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                All Courses
              </button>

              {/* Category Options */}
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedCategory === category
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}

              {/* Clear Filter Option */}
              {selectedCategory && (
                <button
                  onClick={clearFilter}
                  className='w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-200 dark:border-gray-700'
                >
                  <div className='flex items-center'>
                    <X className='h-4 w-4 mr-2' />
                    Clear Filter
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Selected Category Display */}
        {selectedCategory && (
          <div className='flex items-center justify-between bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 mb-6'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Showing: {selectedCategory} courses
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={clearFilter}
              className='h-6 px-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
