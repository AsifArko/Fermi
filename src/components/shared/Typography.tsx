import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// Title variants with proper sizing and truncation
export function CourseTitle({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        'font-bold leading-tight text-foreground transition-all duration-300',
        'text-sm sm:text-base lg:text-lg', // Reduced sizing for 100% zoom
        'line-clamp-2 min-h-[2.5rem]', // Ensure consistent height
        'group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/80 group-hover:bg-clip-text group-hover:text-transparent',
        className
      )}
    >
      {children}
    </h3>
  );
}

// Description with line clamping and muted styling
export function CourseDescription({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        'text-muted-foreground/80 leading-relaxed transition-colors duration-300',
        'text-xs sm:text-xs', // Smaller, more proportional text
        'line-clamp-2 min-h-[2.5rem]', // Ensure consistent height
        'group-hover:text-muted-foreground/90',
        className
      )}
    >
      {children}
    </p>
  );
}

// Category badge styling
export function CategoryBadge({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        'text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1.5',
        'bg-black/60 backdrop-blur-md text-white rounded-full',
        'border border-white/20 shadow-lg',
        className
      )}
    >
      {children}
    </span>
  );
}

// Price badge styling
export function PriceBadge({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        'text-white font-bold px-2 sm:px-3 py-1.5',
        'bg-gradient-to-r from-primary/80 to-primary/60 backdrop-blur-md rounded-full',
        'border border-primary/30 shadow-lg text-xs sm:text-sm',
        className
      )}
    >
      {children}
    </span>
  );
}

// Instructor name styling
export function InstructorName({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        'text-xs sm:text-sm font-medium text-foreground',
        className
      )}
    >
      {children}
    </span>
  );
}

// Instructor role styling
export function InstructorRole({ children, className }: TypographyProps) {
  return (
    <div className={cn('text-xs text-muted-foreground/70', className)}>
      {children}
    </div>
  );
}
