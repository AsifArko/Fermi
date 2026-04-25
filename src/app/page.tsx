import { MobileResponsiveHomepageContent } from '@/components/homepage/MobileResponsiveHomepageContent';
import { getCourses } from '@/sanity/lib/courses/getCourses';

export default async function Home() {
  const courses = await getCourses();

  return <MobileResponsiveHomepageContent courses={courses} />;
}
