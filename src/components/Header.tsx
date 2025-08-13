'use client';

import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { SearchInput } from './SearchInput';
import { Button } from './ui/button';
import DarkModeToggle from './DarkModeToggle';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ensure component is mounted before checking pathname
  useEffect(() => {
    setMounted(true);
  }, []);

  const hideHeader =
    mounted &&
    (pathname?.includes('/dashboard/courses/') ||
      pathname?.includes('/lessons/') ||
      pathname?.includes('/studio/') ||
      pathname?.includes('/studio/structure'));

  if (hideHeader) return null;

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg animate-pulse" />
              <div className="w-20 h-6 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex-1 max-w-md mx-4">
              <div className="w-full h-9 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-20 h-8 bg-muted rounded animate-pulse" />
              <div className="w-8 h-8 bg-muted rounded animate-pulse" />
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="md:hidden">
              <div className="w-8 h-8 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                prefetch={false}
                className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 bg-primary/85 rounded-lg" />
                <span className="text-xl font-bold tracking-tight text-foreground">
                  Fermi
                </span>
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <SearchInput />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <SignedIn>
                <Link href="/my-courses">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Courses
                  </Button>
                </Link>
                <DarkModeToggle />
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8',
                    },
                  }}
                />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-4 text-sm font-medium"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border/20 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border/20">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <div className="pb-4 border-b border-border/20">
                <SearchInput />
              </div>

              {/* Navigation Links */}
              <SignedIn>
                <Link
                  href="/my-courses"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">My Courses</span>
                </Link>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 text-base"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>

              {/* Theme Toggle */}
              <div className="pt-4 border-t border-border/20">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium">Theme</span>
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
