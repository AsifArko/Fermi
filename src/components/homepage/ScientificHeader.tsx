'use client';

import { BookOpen, Filter } from 'lucide-react';
import Link from 'next/link';

import { SearchInput } from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScientificHeaderProps {
  className?: string;
}

export function ScientificHeader({ className }: ScientificHeaderProps) {
  return (
    <section
      className={cn(
        'py-6 sm:py-8 bg-gradient-to-r from-background via-background to-primary/5',
        className
      )}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
          {/* Brand & Title */}
          <div className='flex flex-col items-center lg:items-start text-center lg:text-left'>
            <Link
              href='/'
              prefetch={false}
              className='flex items-center space-x-3 mb-3 hover:opacity-90 transition-opacity'
            >
              <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center'>
                <BookOpen className='w-6 h-6 text-primary-foreground' />
              </div>
              <span className='text-2xl font-bold tracking-tight text-foreground'>
                Fermi
              </span>
            </Link>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2'>
              Advanced Learning Platform
            </h1>
            <p className='text-sm sm:text-base text-muted-foreground max-w-md'>
              Master Quantum Computing, Machine Learning, and Software
              Engineering
            </p>
          </div>

          {/* Search & Actions */}
          <div className='flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto'>
            <div className='w-full sm:w-80'>
              <SearchInput />
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' className='h-9 px-3 text-sm'>
                <Filter className='w-4 h-4 mr-2' />
                Filters
              </Button>
              <Button variant='default' size='sm' className='h-9 px-4 text-sm'>
                Browse All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
