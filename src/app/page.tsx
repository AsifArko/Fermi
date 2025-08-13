import { getCourses } from '@/sanity/lib/courses/getCourses';
import { MobileResponsiveHomepageContent } from '@/components/homepage/MobileResponsiveHomepageContent';

export default async function Home() {
  const courses = await getCourses();

  return <MobileResponsiveHomepageContent courses={courses} />;
}
