import { NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

import { performanceMiddleware } from './middleware/performance';

export default clerkMiddleware((_auth, req) => {
  // Apply performance monitoring first
  performanceMiddleware(req);

  // Clerk will automatically handle authentication for protected routes
  // The clerkMiddleware will redirect unauthenticated users to sign-in
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
