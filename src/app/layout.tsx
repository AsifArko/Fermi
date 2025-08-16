import { ClerkProvider } from '@clerk/nextjs';
import { type Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';

import { DisableDraftMode } from '@/components/DisableDraftMode';
import Footer from '@/components/Footer';
import { GlobalScientificBackground } from '@/components/GlobalScientificBackground';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Monitoring } from '@/components/Monitoring';

// Initialize monitoring services
import '@/lib/monitoring/init';
// Initialize client-side monitoring
import '@/lib/monitoring/client';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fermi',
  description: 'Fermi is a e-Learning platform',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className='antialiased' suppressHydrationWarning>
        <GlobalScientificBackground />
        {(await draftMode()).isEnabled && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
        <ClerkProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
            <Monitoring />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
