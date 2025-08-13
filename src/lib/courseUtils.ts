// Helper functions to calculate course content counts
export function getCourseStats(course: {
  modules?: Array<{
    lessons?: Array<{
      hasVideo: boolean;
      hasNotebook: boolean;
      hasColab: boolean;
      fileCount: number;
    }>;
  }>;
}) {
  const modules = course.modules || [];
  const lessons = modules.reduce(
    (
      total: number,
      module: {
        lessons?: Array<{
          hasVideo: boolean;
          hasNotebook: boolean;
          hasColab: boolean;
          fileCount: number;
        }>;
      }
    ) => total + (module.lessons?.length || 0),
    0
  );
  const videos = modules.reduce(
    (
      total: number,
      module: {
        lessons?: Array<{
          hasVideo: boolean;
          hasNotebook: boolean;
          hasColab: boolean;
          fileCount: number;
        }>;
      }
    ) =>
      total +
      (module.lessons?.reduce(
        (
          lessonTotal: number,
          lesson: {
            hasVideo: boolean;
            hasNotebook: boolean;
            hasColab: boolean;
            fileCount: number;
          }
        ) => lessonTotal + (lesson.hasVideo ? 1 : 0),
        0
      ) || 0),
    0
  );
  const notebooks = modules.reduce(
    (
      total: number,
      module: {
        lessons?: Array<{
          hasVideo: boolean;
          hasNotebook: boolean;
          hasColab: boolean;
          fileCount: number;
        }>;
      }
    ) =>
      total +
      (module.lessons?.reduce(
        (
          lessonTotal: number,
          lesson: {
            hasVideo: boolean;
            hasNotebook: boolean;
            hasColab: boolean;
            fileCount: number;
          }
        ) => lessonTotal + (lesson.hasNotebook ? 1 : 0),
        0
      ) || 0),
    0
  );
  const colabLinks = modules.reduce(
    (
      total: number,
      module: {
        lessons?: Array<{
          hasVideo: boolean;
          hasNotebook: boolean;
          hasColab: boolean;
          fileCount: number;
        }>;
      }
    ) =>
      total +
      (module.lessons?.reduce(
        (
          lessonTotal: number,
          lesson: {
            hasVideo: boolean;
            hasNotebook: boolean;
            hasColab: boolean;
            fileCount: number;
          }
        ) => lessonTotal + (lesson.hasColab ? 1 : 0),
        0
      ) || 0),
    0
  );
  const files = modules.reduce(
    (
      total: number,
      module: {
        lessons?: Array<{
          hasVideo: boolean;
          hasNotebook: boolean;
          hasColab: boolean;
          fileCount: number;
        }>;
      }
    ) =>
      total +
      (module.lessons?.reduce(
        (
          lessonTotal: number,
          lesson: {
            hasVideo: boolean;
            hasNotebook: boolean;
            hasColab: boolean;
            fileCount: number;
          }
        ) => lessonTotal + (lesson.fileCount || 0),
        0
      ) || 0),
    0
  );

  return {
    modules: modules.length,
    lessons,
    videos,
    notebooks,
    colabLinks,
    files,
  };
}
