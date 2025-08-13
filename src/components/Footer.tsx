'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const hideFooter =
    pathname?.includes('/studio/') ||
    pathname?.includes('/studio/structure') ||
    pathname?.includes('/dashboard/courses/') ||
    pathname?.includes('/lessons/');

  if (hideFooter) return null;

  return (
    <footer className="relative w-full border-t from-background via-background to-primary/10 dark:bg-gray-950 py-6 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 relative z-10">
        <div className="text-xs text-muted-foreground">
          © {currentYear || '2024'} Fermi. All rights reserved.
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
