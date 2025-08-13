import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  variant?: 'default' | 'compact' | 'spacious';
  className?: string;
  container?: boolean;
  containerProps?: {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl';
    padding?: 'none' | 'sm' | 'md' | 'lg';
  };
}

const sectionVariants = {
  default: 'py-12 sm:py-16',
  compact: 'py-8 sm:py-12',
  spacious: 'py-16 sm:py-20 lg:py-24',
} as const;

export function Section({
  children,
  variant = 'default',
  className,
  container = false,
  containerProps = { maxWidth: '7xl', padding: 'md' },
}: SectionProps) {
  const content = container ? (
    <Container {...containerProps}>{children}</Container>
  ) : (
    children
  );

  return (
    <section className={cn(sectionVariants[variant], className)}>
      {content}
    </section>
  );
}

// Import Container here to avoid circular dependencies
import { Container } from './Container';
