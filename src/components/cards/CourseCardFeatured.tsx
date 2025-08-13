import { CourseCardBase } from '../shared/CourseCardBase';
import { GetCoursesQueryResult } from '../../../sanity.types';

interface CourseCardFeaturedProps {
  course: GetCoursesQueryResult[number];
  href: string;
  className?: string;
}

export function CourseCardFeatured({
  course,
  href,
  className,
}: CourseCardFeaturedProps) {
  return (
    <CourseCardBase
      course={course}
      href={href}
      variant="featured"
      showProgress={false}
      className={className}
    />
  );
}
