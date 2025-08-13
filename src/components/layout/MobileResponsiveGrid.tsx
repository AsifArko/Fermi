import { cn } from '@/lib/utils';

interface MobileResponsiveGridProps {
  children: React.ReactNode;
  variant?: 'courses' | 'search' | 'dashboard' | 'my-courses';
  className?: string;
}

const gridVariants = {
  courses: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  search: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  dashboard: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  'my-courses': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
} as const;

export function MobileResponsiveGrid({
  children,
  variant = 'courses',
  className,
}: MobileResponsiveGridProps) {
  return <div className={cn(gridVariants[variant], className)}>{children}</div>;
}

// Specialized grid for course sections
export function CourseGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <MobileResponsiveGrid variant="courses" className={className}>
      {children}
    </MobileResponsiveGrid>
  );
}

// Grid for my-courses page
export function MyCoursesGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <MobileResponsiveGrid variant="my-courses" className={className}>
      {children}
    </MobileResponsiveGrid>
  );
}

// Grid for search results
export function SearchGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <MobileResponsiveGrid variant="search" className={className}>
      {children}
    </MobileResponsiveGrid>
  );
}
