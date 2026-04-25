import { defineQuery } from 'groq';

import { sanityFetch } from '../live';

export async function getEnrolledCourses(clerkId: string) {
  const getEnrolledCoursesQuery =
    defineQuery(`*[_type == "student" && clerkId == $clerkId][0] {
    "enrolledCourses": *[_type == "enrollment" && student._ref == ^._id] {
      ...,
      "course": course-> {
        ...,
        "slug": slug.current,
        "category": category->{...},
        "instructor": instructor->{
          ...,
          "photo": photo.asset->url
        },
        "modules": modules[]->{
          ...,
          "lessons": lessons[]->{
            ...,
            "hasVideo": defined(videoUrl) || defined(loomUrl),
            "hasNotebook": defined(notebookUrl) || defined(notebookFile),
            "hasColab": defined(colabUrl),
            "fileCount": count(files)
          }
        }
      }
    }
  }`);

  const result = await sanityFetch({
    query: getEnrolledCoursesQuery,
    params: { clerkId },
  });

  return (
    result?.data?.enrolledCourses?.filter(
      (e: any, i: number, arr: any[]) =>
        e?.course?._id &&
        arr.findIndex((x: any) => x?.course?._id === e?.course?._id) === i
    ) || []
  );
}
