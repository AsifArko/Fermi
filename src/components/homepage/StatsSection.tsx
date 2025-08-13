import {
  BookOpen,
  Users,
  Award,
  Clock,
  Code,
  FileText,
  GraduationCap,
  Brain,
  Zap,
  Globe,
} from 'lucide-react';

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
      label: 'courses',
    },
    {
      icon: Award,
      value: categoriesCount,
      label: 'categories',
    },
    {
      icon: Users,
      value: instructorsCount,
      label: 'instructors',
    },
    {
      icon: Clock,
      value: coursesCount,
      label: 'Hours of Content',
    },
  ];

  const features = [
    { icon: Code, label: 'Jupyter Extension' },
    { icon: Globe, label: 'Google Colab' },
    { icon: FileText, label: 'Multiple Media' },
    { icon: GraduationCap, label: 'PhD Instructors' },
    { icon: Brain, label: 'Quantum Computing' },
    { icon: Zap, label: 'AI & ML' },
  ];

  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-sm border border-gray-300 dark:border-gray-600 flex items-center gap-2 text-sm"
          >
            <stat.icon className="h-4 w-4" />
            <span className="font-semibold">{stat.value}</span>
            <span className="text-xs opacity-80">{stat.label}</span>
          </div>
        ))}

        {/* Subtle separator */}
        <div className="flex items-center">
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {features.map((feature, index) => (
          <div
            key={`feature-${index}`}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-sm border border-gray-300 dark:border-gray-600 flex items-center gap-2 text-sm"
          >
            <feature.icon className="h-4 w-4" />
            <span className="text-xs">{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
