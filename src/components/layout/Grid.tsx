import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  variant?: 'courses' | 'search' | 'dashboard';
  className?: string;
}

const gridVariants = {
  courses:
    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8',
  search: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8',
  dashboard: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8',
} as const;

export function Grid({ children, variant = 'courses', className }: GridProps) {
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
  const props: {
    children: React.ReactNode;
    variant: 'courses';
    className?: string;
  } = { children, variant: 'courses' };
  if (className) props.className = className;

  return <Grid {...props} />;
}
