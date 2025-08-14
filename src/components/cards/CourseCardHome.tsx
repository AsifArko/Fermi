import { GetCoursesQueryResult } from '../../../sanity.types';

import { CourseCardBase } from './CourseCardBase';

interface CourseCardHomeProps {
  course: GetCoursesQueryResult[number];
  href: string;
  className?: string;
}

export function CourseCardHome({
  course,
  href,
  className,
}: CourseCardHomeProps) {
  const props: {
    course: GetCoursesQueryResult[number];
    href: string;
    variant: 'home';
    showProgress: boolean;
    className?: string;
  } = {
    course,
    href,
    variant: 'home',
    showProgress: false,
  };

  if (className) props.className = className;

  return <CourseCardBase {...props} />;
}
