import { defineQuery } from 'groq';
import { sanityFetch } from '../live';

export async function getLessonById(id: string) {
  const getLessonByIdQuery =
    defineQuery(`*[_type == "lesson" && _id == $id][0] {
    ...,
    files[]{
      _key,
      asset->{
        _id,
        _type,
        originalFilename,
        url,
        mimeType,
        size
      },
      title,
      description
    },
    "module": module->{
      ...,
      "course": course->{...}
    },
    notebookUrl,
    notebookFile{
      asset->{
        url,
        originalFilename
      }
    }
  }`);

  const result = await sanityFetch({
    query: getLessonByIdQuery,
    params: { id },
  });

  return result.data;
}
