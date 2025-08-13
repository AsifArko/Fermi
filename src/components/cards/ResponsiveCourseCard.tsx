'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MobileCourseCard } from '../mobile/MobileCourseCard';
import { DesktopCourseCard } from '../desktop/DesktopCourseCard';
import { GetCoursesQueryResult } from '../../../sanity.types';

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
