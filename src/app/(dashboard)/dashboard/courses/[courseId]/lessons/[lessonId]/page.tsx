import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getLessonById } from "@/sanity/lib/lessons/getLessonById";
import { PortableText } from "@portabletext/react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LoomEmbed } from "@/components/LoomEmbed";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";
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

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary tracking-tight">
            {lesson.title}
          </h1>
          {lesson.description && (
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {lesson.description}
            </p>
          )}

          <div className="space-y-8">
            {/* Video Section */}
            {lesson.videoUrl && <VideoPlayer url={lesson.videoUrl} />}

            {/* Loom Embed Video if loomUrl is provided */}
            {lesson.loomUrl && <LoomEmbed shareUrl={lesson.loomUrl} />}

            {/* Lesson Content */}
            {lesson.content && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-primary/90">
                  Lesson Notes
                </h2>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <PortableText
                    value={lesson.content}
                    components={lessonPortableTextComponents}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <LessonCompleteButton lessonId={lesson._id} clerkId={user!.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
