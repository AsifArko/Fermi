import { NextResponse } from 'next/server';

export async function GET() {
  // Mock analytics data - in production this would come from your analytics service
  const mockAnalytics = {
    totalUsers: 15420,
    activeUsers: 8234,
    pageViews: 45678,
    conversionRate: 3.2,
    topPages: [
      { path: '/courses', views: 12500, change: 15 },
      { path: '/about', views: 8900, change: 8 },
      { path: '/contact', views: 6700, change: 12 },
      { path: '/courses/quantum-physics', views: 5400, change: 25 },
      { path: '/courses/advanced-mathematics', views: 4200, change: 18 },
    ],
    userEngagement: {
      averageSessionDuration: 180, // seconds
      bounceRate: 0.35,
      pagesPerSession: 2.8,
    },
    deviceStats: {
      desktop: 9250,
      mobile: 4800,
      tablet: 1370,
    },
    geographicData: [
      { country: 'United States', users: 6200, percentage: 40.2 },
      { country: 'United Kingdom', users: 2800, percentage: 18.2 },
      { country: 'Canada', users: 1800, percentage: 11.7 },
      { country: 'Germany', users: 1500, percentage: 9.7 },
      { country: 'Australia', users: 1200, percentage: 7.8 },
    ],
  };

  return NextResponse.json({
    success: true,
    analytics: mockAnalytics,
    timestamp: new Date().toISOString(),
  });
}
