'use server';

import { getLessonCompletionStatus } from '@/sanity/lib/lessons/getLessonCompletionStatus';

export async function getLessonCompletionStatusAction(
  lessonId: string,
  clerkId: string
): Promise<boolean> {
  try {
    const status = await getLessonCompletionStatus(lessonId, clerkId);
    return status;
  } catch {
    return false;
  }
}
