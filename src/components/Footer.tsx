'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const hideFooter =
    pathname?.includes('/studio/') ||
    pathname?.includes('/studio/structure') ||
    pathname?.includes('/dashboard/courses/') ||
    pathname?.includes('/lessons/');

  if (hideFooter) return null;

  return (
    <footer className="relative w-full border-t from-background via-background to-primary/10 dark:bg-gray-950 py-6 px-4 mt-12 overflow-hidden">
      {/* Subtle Computer SVG - bottom left, slow float */}
      <div
        className="absolute bottom-2 left-4 opacity-20 animate-float-slow pointer-events-none"
        style={{ animationDuration: '12s' }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-primary/70"
        >
          <rect x="3" y="4" width="18" height="14" rx="2" strokeWidth="1.5" />
          <path d="M8 20h8M12 16v4" strokeWidth="1.5" />
        </svg>
      </div>
      {/* Subtle Molecule SVG - bottom right, slow spin */}
      <div
        className="absolute bottom-2 right-4 opacity-20 animate-spin-slow pointer-events-none"
        style={{ animationDuration: '22s' }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          className="text-primary/70"
        >
          <circle cx="8" cy="14" r="3" strokeWidth="1.5" />
          <circle cx="20" cy="8" r="2" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="2.5" strokeWidth="1.5" />
          <line x1="10.2" y1="13" x2="18" y2="9" strokeWidth="1.2" />
          <line x1="10.2" y1="15" x2="18" y2="19" strokeWidth="1.2" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 relative z-10">
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Fermi. All rights reserved.
        </div>
        <nav className="flex gap-4 text-xs">
          <a
            href="/about"
            className="hover:text-primary transition-colors text-muted-foreground"
          >
            About
          </a>
          <a
            href="/contact"
            className="hover:text-primary transition-colors text-muted-foreground"
          >
            Contact
          </a>
          <a
            href="/privacy-policy"
            className="hover:text-primary transition-colors text-muted-foreground"
          >
            Privacy Policy
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
