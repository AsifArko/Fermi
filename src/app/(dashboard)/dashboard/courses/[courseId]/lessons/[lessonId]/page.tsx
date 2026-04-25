import { currentUser } from '@clerk/nextjs/server';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ColabIcon } from '@/components/ColabIcon';
import { LessonCompleteButton } from '@/components/LessonCompleteButton';
import { LessonFiles } from '@/components/LessonFiles';
import { LoomEmbed } from '@/components/LoomEmbed';
import NotebookPreview from '@/components/NotebookPreview';
import { VideoPlayer } from '@/components/VideoPlayer';
import lessonPortableTextComponents from '@/components/lessonPortableTextComponents';
import { getLessonById } from '@/sanity/lib/lessons/getLessonById';

type LessonFile = {
  _key: string;
  asset: {
    _id: string;
    _type: string;
    originalFilename: string | null;
    url: string | null;
    mimeType: string | null;
    size: number | null;
  } | null;
  title: string | null;
  description: string | null;
};

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await currentUser();
  if (!user) {
    return redirect('/'); // or your login page
  }

  const { courseId, lessonId } = await params;

  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    return redirect(`/dashboard/courses/${courseId}`);
  }

  const hasFiles = lesson.files && lesson.files.length > 0;

  // Find the Jupyter notebook file URL if present
  const notebookFile = lesson.notebookFile;
  const notebookUrl = lesson.notebookUrl || notebookFile?.asset?.url;

  return (
    <div className='h-full flex flex-col overflow-hidden font-sans antialiased text-[17px] text-primary/96 relative z-10'>
      <div className='flex-1 overflow-y-auto'>
        <div className='max-w-4xl mx-auto pt-14 pb-24 px-4 sm:px-6'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-light mb-5 text-primary/96 tracking-tight leading-tight'>
            {lesson.title}
          </h1>
          {lesson.description && (
            <div className='prose prose-blue dark:prose-invert max-w-none text-muted-foreground prose-headings:font-normal prose-headings:text-primary/96 prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-inherit prose-li:marker:text-primary/60 prose-a:text-blue-600 dark:prose-a:text-blue-400 mb-10'>
              <p>{lesson.description}</p>
            </div>
          )}

          <div className='space-y-8 sm:space-y-10'>
            {/* Video Section */}
            {lesson.videoUrl && <VideoPlayer url={lesson.videoUrl} />}

            {/* Loom Embed Video if loomUrl is provided */}
            {lesson.loomUrl && <LoomEmbed shareUrl={lesson.loomUrl} />}

            {/* Jupyter Notebook Section */}
            {(notebookUrl || lesson.colabUrl) && (
              <div className='my-6 sm:my-8'>
                <div className='flex items-center justify-between gap-4 mb-4 sm:mb-5'>
                  <h2 className='text-xl sm:text-2xl font-normal text-primary/96 tracking-tight'>
                    Jupyter Notebook
                  </h2>
                  {lesson.colabUrl && (
                    <Link
                      href={lesson.colabUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary/96 border border-border hover:border-primary/20 rounded-lg transition-all duration-200 w-fit shrink-0'
                    >
                      <ColabIcon className='w-4 h-4' />
                      <span className='hidden sm:inline'>Google Colab</span>
                    </Link>
                  )}
                </div>
                {notebookUrl ? (
                  <NotebookPreview url={notebookUrl} />
                ) : (
                  <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      No notebook file available for this lesson.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Files Section - Only show if files exist */}
            {hasFiles && (
              <div>
                <LessonFiles
                  files={
                    lesson.files?.filter(
                      (file: LessonFile) => file && file.asset && file.title
                    ) || []
                  }
                />
              </div>
            )}

            {/* Lesson Content */}
            {lesson.content && (
              <div>
                <h2 className='text-xl sm:text-2xl font-normal mb-4 sm:mb-5 text-primary/96 tracking-tight'>
                  Lesson Notes
                </h2>
                <div className='prose prose-blue dark:prose-invert max-w-none prose-headings:font-normal prose-headings:text-primary/96 prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-primary/96 prose-li:marker:text-primary/60 prose-a:text-blue-600 dark:prose-a:text-blue-400'>
                  <PortableText
                    value={lesson.content}
                    components={lessonPortableTextComponents}
                  />
                </div>
              </div>
            )}

            <div className='flex justify-end pt-4'>
              <LessonCompleteButton lessonId={lesson._id} clerkId={user!.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
