"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, GraduationCap } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Loader } from "@/components/ui/loader";
import { GetCoursesQueryResult } from "../../sanity.types";
import { CourseProgress } from "./CourseProgress";

interface CourseCardProps {
  course: GetCoursesQueryResult[number];
  progress?: number;
  href: string;
  showProgressFirst?: boolean;
  cardHeight?: string; // optional, for custom height classes
}

export function CourseCard({
  course,
  progress,
  href,
  showProgressFirst,
  cardHeight,
}: CourseCardProps) {
  const heightClass = cardHeight || "h-[500px] md:h-[540px]";
  return (
    <Link
      href={href}
      prefetch={false}
      className="group hover:no-underline block"
    >
      <div
        className={`relative ${heightClass} bg-gradient-to-br from-card via-card to-card/80 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-primary/10 hover:translate-y-[-8px] border border-border/50 hover:border-primary/20 group-hover:bg-gradient-to-br group-hover:from-card group-hover:via-card/95 group-hover:to-primary/5`}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {/* Floating particles */}
          <div
            className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full animate-pulse"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute bottom-6 left-6 w-1 h-1 bg-secondary/40 rounded-full animate-pulse"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse"
            style={{ animationDuration: "5s", animationDelay: "2s" }}
          ></div>

          {/* Geometric shapes */}
          <div
            className="absolute top-6 right-6 w-4 h-4 border border-primary/10 rotate-45 animate-spin"
            style={{ animationDuration: "20s" }}
          ></div>
          <div
            className="absolute bottom-8 left-8 w-3 h-3 border border-secondary/15 rotate-45 animate-spin"
            style={{ animationDuration: "25s", animationDirection: "reverse" }}
          ></div>
        </div>

        {/* Image section with enhanced overlay */}
        <div className="relative h-64 w-full overflow-hidden">
          {course.image ? (
            <Image
              src={urlFor(course.image).url() || ""}
              alt={course.title || "Course Image"}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Loader size="lg" />
            </div>
          )}

          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />

          {/* Floating play button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </div>
          </div>

          {/* Category and price badges with enhanced styling */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-sm font-semibold px-4 py-2 bg-black/60 backdrop-blur-md text-white rounded-full border border-white/20 shadow-lg">
              {course.category?.name || "Uncategorized"}
            </span>
            {"price" in course && typeof course.price === "number" && (
              <span className="text-white font-bold px-4 py-2 bg-gradient-to-r from-primary/80 to-primary/60 backdrop-blur-md rounded-full border border-primary/30 shadow-lg">
                {course.price === 0
                  ? "Free"
                  : `$${course.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`}
              </span>
            )}
          </div>
        </div>

        {/* Content section with enhanced styling */}
        <div className="p-6 flex flex-col flex-1 relative">
          {/* Title with gradient effect */}
          <h3 className="text-xl font-bold mb-3 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/80 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 leading-tight">
            {course.title}
          </h3>

          {/* Description with enhanced typography */}
          <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1 leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">
            {course.description}
          </p>

          {/* Conditional rendering for progress and instructor order */}
          {showProgressFirst ? (
            <>
              {typeof progress === "number" && (
                <div className="mb-4">
                  <CourseProgress
                    progress={progress}
                    variant="default"
                    size="sm"
                    label="Course Progress"
                  />
                </div>
              )}
              {course.instructor && (
                <div
                  className="relative flex items-center justify-between mb-4 p-3 rounded-xl border border-border/50 overflow-hidden group-hover:border-primary/20 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--background), var(--primary)/10 80%)",
                  }}
                >
                  {/* Softly pulsing ring SVG accent, top-left, non-overlapping */}
                  <svg
                    className="absolute top-2 left-2 w-5 h-5 opacity-10 animate-pulse-slow pointer-events-none"
                    style={{ marginTop: "2px", marginLeft: "2px" }}
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="13"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="flex items-center relative z-10">
                    {course.instructor.photo ? (
                      <div className="relative h-10 w-10 mr-3">
                        <Image
                          src={urlFor(course.instructor.photo).url() || ""}
                          alt={course.instructor.name || "Instructor"}
                          fill
                          className="rounded-full object-cover border-2 border-white/20 shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 mr-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white/20">
                        <Loader size="sm" />
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        by {course.instructor.name}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        Expert Instructor
                      </div>
                    </div>
                  </div>
                  <GraduationCap className="h-5 w-5 text-primary/80 group-hover:text-primary transition-colors duration-300 relative z-10" />
                </div>
              )}
            </>
          ) : (
            <>
              {course.instructor && (
                <div
                  className="relative flex items-center justify-between mb-4 p-3 rounded-xl border border-border/50 overflow-hidden group-hover:border-primary/20 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--background), var(--primary)/10 80%)",
                  }}
                >
                  {/* Softly pulsing ring SVG accent, top-left, non-overlapping */}
                  <svg
                    className="absolute top-2 left-2 w-5 h-5 opacity-10 animate-pulse-slow pointer-events-none"
                    style={{ marginTop: "2px", marginLeft: "2px" }}
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="13"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="flex items-center relative z-10">
                    {course.instructor.photo ? (
                      <div className="relative h-10 w-10 mr-3">
                        <Image
                          src={urlFor(course.instructor.photo).url() || ""}
                          alt={course.instructor.name || "Instructor"}
                          fill
                          className="rounded-full object-cover border-2 border-white/20 shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 mr-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white/20">
                        <Loader size="sm" />
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        by {course.instructor.name}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        Expert Instructor
                      </div>
                    </div>
                  </div>
                  <GraduationCap className="h-5 w-5 text-primary/80 group-hover:text-primary transition-colors duration-300 relative z-10" />
                </div>
              )}
              {typeof progress === "number" && (
                <div className="mt-auto">
                  <CourseProgress
                    progress={progress}
                    variant="default"
                    size="sm"
                    label="Course Progress"
                  />
                </div>
              )}
            </>
          )}

          {/* Decorative accent line */}
          <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </Link>
  );
}
