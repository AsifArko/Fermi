'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import { GetCoursesQueryResult } from '../../../sanity.types';
import { DesktopCourseCard } from '../desktop/DesktopCourseCard';
import { MobileCourseCard } from '../mobile/MobileCourseCard';

interface ResponsiveCourseCardProps {
  course: GetCoursesQueryResult[number];
  variant?: 'featured' | 'my-courses' | 'search';
  showProgress?: boolean;
  progress?: number;
  className?: string;
  href: string;
}

export function ResponsiveCourseCard(props: ResponsiveCourseCardProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileCourseCard {...props} />;
  }

  return <DesktopCourseCard {...props} />;
}
