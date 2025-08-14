import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

import { DashboardScientificBackground } from '@/components/DashboardScientificBackground';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SidebarProvider } from '@/components/providers/SidebarProvider';
import { SanityLive } from '@/sanity/lib/live';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Course dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <DashboardScientificBackground />
        <SidebarProvider>
          <div className='h-full'>{children}</div>
        </SidebarProvider>
      </ThemeProvider>

      {process.env.NODE_ENV === 'development' && <SanityLive />}
    </ClerkProvider>
  );
}
