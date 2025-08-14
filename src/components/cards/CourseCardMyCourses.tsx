import { GetCoursesQueryResult } from '../../../sanity.types';
import { CourseCardBase } from '../shared/CourseCardBase';

interface CourseCardMyCoursesProps {
  course: GetCoursesQueryResult[number];
  progress?: number;
  href: string;
  className?: string;
}

export function CourseCardMyCourses({
  course,
  href,
  className,
}: CourseCardMyCoursesProps) {
  const props: {
    course: GetCoursesQueryResult[number];
    href: string;
    variant: 'my-courses';
    showProgress: boolean;
    className?: string;
  } = {
    course,
    href,
    variant: 'my-courses',
    showProgress: true,
  };

  if (className) props.className = className;

  return <CourseCardBase {...props} />;
}
