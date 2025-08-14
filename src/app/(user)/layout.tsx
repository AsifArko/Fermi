import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

import Header from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SanityLive } from '@/sanity/lib/live';

export const metadata: Metadata = {
  title: 'Fermi',
  description: 'Fermi is a e-Learning platform',
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <div className='min-h-screen flex flex-col'>
          <Header />
          <main className='flex-1'>{children}</main>
        </div>
        {process.env.NODE_ENV === 'development' && <SanityLive />}
      </ThemeProvider>
    </ClerkProvider>
  );
}
