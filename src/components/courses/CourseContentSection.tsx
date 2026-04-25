'use client';

import { ChevronDown, ChevronRight, Play } from 'lucide-react';
import { useState } from 'react';
interface CourseContentSectionProps {
  modules?: Array<{
    _id?: string;
    title?: string;
    lessons?: Array<{
      _id?: string;
      title?: string;
    }> | null;
  }> | null;
}

export function CourseContentSection({ modules }: CourseContentSectionProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  if (!modules || modules.length === 0) {
    return (
      <div className='bg-card rounded-2xl p-8 border border-border shadow-xl'>
        <h2 className='text-2xl font-semibold mb-4 text-foreground'>
          Course Content
        </h2>
        <p className='text-muted-foreground'>
          No course content available yet.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-xl'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
          <Play className='w-5 h-5 text-primary' />
        </div>
        <div>
          <h2 className='text-2xl sm:text-3xl font-semibold text-foreground'>
            Course Content
          </h2>
          <p className='text-muted-foreground text-sm sm:text-base'>
            {modules.length} modules •{' '}
            {modules.reduce(
              (acc, module) => acc + (module.lessons?.length || 0),
              0
            )}{' '}
            lessons
          </p>
        </div>
      </div>

      {/* Modules List */}
      <div className='space-y-4'>
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module._id || '');
          const lessonCount = module.lessons?.length || 0;

          return (
            <div
              key={module._id}
              className='border border-border/50 rounded-xl overflow-hidden bg-muted/20 hover:bg-muted/30 transition-colors'
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module._id || '')}
                className='w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-muted/40 transition-colors'
              >
                <div className='flex items-center gap-4'>
                  {/* Module Number */}
                  <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-semibold text-sm sm:text-base'>
                    {moduleIndex + 1}
                  </div>

                  {/* Module Info */}
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-foreground text-base sm:text-lg mb-1'>
                      {module.title}
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Expand/Collapse Icon */}
                <div className='flex-shrink-0 ml-4'>
                  {isExpanded ? (
                    <ChevronDown className='w-5 h-5 text-muted-foreground' />
                  ) : (
                    <ChevronRight className='w-5 h-5 text-muted-foreground' />
                  )}
                </div>
              </button>

              {/* Module Content */}
              {isExpanded && module.lessons && (
                <div className='border-t border-border/50 bg-background/50'>
                  <div className='p-4 sm:p-6'>
                    <div className='space-y-3'>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson._id}
                          className='flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group'
                        >
                          {/* Lesson Number */}
                          <div className='w-6 h-6 sm:w-7 sm:h-7 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-medium text-xs sm:text-sm group-hover:bg-secondary/30 transition-colors'>
                            {lessonIndex + 1}
                          </div>

                          {/* Lesson Title */}
                          <span className='flex-1 text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors'>
                            {lesson.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
