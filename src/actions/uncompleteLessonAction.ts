'use server';

import { uncompleteLessonById } from '@/sanity/lib/lessons/uncompleteLessonById';

export async function uncompleteLessonAction(
  lessonId: string,
  clerkId: string
) {
  try {
    await uncompleteLessonById({ lessonId, clerkId });
    return { success: true };
  } catch {
    throw new Error('Failed to uncomplete lesson');
  }
}
