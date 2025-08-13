import { CourseCardBase } from './CourseCardBase';
import { GetCoursesQueryResult } from '../../../sanity.types';

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
  return (
    <CourseCardBase
      course={course}
      href={href}
      variant="dashboard"
      showProgress={true}
      className={className}
    />
  );
}
