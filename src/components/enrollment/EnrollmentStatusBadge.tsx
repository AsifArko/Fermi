'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, GraduationCap } from 'lucide-react';

interface EnrollmentStatusBadgeProps {
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  className?: string;
  variant?: 'default' | 'compact';
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className:
      'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
    iconClassName: 'text-yellow-600',
  },
  active: {
    label: 'Active',
    icon: CheckCircle,
    className:
      'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    iconClassName: 'text-green-600',
  },
  completed: {
    label: 'Completed',
    icon: GraduationCap,
    className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
    iconClassName: 'text-blue-600',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
    iconClassName: 'text-red-600',
  },
};

export function EnrollmentStatusBadge({
  status,
  className,
  variant = 'default',
}: EnrollmentStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center">
        <Icon className={cn('w-3 h-3', config.iconClassName)} />
      </div>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium border',
        config.className,
        className
      )}
    >
      <Icon className={cn('w-3 h-3', config.iconClassName)} />
      {config.label}
    </Badge>
  );
}

// Alternative badge component for different styling
export function EnrollmentStatusBadgeAlt({
  status,
  className,
}: Omit<EnrollmentStatusBadgeProps, 'variant'>) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
        'border-2 transition-all duration-200',
        config.className,
        className
      )}
    >
      <Icon className={cn('w-4 h-4', config.iconClassName)} />
      <span className="font-semibold">{config.label}</span>
    </div>
  );
}

// Pill-style badge for inline use
export function EnrollmentStatusPill({
  status,
  className,
}: Omit<EnrollmentStatusBadgeProps, 'variant'>) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        'bg-opacity-10 border border-opacity-20',
        config.className,
        className
      )}
    >
      <Icon className={cn('w-3 h-3', config.iconClassName)} />
      {config.label}
    </span>
  );
}
