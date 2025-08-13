'use client';

import { BookOpen, Clock, Users, Tag } from 'lucide-react';

interface CourseStatsProps {
  totalLessons: number;
  totalModules: number;
  price: number;
  category?: string;
}

export function CourseStats({
  totalLessons,
  totalModules,
  price,
  category,
}: CourseStatsProps) {
  return (
    <div className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 lg:-mt-16 mb-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-border/50 shadow-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Lessons */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {totalLessons}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Lessons
                </div>
              </div>
            </div>

            {/* Total Modules */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-secondary/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {totalModules}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Modules
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {price === 0 ? 'Free' : `$${price}`}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Price
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-muted/50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-semibold text-foreground truncate px-2">
                  {category || 'General'}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Category
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
