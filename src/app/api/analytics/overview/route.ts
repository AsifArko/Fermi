import { NextResponse } from 'next/server';

import { analyticsService } from '@/lib/monitoring/analyticsService';
import { MonitoringService } from '@/lib/monitoring/monitoringService';

export async function GET() {
  try {
    const monitoring = MonitoringService.getInstance();
    const analytics = await analyticsService.getAnalyticsData();
    const metrics = monitoring.getMetricsObject();
    const systemMetrics = monitoring.getSystemMetrics();

    const overview = {
      timestamp: new Date().toISOString(),
      metrics: {
        httpRequests: metrics.httpRequestsTotal,
        requestDuration:
          metrics.httpRequestDuration.length > 0
            ? metrics.httpRequestDuration.reduce((a, b) => a + b, 0) /
              metrics.httpRequestDuration.length
            : 0,
        activeConnections: systemMetrics.activeConnections,
        memoryUsage: systemMetrics.memory,
        cpuUsage: systemMetrics.cpu,
        pageViews: metrics.pageViewsTotal,
        userEvents: metrics.userEventsTotal,
        errors: metrics.errorRate,
      },
      analytics: {
        totalUsers: analytics.totalUsers,
        activeUsers: analytics.activeUsers,
        pageViews: analytics.pageViews,
        conversionRate: analytics.conversionRate,
        topPages: analytics.topPages,
        userEngagement: analytics.userEngagement,
      },
    };

    return NextResponse.json(overview);
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching analytics data:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
