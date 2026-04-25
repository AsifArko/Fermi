import { GetCoursesQueryResult } from '../../../sanity.types';
import { CourseCardBase } from '../shared/CourseCardBase';

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
  const props: {
    course: GetCoursesQueryResult[number];
    href: string;
    variant: 'featured';
    showProgress: boolean;
    className?: string;
  } = {
    course,
    href,
    variant: 'featured',
    showProgress: false,
  };

  if (className) props.className = className;

  return <CourseCardBase {...props} />;
}
