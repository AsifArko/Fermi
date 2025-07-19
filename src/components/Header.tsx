"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { SearchInput } from "./SearchInput";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import MobileSidebar from "./MobileSidebar";

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
    (pathname?.includes("/dashboard/courses/") ||
      pathname?.includes("/lessons/") ||
      pathname?.includes("/studio/") ||
      pathname?.includes("/studio/structure"));

  if (hideHeader) return null;

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="max-w-7xl mx-auto fixed top-0 left-0 right-0 z-50 bg-background border-b border-border py-4 px-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-2 min-h-0">
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-2xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                Fermi
              </span>
            </div>
            <div className="flex-1 min-w-0 mx-2">
              <div className="w-full h-9 bg-secondary/80 rounded-md animate-pulse" />
            </div>
            <div className="hidden md:flex items-center gap-2 z-10 shrink-0">
              <div className="w-20 h-8 bg-secondary rounded-md animate-pulse" />
              <div className="w-8 h-8 bg-secondary rounded-md animate-pulse" />
              <div className="w-8 h-8 bg-secondary rounded-md animate-pulse" />
            </div>
            <div className="md:hidden flex items-center z-10">
              <div className="w-9 h-9 bg-secondary rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="max-w-7xl mx-auto fixed top-0 left-0 right-0 z-50 bg-background border-b border-border py-4 px-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-2 min-h-0">
          <Link
            href="/"
            prefetch={false}
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity shrink-0"
          >
            <span className="text-2xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
              Fermi
            </span>
          </Link>
          <div className="flex-1 min-w-0 mx-2">
            <SearchInput />
          </div>
          {/* Desktop nav buttons */}
          <div className="hidden md:flex items-center gap-2 z-10 shrink-0">
            <SignedIn>
              <Link href="/my-courses">
                <Button
                  className="px-4 py-1.5 h-auto text-sm font-semibold rounded-md bg-background text-primary border border-border shadow-none hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  style={{ minWidth: 0, boxShadow: "none" }}
                >
                  My Courses
                </Button>
              </Link>
              <DarkModeToggle />
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="default"
                  className="font-semibold px-4 py-1.5 h-auto text-sm rounded-md"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Sidebar Drawer */}
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  );
}
