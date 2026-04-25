import { Search, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { SearchGrid } from '@/components/layout/MobileResponsiveGrid';
import { MobileResponsiveCourseCard } from '@/components/shared/MobileResponsiveCourseCard';
import { EnhancedCourse } from '@/sanity/lib/courses/getCourses';
import { searchCourses } from '@/sanity/lib/courses/searchCourses';

interface MobileResponsiveSearchPageProps {
  searchParams: Promise<{
    term?: string;
  }>;
}

export default async function MobileResponsiveSearchPage({
  searchParams,
}: MobileResponsiveSearchPageProps) {
  const { term } = await searchParams;

  if (!term) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 pt-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center py-12 sm:py-16'>
            <div className='p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center'>
              <Search className='h-10 w-10 text-gray-500 dark:text-gray-400' />
            </div>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Search Courses
            </h1>
            <p className='text-gray-600 dark:text-gray-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto'>
              Enter a search term to discover courses that match your interests
              and learning goals
            </p>

            {/* Popular Search Suggestions */}
            <div className='max-w-2xl mx-auto'>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                Popular searches:
              </p>
              <div className='flex flex-wrap justify-center gap-3'>
                {[
                  'Machine Learning',
                  'Python',
                  'Quantum Computing',
                  'GPU Programming',
                  'Data Science',
                  'AI',
                  'JavaScript',
                  'React',
                ].map(suggestion => (
                  <Link
                    key={suggestion}
                    href={`/search?term=${encodeURIComponent(suggestion)}`}
                    className='px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const decodedTerm = decodeURIComponent(term);
  const allCourses = await searchCourses(decodedTerm);
  // Filter out courses with null slugs
  const courses = allCourses.filter(course => course.slug !== null);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 pt-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='py-8 sm:py-12'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='p-2 sm:p-3 bg-gray-100 dark:bg-gray-800 rounded-lg'>
                <Search className='h-6 sm:h-8 w-6 sm:w-8 text-gray-500 dark:text-gray-400' />
              </div>
              <div>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white'>
                  Search Results
                </h1>
                <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base'>
                  Found {courses.length} result{courses.length !== 1 ? 's' : ''}{' '}
                  for &quot;{decodedTerm}&quot;
                </p>
              </div>
            </div>

            {/* Search Stats */}
            {courses.length > 0 && (
              <div className='flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                <BookOpen className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {courses.length} courses
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {courses.length === 0 ? (
          <div className='text-center py-12 sm:py-16'>
            <div className='max-w-md mx-auto'>
              <div className='p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center'>
                <Search className='h-10 w-10 text-gray-500 dark:text-gray-400' />
              </div>
              <h2 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
                No courses found
              </h2>
              <p className='text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base'>
                We couldn&apos;t find any courses matching &quot;{decodedTerm}
                &quot;. Try searching with different keywords.
              </p>

              {/* Search Tips */}
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left'>
                <h3 className='font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2'>
                  <Sparkles className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                  Search Tips
                </h3>
                <ul className='text-sm text-gray-700 dark:text-gray-300 space-y-1'>
                  <li>
                    • Use specific terms like &quot;Machine Learning&quot;
                    instead of &quot;AI&quot;
                  </li>
                  <li>
                    • Try programming languages: &quot;Python&quot;,
                    &quot;JavaScript&quot;
                  </li>
                  <li>
                    • Search for technologies: &quot;React&quot;,
                    &quot;TensorFlow&quot;
                  </li>
                </ul>
              </div>

              {/* Popular Searches */}
              <div className='text-left'>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-3'>
                  Popular searches:
                </p>
                <div className='flex flex-wrap gap-2'>
                  {[
                    'Machine Learning',
                    'Python',
                    'Quantum Computing',
                    'GPU Programming',
                    'Data Science',
                  ].map(suggestion => (
                    <Link
                      key={suggestion}
                      href={`/search?term=${encodeURIComponent(suggestion)}`}
                      className='px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-700 dark:text-gray-300'
                    >
                      {suggestion}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='pb-8 sm:pb-12'>
            {/* Results Header */}
            <div className='mb-6 sm:mb-8'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                  <h2 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white'>
                    Search Results for &quot;{decodedTerm}&quot;
                  </h2>
                  <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base'>
                    {courses.length} course{courses.length !== 1 ? 's' : ''}{' '}
                    found
                  </p>
                </div>

                {/* Sort Options (Mobile) */}
                <div className='sm:hidden'>
                  <select className='px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm'>
                    <option>Most Relevant</option>
                    <option>Newest</option>
                    <option>Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <SearchGrid>
              {courses.map(course => (
                <MobileResponsiveCourseCard
                  key={course._id}
                  course={course as unknown as EnhancedCourse}
                  href={`/courses/${course.slug}`}
                  variant='default'
                />
              ))}
            </SearchGrid>

            {/* Search Again Section */}
            <div className='mt-12 sm:mt-16 text-center'>
              <div className='bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3'>
                  Didn&apos;t find what you&apos;re looking for?
                </h3>
                <p className='text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base'>
                  Try searching with different keywords or browse our complete
                  course catalog
                </p>
                <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                  <Link
                    href='/'
                    prefetch={false}
                    className='inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium'
                  >
                    <BookOpen className='h-4 w-4' />
                    Browse All Courses
                  </Link>
                  <Link
                    href='/search'
                    prefetch={false}
                    className='inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium'
                  >
                    <Search className='h-4 w-4' />
                    New Search
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
