import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { BookOpen, User, Sun } from 'lucide-react';
import Link from 'next/link';

import DarkModeToggle from './DarkModeToggle';
import { Button } from './ui/button';

export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    open && (
      <div className='fixed inset-0 z-[100] flex'>
        {/* Overlay (clicking this closes the sidebar) */}
        <div
          className='flex-1 bg-black/40 backdrop-blur-sm'
          onClick={onClose}
        />
        {/* Sidebar (not covered by overlay) */}
        <nav className='relative w-72 max-w-full h-full bg-background border-l border-border shadow-xl flex flex-col p-0 animate-in slide-in-from-right-8 z-50'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 border-b border-border'>
            <span className='text-lg font-bold tracking-tight'>Menu</span>
            <button
              className='text-2xl font-bold text-muted-foreground hover:text-primary focus:outline-none'
              onClick={onClose}
              aria-label='Close menu'
            >
              ×
            </button>
          </div>
          {/* Navigation */}
          <ul className='flex-1 flex flex-col gap-1 px-2 py-4'>
            <SignedIn>
              <li>
                <Link
                  href='/my-courses'
                  onClick={onClose}
                  className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors text-base font-medium'
                >
                  <BookOpen className='w-5 h-5 text-primary' />
                  <span>My Courses</span>
                </Link>
              </li>
            </SignedIn>
            <SignedOut>
              <li>
                <SignInButton mode='modal'>
                  <Button
                    variant='outline'
                    className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium justify-start'
                  >
                    <User className='w-5 h-5 text-primary' />
                    <span>Sign In</span>
                  </Button>
                </SignInButton>
              </li>
            </SignedOut>
            <li>
              <div className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer'>
                <Sun className='w-5 h-5 text-primary' />
                <span>Theme</span>
                <span className='ml-auto'>
                  <DarkModeToggle />
                </span>
              </div>
            </li>
          </ul>
          {/* Divider */}
          <div className='border-t border-border my-2' />
          {/* Account */}
          <div className='px-4 pb-6'>
            <SignedIn>
              <div className='flex items-center gap-3'>
                <User className='w-5 h-5 text-primary' />
                <span className='font-medium'>Account</span>
                <span className='ml-auto'>
                  <UserButton />
                </span>
              </div>
            </SignedIn>
          </div>
        </nav>
      </div>
    )
  );
}
