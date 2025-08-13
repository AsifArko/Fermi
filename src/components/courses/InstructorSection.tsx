'use client';

import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { User, Award, Mail } from 'lucide-react';
interface InstructorSectionProps {
  instructor?: {
    _id?: string;
    name?: string;
    bio?: string;
    photo?: {
      asset?: {
        _ref?: string;
      };
    };
  } | null;
}

export function InstructorSection({ instructor }: InstructorSectionProps) {
  if (!instructor) {
    return (
      <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-border/50 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-foreground">
          Instructor
        </h2>
        <p className="text-muted-foreground">
          No instructor information available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-border/50 shadow-xl sticky top-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
          Instructor
        </h2>
      </div>

      {/* Instructor Profile */}
      <div className="space-y-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {instructor.photo ? (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg">
                <Image
                  src={urlFor(instructor.photo).url() || ''}
                  alt={instructor.name || 'Instructor'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
            )}
          </div>

          {/* Name and Title */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg sm:text-xl text-foreground mb-1">
              {instructor.name}
            </h3>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium uppercase tracking-wide">
                Instructor
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {instructor.bio && (
          <div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {instructor.bio}
            </p>
          </div>
        )}

        {/* Contact Info - Placeholder for future fields */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>Contact instructor for inquiries</span>
          </div>
        </div>
      </div>
    </div>
  );
}
