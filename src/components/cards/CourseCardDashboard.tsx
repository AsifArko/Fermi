import { GetCoursesQueryResult } from '../../../sanity.types';

import { CourseCardBase } from './CourseCardBase';

interface CourseCardDashboardProps {
  course: GetCoursesQueryResult[number];
  href: string;
  className?: string;
}

export function CourseCardDashboard({
  course,
  href,
  className,
}: CourseCardDashboardProps) {
  const props: {
    course: GetCoursesQueryResult[number];
    href: string;
    variant: 'dashboard';
    showProgress: boolean;
    className?: string;
  } = {
    course,
    href,
    variant: 'dashboard',
    showProgress: true,
  };

  if (className) props.className = className;

  return <CourseCardBase {...props} />;
}
