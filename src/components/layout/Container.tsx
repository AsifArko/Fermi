import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const containerWidths = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '7xl': 'max-w-7xl',
} as const;

const paddingVariants = {
  none: '',
  sm: 'px-4',
  md: 'px-4 sm:px-6',
  lg: 'px-4 sm:px-6 lg:px-8',
} as const;

export function Container({
  children,
  maxWidth = '7xl',
  padding = 'md',
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto',
        containerWidths[maxWidth],
        paddingVariants[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
