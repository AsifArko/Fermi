import { NextResponse } from 'next/server';
import { userData } from '../../../../lib/monitoring/data';

export async function GET() {
  try {
    // Calculate traffic metrics based on real user data
    const totalPageViews = userData.pageViews.length;
    const totalUserEvents = userData.userEvents.length;
    const totalHttpRequests = userData.httpRequests.length;

    // Calculate unique visitors (based on unique user agents)
    const uniqueUserAgents = new Set(
      userData.pageViews.map(pv => pv.userAgent)
    );
    const uniqueVisitors = uniqueUserAgents.size;

    // Calculate average session duration (simulated based on page views per session)
    const sessions = Math.ceil(totalPageViews / 3); // Assume 3 page views per session
    const averageSessionDuration =
      sessions > 0 ? Math.round((totalPageViews / sessions) * 30) : 0; // 30 seconds per page

    // Calculate bounce rate (single page sessions)
    const singlePageSessions = userData.pageViews.filter((pv, index, arr) => {
      const nextPv = arr[index + 1];
      if (!nextPv) return true;
      const timeDiff =
        new Date(nextPv.timestamp).getTime() - new Date(pv.timestamp).getTime();
      return timeDiff > 30 * 60 * 1000; // 30 minutes
    }).length;
    const bounceRate =
      totalPageViews > 0 ? (singlePageSessions / totalPageViews) * 100 : 0;

    // Calculate top pages
    const pageViews = userData.pageViews.reduce(
      (acc, pv) => {
        acc[pv.url] = (acc[pv.url] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const topPages = Object.entries(pageViews)
      .map(([url, views]) => ({ url, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Calculate traffic by device type
    const deviceBreakdown = userData.pageViews.reduce(
      (acc, pv) => {
        acc[pv.deviceType] = (acc[pv.deviceType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate traffic by browser
    const browserBreakdown = userData.pageViews.reduce(
      (acc, pv) => {
        acc[pv.browser] = (acc[pv.browser] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate geographic breakdown
    const geographicBreakdown = userData.pageViews.reduce(
      (acc, pv) => {
        const country = pv.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate top referrers
    const referrerCounts = userData.pageViews.reduce(
      (acc, pv) => {
        const referrer = pv.referrer || 'direct';
        acc[referrer] = (acc[referrer] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, visits]) => ({ referrer, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);

    const trafficData = {
      totalPageViews,
      totalUserEvents,
      totalHttpRequests,
      uniqueVisitors,
      averageSessionDuration,
      bounceRate: Math.round(bounceRate * 100) / 100,
      topPages,
      topReferrers,
      deviceBreakdown,
      browserBreakdown,
      geographicBreakdown,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: trafficData,
      message: 'Traffic data retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve traffic data',
      },
      { status: 500 }
    );
  }
}
