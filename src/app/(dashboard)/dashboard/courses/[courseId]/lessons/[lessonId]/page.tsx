import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getLessonById } from "@/sanity/lib/lessons/getLessonById";
import { PortableText } from "@portabletext/react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LoomEmbed } from "@/components/LoomEmbed";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";
import { LessonFiles } from "@/components/LessonFiles";
import lessonPortableTextComponents from "@/components/lessonPortableTextComponents";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await currentUser();
  if (!user) {
    return redirect("/"); // or your login page
  }

  const { courseId, lessonId } = await params;

  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    return redirect(`/dashboard/courses/${courseId}`);
  }

  const hasFiles = lesson.files && lesson.files.length > 0;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background font-sans antialiased text-[17px] text-primary/96">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-14 pb-24 px-4">
          <h1 className="text-4xl md:text-5xl font-light mb-5 text-primary/96 tracking-tight leading-tight">
            {lesson.title}
          </h1>
          {lesson.description && (
            <div className="prose prose-blue dark:prose-invert max-w-none text-muted-foreground prose-headings:font-normal prose-headings:text-primary/96 prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-inherit prose-li:marker:text-primary/60 prose-a:text-blue-600 dark:prose-a:text-blue-400 mb-10">
              <p>{lesson.description}</p>
            </div>
          )}

          <div className="space-y-10">
            {/* Video Section */}
            {lesson.videoUrl && <VideoPlayer url={lesson.videoUrl} />}

            {/* Loom Embed Video if loomUrl is provided */}
            {lesson.loomUrl && <LoomEmbed shareUrl={lesson.loomUrl} />}

            {/* Files Section - Only show if files exist */}
            {hasFiles && (
              <div>
                <LessonFiles
                  files={
                    lesson.files
                      ?.filter((file) => file && file.asset && file.title)
                      .map((file) => ({
                        _key: file._key,
                        asset: file.asset!,
                        title: file.title!,
                        description: file.description,
                      })) || []
                  }
                />
              </div>
            )}

            {/* Lesson Content */}
            {lesson.content && (
              <div>
                <h2 className="text-2xl font-normal mb-5 text-primary/96 tracking-tight">
                  Lesson Notes
                </h2>
                <div className="prose prose-blue dark:prose-invert max-w-none prose-headings:font-normal prose-headings:text-primary/96 prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-primary/96 prose-li:marker:text-primary/60 prose-a:text-blue-600 dark:prose-a:text-blue-400">
                  <PortableText
                    value={lesson.content}
                    components={lessonPortableTextComponents}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <LessonCompleteButton lessonId={lesson._id} clerkId={user!.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
