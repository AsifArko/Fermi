import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  containerProps?: {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl';
    padding?: 'none' | 'sm' | 'md' | 'lg';
  };
}

export function PageLayout({
  children,
  header,
  footer,
  className,
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {header}
      <main className='pt-16 sm:pt-20'>{children}</main>
      {footer}
    </div>
  );
}

// Convenience component for pages that need the container
export function PageLayoutWithContainer({
  children,
  header,
  footer,
  className,
  containerProps = { maxWidth: '7xl', padding: 'lg' },
}: PageLayoutProps) {
  const props: {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
  } = { header, footer };
  if (className) props.className = className;

  return (
    <PageLayout {...props}>
      <Container {...containerProps}>{children}</Container>
    </PageLayout>
  );
}

// Import Container here to avoid circular dependencies
import { Container } from './Container';
