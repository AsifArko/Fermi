'use client';

import { cn } from '@/lib/utils';

interface ProgressBadgeProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning';
  showPercentage?: boolean;
  className?: string;
}

const sizeVariants = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
} as const;

const variantColors = {
  default: 'text-primary',
  success: 'text-green-600',
  warning: 'text-yellow-600',
} as const;

export function ProgressBadge({
  progress,
  size = 'md',
  variant = 'default',
  showPercentage = true,
  className,
}: ProgressBadgeProps) {
  const strokeWidth = size === 'sm' ? 2 : 3;
  const radius = size === 'sm' ? 14 : size === 'md' ? 18 : 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        sizeVariants[size],
        className
      )}
    >
      {/* SVG Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
        {/* Background circle */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={cn(
            'transition-all duration-300 ease-out',
            variantColors[variant]
          )}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Percentage text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-semibold', variantColors[variant])}>
            {progress}%
          </span>
        </div>
      )}
    </div>
  );
}
