import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import { auth } from "@clerk/nextjs/server";

// --- Animated scientific background shapes (copied from Hero) ---
function AnimatedBackground() {
  return (
    <>
      {/* Large floating circles */}
      <div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full animate-pulse"
        style={{ animationDuration: "12s" }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-secondary/5 rounded-full animate-pulse"
        style={{ animationDuration: "6s", animationDelay: "1s" }}
      />
      {/* Small floating dots */}
      <div
        className="absolute top-1/3 left-1/3 w-2 h-2 bg-primary/20 rounded-full animate-bounce"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-secondary/30 rounded-full animate-bounce"
        style={{ animationDuration: "3s", animationDelay: "0.5s" }}
      />
      {/* Geometric shapes */}
      <div
        className="absolute top-1/4 right-1/4 w-8 h-8 border border-primary/10 rotate-45 animate-spin"
        style={{ animationDuration: "20s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-6 h-6 border border-secondary/15 rotate-45 animate-spin"
        style={{ animationDuration: "15s", animationDirection: "reverse" }}
      />
      {/* Tech icon example (Qubit) */}
      <div
        className="absolute opacity-15 animate-float"
        style={{
          top: "35%",
          right: "25%",
          animationDuration: "7s",
          animationDelay: "0.5s",
          filter: "blur(0.5px)",
        }}
      >
        <svg
          className="w-9 h-9 text-primary/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="7" strokeWidth="1.5" />
          <path d="M12 5v14M5 12h14" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </div>
    </>
  );
}

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  const { userId } = await auth();

  const isEnrolled =
    userId && course?._id
      ? await isEnrolledInCourse(userId, course._id)
      : false;

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold">Course not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back to Courses Button - always visible below header */}
      <div className="pt-20 px-4 md:px-0">
        <Link
          href="/"
          prefetch={false}
          className="rounded-full bg-neutral-200/70 dark:bg-neutral-800/70 shadow-lg w-11 h-11 flex items-center justify-center text-foreground hover:bg-neutral-300/80 dark:hover:bg-neutral-700/80 border border-border transition-colors"
          aria-label="Back to Courses"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>
      {/* Hero Section */}
      <div className="relative h-[56vh] w-full overflow-hidden shadow-lg mt-4 pt-20 md:pt-0">
        {course.image && (
          <Image
            src={urlFor(course.image).url() || ""}
            alt={course.title || "Course Title"}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* --- DO NOT REMOVE: Transparent overlay for contrast --- */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 backdrop-blur-sm" />
        {/* --- Animated scientific background shapes --- */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <AnimatedBackground />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end items-center pb-12 z-20">
          <div className="w-full px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 bg-white/10 rounded-lg p-8 shadow-xl border border-white/10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/20 text-white rounded text-sm font-medium backdrop-blur-sm">
                    {course.category?.name || "Uncategorized"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg truncate">
                  {course.title}
                </h1>
                <p className="text-lg text-white/90 max-w-2xl drop-shadow">
                  {course.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 min-w-[180px] border border-white/20 bg-white/10 rounded px-6 py-4 shadow-md">
                <div className="text-2xl font-bold text-white mb-1">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </div>
                <EnrollButton courseId={course._id} isEnrolled={isEnrolled} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative py-16 px-4 md:px-8">
        {/* Subtle animated background shapes in content area */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <AnimatedBackground />
        </div>
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 z-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-8 mb-8 border border-border shadow-2xl">
              <h2 className="text-2xl font-semibold mb-8 tracking-tight text-foreground">
                Course Content
              </h2>
              <div className="space-y-8">
                {course.modules?.map((module, index) => (
                  <div key={module._id} className="mb-6">
                    <h3 className="font-semibold text-lg text-foreground mb-4 tracking-wide leading-tight">
                      Module {index + 1}: {module.title}
                    </h3>
                    <div className="relative pl-7">
                      {/* Lighter vertical line for stepper */}
                      <div
                        className="absolute left-2.5 top-0 bottom-0 w-px bg-border"
                        style={{ zIndex: 0 }}
                      />
                      <div className="flex flex-col gap-0">
                        {module.lessons?.map((lesson, lessonIndex) => (
                          <div
                            key={lesson._id}
                            className="relative flex items-center gap-3 py-2 group transition-colors hover:bg-muted/30 rounded-md"
                          >
                            {/* Stepper dot - smaller, lighter */}
                            <div className="z-10 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs border-2 border-primary/30 group-hover:bg-primary/20 transition-colors">
                              {lessonIndex + 1}
                            </div>
                            <span className="font-normal text-base text-muted-foreground group-hover:text-foreground transition-colors tracking-normal leading-snug">
                              {lesson.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-gradient-to-br from-card/80 via-background/70 to-card/90 rounded-xl p-8 sticky top-4 border border-primary/10 shadow-2xl backdrop-blur-md">
              <h2 className="text-lg font-semibold mb-5 tracking-wide text-primary">
                Instructor
              </h2>
              {course.instructor && (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {course.instructor.photo && (
                      <div className="relative h-14 w-14 shadow-md border-2 border-primary/20 rounded-full overflow-hidden">
                        <Image
                          src={urlFor(course.instructor.photo).url() || ""}
                          alt={course.instructor.name || "Course Instructor"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-lg text-foreground leading-tight">
                        {course.instructor.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">
                        Instructor
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="my-3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  {course.instructor.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {course.instructor.bio}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
