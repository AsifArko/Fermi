import { BookOpen, Users, Award, Clock } from 'lucide-react';

interface StatsSectionProps {
  coursesCount: number;
  categoriesCount: number;
  instructorsCount: number;
  filteredCoursesCount: number;
}

export function StatsSection({
  coursesCount,
  categoriesCount,
  instructorsCount,
  filteredCoursesCount,
}: StatsSectionProps) {
  const stats = [
    {
      icon: BookOpen,
      value: filteredCoursesCount,
      label: 'courses available',
      color: 'text-gray-600 dark:text-gray-400',
    },
    {
      icon: Award,
      value: categoriesCount,
      label: 'categories',
      color: 'text-gray-600 dark:text-gray-400',
    },
    {
      icon: Users,
      value: instructorsCount,
      label: 'instructors',
      color: 'text-gray-600 dark:text-gray-400',
    },
    {
      icon: Clock,
      value: coursesCount,
      label: 'total courses',
      color: 'text-gray-600 dark:text-gray-400',
    },
  ];

  return (
    <div className="mb-8 sm:mb-12">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <stat.icon
              className={`h-6 sm:h-8 w-6 sm:w-8 ${stat.color} mx-auto mb-2 sm:mb-3`}
            />
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
