import { defineQuery } from 'groq';

import type {
  SanityImageHotspot,
  SanityImageCrop,
  Slug,
  internalGroqTypeReferenceTo,
} from '../../../sanity.types';
import { sanityFetch } from '../live';

// Custom type for enhanced course data with expanded modules and lessons
export type EnhancedCourse = {
  _id: string;
  _type: 'course';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  price?: number;
  slug: string;
  description?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: 'reference';
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: 'sanity.imageAsset';
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: 'image';
  };
  category: {
    _id: string;
    _type: 'category';
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    name?: string;
    slug?: Slug;
    description?: string;
    icon?: string;
    color?: string;
  } | null;
  modules?: Array<{
    _id: string;
    _type: 'module';
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    title?: string;
    lessons?: Array<{
      _id: string;
      _type: 'lesson';
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      title?: string;
      slug?: Slug;
      description?: string;
      videoUrl?: string;
      loomUrl?: string;
      notebookUrl?: string;
      notebookFile?: {
        asset?: {
          _ref: string;
          _type: 'reference';
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: 'sanity.fileAsset';
        };
        media?: unknown;
        _type: 'file';
      };
      colabUrl?: string;
      files?: Array<{
        asset?: {
          _ref: string;
          _type: 'reference';
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: 'sanity.fileAsset';
        };
        media?: unknown;
        title?: string;
        description?: string;
        _type: 'file';
        _key: string;
      }>;
      hasVideo: boolean;
      hasNotebook: boolean;
      hasColab: boolean;
      fileCount: number;
    }>;
  }>;
  instructor: {
    _id: string;
    _type: 'instructor';
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    name?: string;
    bio?: string;
    photo?: {
      asset?: {
        _ref: string;
        _type: 'reference';
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: 'sanity.imageAsset';
      };
      media?: unknown;
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: 'image';
    };
  } | null;
};

export async function getCourses(): Promise<EnhancedCourse[]> {
  const getCoursesQuery = defineQuery(`*[_type == "course"] {
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

  const courses = await sanityFetch({ query: getCoursesQuery });
  // Filter out courses with null slugs to match EnhancedCourse type
  const filteredCourses =
    courses.data?.filter(course => course.slug !== null) || [];
  return filteredCourses as EnhancedCourse[];
}
