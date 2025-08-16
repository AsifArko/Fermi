'use client';

import { useEffect } from 'react';

export function Monitoring() {
  useEffect(() => {
    trackPageView();
    trackUserInteractions();
    trackPerformance();
  }, []);

  const trackPageView = async () => {
    try {
      const url = window.location.pathname;
      const userAgent = navigator.userAgent;
      const deviceType = getDeviceType(userAgent);
      const browser = getBrowser(userAgent);

      await fetch('/api/monitoring/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pageview',
          url,
          userAgent,
          deviceType,
          browser,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      // Silently fail
    }
  };

  const trackUserInteractions = () => {
    document.addEventListener('click', async event => {
      const target = event.target as HTMLElement;
      if (target) {
        try {
          await fetch('/api/monitoring/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'user_event',
              eventType: 'click',
              eventName: target.tagName.toLowerCase(),
              url: window.location.pathname,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          // Silently fail
        }
      }
    });

    document.addEventListener('submit', async event => {
      const form = event.target as HTMLFormElement;
      if (form) {
        try {
          await fetch('/api/monitoring/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'user_event',
              eventType: 'form_submit',
              eventName: form.action || 'unknown',
              url: window.location.pathname,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          // Silently fail
        }
      }
    });
  };

  const trackPerformance = () => {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        fetch('/api/monitoring/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'performance',
            metric: 'page_load_time',
            value: loadTime,
            url: window.location.pathname,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {});
      });
    }
  };

  const getDeviceType = (userAgent: string): string => {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      if (/iPad/.test(userAgent)) return 'tablet';
      return 'mobile';
    }
    return 'desktop';
  };

  const getBrowser = (userAgent: string): string => {
    if (/Chrome/.test(userAgent)) return 'Chrome';
    if (/Firefox/.test(userAgent)) return 'Firefox';
    if (/Safari/.test(userAgent)) return 'Safari';
    if (/Edge/.test(userAgent)) return 'Edge';
    return 'Other';
  };

  return null;
}
