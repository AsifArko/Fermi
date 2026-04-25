'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';

interface ClientAnalyticsProps {
  userId?: string;
}

// Extend Window interface for global tracking
declare global {
  interface Window {
    trackEvent?: (
      eventType: string,
      eventName: string,
      metadata?: Record<string, unknown>
    ) => Promise<void>;
  }
}

export function ClientAnalytics({ userId }: ClientAnalyticsProps) {
  const pathname = usePathname();

  const trackEvent = useCallback(
    async (
      eventType: string,
      eventName: string,
      metadata?: Record<string, unknown>
    ) => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType,
            eventName,
            url: pathname,
            metadata: {
              ...metadata,
              userId,
            },
          }),
        });
      } catch (error) {
        // Silently handle errors in production
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to track event:', error);
        }
      }
    },
    [pathname, userId]
  );

  // Track page view on route change
  useEffect(() => {
    if (!userId) return;

    const handlePageView = async () => {
      try {
        const startTime = performance.now();

        // Wait for page to fully load
        if (document.readyState === 'complete') {
          const loadTime = performance.now() - startTime;
          await trackEvent('page_view', window.location.pathname, { loadTime });
        } else {
          window.addEventListener('load', async () => {
            const loadTime = performance.now() - startTime;
            await trackEvent('page_view', window.location.pathname, {
              loadTime,
            });
          });
        }
      } catch (error) {
        // Silently fail if tracking fails
      }
    };

    handlePageView();
  }, [userId]);

  // Expose tracking function globally for use in other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackEvent = trackEvent;
    }
  }, [trackEvent]);

  return null;
}
