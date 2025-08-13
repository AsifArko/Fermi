import { CourseCardBase } from '../shared/CourseCardBase';
import { GetCoursesQueryResult } from '../../../sanity.types';

interface CourseCardMyCoursesProps {
  course: GetCoursesQueryResult[number];
  progress?: number;
  href: string;
  className?: string;
}

export function CourseCardMyCourses({
  course,
  progress,
  href,
  className,
}: CourseCardMyCoursesProps) {
  return (
    <CourseCardBase
      course={course}
      href={href}
      variant="my-courses"
      showProgress={true}
      progress={progress}
      className={className}
    />
  );
}
