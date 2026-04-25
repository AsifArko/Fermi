import { NextRequest, NextResponse } from 'next/server';

import {
  analyticsService,
  PageView,
  UserEvent,
  PerformanceMetric,
} from '@/lib/monitoring/analyticsService';

// Helper functions for device detection
function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const mobileRegex =
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletRegex = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i;

  if (tabletRegex.test(userAgent)) return 'tablet';
  if (mobileRegex.test(userAgent)) return 'mobile';
  return 'desktop';
}

function getBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function getOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, eventName, url, metadata, performance, pageView } = body;

    // Get client IP address
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Generate session ID (in a real app, this would come from client)
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Track page view if provided
    if (pageView) {
      const fullPageView: PageView = {
        id: `pv_${Date.now()}`,
        timestamp: new Date(),
        url: pageView.url,
        referrer: pageView.referrer,
        userAgent,
        ipAddress,
        userId: pageView.userId,
        pageLoadTime: pageView.pageLoadTime || 0,
        sessionId,
        deviceType: getDeviceType(userAgent),
        browser: getBrowser(userAgent),
        os: getOS(userAgent),
      };

      await analyticsService.trackPageView(fullPageView);
    }

    // Track user event if provided
    if (eventType && eventName) {
      const fullUserEvent: UserEvent = {
        id: `ue_${Date.now()}`,
        timestamp: new Date(),
        eventType,
        eventName,
        url: url || '/',
        userId: metadata?.userId,
        ipAddress,
        sessionId,
        metadata: metadata,
      };

      await analyticsService.trackUserEvent(fullUserEvent);
    }

    // Track performance metric if provided
    if (performance) {
      const fullPerformanceMetric: PerformanceMetric = {
        id: `perf_${Date.now()}`,
        timestamp: new Date(),
        url: url || '/',
        loadTime: performance.loadTime || 0,
        firstContentfulPaint: performance.firstContentfulPaint || 0,
        largestContentfulPaint: performance.largestContentfulPaint || 0,
        cumulativeLayoutShift: performance.cumulativeLayoutShift || 0,
        firstInputDelay: performance.firstInputDelay || 0,
        userId: metadata?.userId,
        sessionId,
      };

      await analyticsService.trackPerformanceMetric(fullPerformanceMetric);
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to track event',
      },
      { status: 500 }
    );
  }
}
