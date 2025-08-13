import { CourseCardBase } from './CourseCardBase';
import { GetCoursesQueryResult } from '../../../sanity.types';

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
  return (
    <CourseCardBase
      course={course}
      href={href}
      variant="home"
      showProgress={false}
      className={className}
    />
  );
}
