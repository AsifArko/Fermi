import { defineQuery } from 'groq';
import { sanityFetch } from '../live';

export async function searchCourses(term: string) {
  const searchQuery = defineQuery(`*[_type == "course" && (
    title match $term + "*" ||
    description match $term + "*" ||
    category->name match $term + "*"
  )] {
    ...,
    "slug": slug.current,
    "category": category->{...},
    "instructor": instructor->{...},
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
  }`);

  const result = await sanityFetch({
    query: searchQuery,
    params: { term },
  });

  return result.data || [];
}
