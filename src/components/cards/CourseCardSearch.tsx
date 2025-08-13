import { CourseCardBase } from '../shared/CourseCardBase';
import { GetCoursesQueryResult } from '../../../sanity.types';

interface CourseCardSearchProps {
  course: GetCoursesQueryResult[number];
  href: string;
  className?: string;
}

export function CourseCardSearch({
  course,
  href,
  className,
}: CourseCardSearchProps) {
  return (
    <CourseCardBase
      course={course}
      href={href}
      variant="search"
      showProgress={false}
      className={className}
    />
  );
}
