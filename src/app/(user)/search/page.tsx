import { Search } from 'lucide-react';

import { Container } from '@/components/layout';
import { SearchGrid } from '@/components/layout/MobileResponsiveGrid';
import { MobileResponsiveCourseCard } from '@/components/shared/MobileResponsiveCourseCard';
import { EnhancedCourse } from '@/sanity/lib/courses/getCourses';
import { searchCourses } from '@/sanity/lib/courses/searchCourses';

interface SearchPageProps {
  searchParams: Promise<{
    term?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { term } = await searchParams;

  if (!term) {
    return (
      <div className='h-full pt-16 relative z-10'>
        <Container maxWidth='7xl' padding='lg'>
          <div className='text-center py-12'>
            <Search className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
            <h1 className='text-3xl font-bold mb-4'>Search Courses</h1>
            <p className='text-muted-foreground'>
              Enter a search term to find courses
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const decodedTerm = decodeURIComponent(term);
  const allCourses = await searchCourses(decodedTerm);
  // Filter out courses with null slugs
  const courses = allCourses.filter(course => course.slug !== null);

  return (
    <div className='h-full pt-16 relative z-10'>
      <Container maxWidth='7xl' padding='lg'>
        <div className='flex items-center gap-4 mb-8'>
          <Search className='h-8 w-8 text-primary' />
          <div>
            <h1 className='text-3xl font-bold'>Search Results</h1>
            <p className='text-muted-foreground'>
              Found {courses.length} result{courses.length === 1 ? '' : 's'} for
              &quot;{decodedTerm}&quot;
            </p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className='text-center py-12'>
            <Search className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
            <h2 className='text-2xl font-semibold mb-4'>No courses found</h2>
            <p className='text-muted-foreground mb-8'>
              Try searching with different keywords like &quot;Machine
              Learning&quot;, &quot;Python&quot;, or &quot;Quantum&quot;
            </p>
            <div className='text-sm text-muted-foreground'>
              <p>Popular searches:</p>
              <div className='flex flex-wrap justify-center gap-2 mt-2'>
                {[
                  'Machine Learning',
                  'Python',
                  'Quantum Computing',
                  'GPU Programming',
                  'Data Science',
                ].map(suggestion => (
                  <span
                    key={suggestion}
                    className='px-3 py-1 bg-muted/50 rounded-full border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer'
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <SearchGrid className='pb-8 sm:pb-12'>
            {courses.map(course => (
              <MobileResponsiveCourseCard
                key={course._id}
                course={course as unknown as EnhancedCourse}
                href={`/courses/${course.slug}`}
                variant='featured'
              />
            ))}
          </SearchGrid>
        )}
      </Container>
    </div>
  );
}
