import { GetCoursesQueryResult } from '../../../sanity.types';
import { CourseCardBase } from '../shared/CourseCardBase';

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
  const props: {
    course: GetCoursesQueryResult[number];
    href: string;
    variant: 'search';
    showProgress: boolean;
    className?: string;
  } = {
    course,
    href,
    variant: 'search',
    showProgress: false,
  };

  if (className) props.className = className;

  return <CourseCardBase {...props} />;
}
