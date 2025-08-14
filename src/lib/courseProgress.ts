import { Module } from '@/sanity.types';

import { GetCompletionsQueryResult } from '../../sanity.types';

export function calculateTotalLessons(modules: Module[] | null): number {
  if (!modules) return 0;
  return modules.reduce(
    (acc, module) => acc + (module.lessons?.length || 0),
    0
  );
}

export function calculateCourseProgress(
  modules: Module[] | null,
  completedLessons: GetCompletionsQueryResult['completedLessons']
): number {
  const totalLessons = calculateTotalLessons(modules);
  // Deduplicate completed lessons by lesson._id
  const uniqueCompleted = new Set(completedLessons.map(c => c.lesson?._id));
  const totalCompleted = uniqueCompleted.size;

  return Math.round(
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0
  );
}
