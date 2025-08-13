'use client';

import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import EnrollButton from '@/components/EnrollButton';
interface CourseDetailHeroProps {
  course: {
    _id?: string;
    title?: string;
    description?: string;
    image?: {
      asset?: {
        _ref?: string;
      };
    };
    price?: number;
    category?: {
      _id?: string;
      name?: string;
    } | null;
  };
  isEnrolled: boolean;
}

export function CourseDetailHero({
  course,
  isEnrolled,
}: CourseDetailHeroProps) {
  return (
    <div className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      {course.image && (
        <Image
          src={urlFor(course.image).url() || ''}
          alt={course.title || 'Course Title'}
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

      {/* Content Container */}
      <div className="relative z-10 flex items-end min-h-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-end">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1.5 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm border border-white/20">
                  {course.category?.name || 'Uncategorized'}
                </span>
              </div>

              {/* Course Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                {course.title}
              </h1>

              {/* Course Description */}
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl leading-relaxed drop-shadow">
                {course.description}
              </p>
            </div>

            {/* Right Side - Price & Enroll */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </div>
                  <div className="text-white/70 text-sm">One-time payment</div>
                </div>

                {/* Enroll Button */}
                {course._id && (
                  <EnrollButton courseId={course._id} isEnrolled={isEnrolled} />
                )}

                {/* Additional Info */}
                <div className="mt-4 text-center">
                  <div className="text-white/60 text-xs">
                    Lifetime access • Certificate included
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
