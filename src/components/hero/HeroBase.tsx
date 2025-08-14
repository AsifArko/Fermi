import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

interface HeroAction {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

interface HeroBaseProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: HeroAction[];
  variant?: 'default' | 'compact' | 'minimal';
  background?: 'none' | 'subtle' | 'animated';
  className?: string;
}

const variantStyles = {
  default: 'py-16 sm:py-20 lg:py-24',
  compact: 'py-12 sm:py-16',
  minimal: 'py-8 sm:py-10 lg:py-12',
} as const;

const backgroundStyles = {
  none: '',
  subtle: 'bg-gradient-to-br from-background via-background to-primary/5',
  animated:
    'bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden',
} as const;

const titleVariants = {
  default: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
  compact: 'text-3xl sm:text-4xl md:text-5xl',
  minimal: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
} as const;

const descriptionVariants = {
  default: 'text-lg sm:text-xl',
  compact: 'text-base sm:text-lg',
  minimal: 'text-sm sm:text-base lg:text-lg',
} as const;

export function HeroBase({
  title,
  subtitle,
  description,
  actions = [],
  variant = 'default',
  background = 'subtle',
  className,
}: HeroBaseProps) {
  const ButtonComponent = ({ action }: { action: HeroAction }) => {
    const baseClasses =
      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    let buttonClasses = '';
    const buttonContent = action.text;

    switch (action.variant) {
      case 'primary':
        buttonClasses = `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`;
        break;
      case 'outline':
        buttonClasses = `${baseClasses} border border-primary/30 text-primary hover:bg-primary/10 focus:ring-primary/30`;
        break;
      default: // secondary
        buttonClasses = `${baseClasses} border border-primary/30 text-primary hover:bg-primary/10 focus:ring-primary/30`;
        break;
    }

    if (action.href) {
      return (
        <Link href={action.href} className={buttonClasses}>
          {buttonContent}
        </Link>
      );
    }

    return (
      <button onClick={action.onClick} className={buttonClasses}>
        {buttonContent}
      </button>
    );
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        variantStyles[variant],
        backgroundStyles[background],
        className
      )}
    >
      {/* Animated background elements - only for animated background */}
      {background === 'animated' && (
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div
            className='absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full animate-pulse'
            style={{ animationDuration: '8s' }}
          />
          <div
            className='absolute bottom-1/3 right-1/4 w-24 h-24 bg-secondary/5 rounded-full animate-pulse'
            style={{ animationDuration: '6s', animationDelay: '1s' }}
          />
          <div
            className='absolute top-1/2 right-1/3 w-16 h-16 bg-primary/3 rounded-full animate-pulse'
            style={{ animationDuration: '4s' }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className='max-w-4xl mx-auto text-center px-4'>
        {/* Title */}
        <h1
          className={cn(
            'font-bold text-foreground leading-tight mb-4 sm:mb-6',
            titleVariants[variant]
          )}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <h2
            className={cn(
              'font-semibold text-primary mb-4',
              variant === 'minimal'
                ? 'text-base sm:text-lg'
                : 'text-lg sm:text-xl'
            )}
          >
            {subtitle}
          </h2>
        )}

        {/* Description */}
        {description && (
          <p
            className={cn(
              'text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto',
              descriptionVariants[variant]
            )}
          >
            {description}
          </p>
        )}

        {/* Action Buttons */}
        {actions.length > 0 && (
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            {actions.map((action, index) => (
              <ButtonComponent
                key={`action-${action.href || action.onClick?.toString() || index}`}
                action={action}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
