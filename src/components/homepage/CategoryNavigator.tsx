'use client';

import { cn } from '@/lib/utils';
import {
  Cpu,
  Brain,
  Code,
  Atom,
  Database,
  Network,
  Zap,
  Globe,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

const categories: Category[] = [
  {
    id: 'quantum-computing',
    name: 'Quantum Computing',
    icon: Atom,
    description: 'Quantum algorithms and qubits',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    icon: Brain,
    description: 'AI and neural networks',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    icon: Code,
    description: 'Development and architecture',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    icon: Cpu,
    description: 'Algorithms and theory',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: Database,
    description: 'Analytics and visualization',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'gpu-programming',
    name: 'GPU Programming',
    icon: Zap,
    description: 'CUDA and parallel computing',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: Network,
    description: 'Protocols and infrastructure',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'web-development',
    name: 'Web Development',
    icon: Globe,
    description: 'Frontend and backend',
    color: 'from-teal-500 to-teal-600',
  },
];

interface CategoryNavigatorProps {
  className?: string;
}

export function CategoryNavigator({ className }: CategoryNavigatorProps) {
  return (
    <section
      className={cn('py-4 sm:py-6 border-b border-border/20', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Explore by Category
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose your learning path from our specialized domains
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {categories.map(category => {
              const Icon = category.icon;

              return (
                <div
                  key={category.id}
                  className={cn(
                    'group relative flex flex-col items-center p-3 sm:p-4 rounded-xl transition-all duration-300',
                    'border border-border/50 hover:border-primary/30',
                    'bg-background hover:bg-primary/5',
                    'transform hover:scale-105 hover:-translate-y-1'
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2',
                      'bg-gradient-to-br transition-all duration-300',
                      category.color
                    )}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>

                  {/* Name */}
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-medium text-center leading-tight',
                      'text-foreground group-hover:text-primary transition-colors'
                    )}
                  >
                    {category.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
