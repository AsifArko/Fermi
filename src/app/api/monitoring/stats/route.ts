import { NextResponse } from 'next/server';
import { userData, updateSystemMetrics } from '../../../../lib/monitoring/data';

export async function GET() {
  try {
    // Update system metrics before returning
    updateSystemMetrics();

    const totalPageViews = userData.pageViews.length;
    const totalUserEvents = userData.userEvents.length;
    const totalHttpRequests = userData.httpRequests.length;

    // Calculate error rate from HTTP requests
    const errorRequests = userData.httpRequests.filter(
      req => req.statusCode >= 400
    ).length;
    const errorRate =
      totalHttpRequests > 0 ? (errorRequests / totalHttpRequests) * 100 : 0;

    // Calculate active users (unique sessions in last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentPageViews = userData.pageViews.filter(
      pv => new Date(pv.timestamp) > oneHourAgo
    );
    const activeUsers = Math.min(recentPageViews.length, 50);

    // Calculate average response time
    const validDurations = userData.httpRequests
      .filter(req => req.duration > 0)
      .map(req => req.duration);
    const averageResponseTime =
      validDurations.length > 0
        ? validDurations.reduce((a, b) => a + b, 0) / validDurations.length
        : 0;

    // Get top errors
    const errorCounts = userData.httpRequests
      .filter(req => req.statusCode >= 400)
      .reduce(
        (acc, req) => {
          const status = req.statusCode.toString();
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    const topErrors = Object.entries(errorCounts)
      .map(([status, count]) => ({
        message: `HTTP ${status} Error`,
        count,
        statusCode: parseInt(status),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stats = {
      uptime: userData.systemMetrics.uptime,
      activeUsers,
      totalRequests: totalHttpRequests,
      errorRate: Math.round(errorRate * 100) / 100,
      pageViews: totalPageViews,
      userEvents: totalUserEvents,
      averageResponseTime: Math.round(averageResponseTime),
      systemHealth: {
        cpu: Math.round(userData.systemMetrics.cpu * 10) / 10,
        memory: Math.round(userData.systemMetrics.memory * 10) / 10,
        disk: Math.round(userData.systemMetrics.disk * 10) / 10,
      },
      topErrors,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: stats,
      message: 'Monitoring stats retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve monitoring stats',
      },
      { status: 500 }
    );
  }
}
