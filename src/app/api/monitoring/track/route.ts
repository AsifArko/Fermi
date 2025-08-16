import { NextRequest, NextResponse } from 'next/server';
import { userData } from '../../../../lib/monitoring/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    const id = `${type}_${Date.now()}`;

    switch (type) {
      case 'pageview':
        userData.pageViews.push({
          id,
          url: data.url,
          userAgent: data.userAgent,
          deviceType: data.deviceType,
          browser: data.browser,
          timestamp: data.timestamp,
        });

        // Keep only last 1000 page views
        if (userData.pageViews.length > 1000) {
          userData.pageViews = userData.pageViews.slice(-1000);
        }
        break;

      case 'user_event':
        userData.userEvents.push({
          id,
          eventType: data.eventType,
          eventName: data.eventName,
          url: data.url,
          timestamp: data.timestamp,
        });

        // Keep only last 1000 user events
        if (userData.userEvents.length > 1000) {
          userData.userEvents = userData.userEvents.slice(-1000);
        }
        break;

      case 'performance':
        userData.performance.push({
          id,
          metric: data.metric,
          value: data.value,
          url: data.url,
          timestamp: data.timestamp,
        });

        // Keep only last 1000 performance metrics
        if (userData.performance.length > 1000) {
          userData.performance = userData.performance.slice(-1000);
        }
        break;

      case 'http_request':
        userData.httpRequests.push({
          id,
          method: data.method,
          url: data.url,
          statusCode: data.statusCode,
          duration: data.duration,
          timestamp: data.timestamp,
        });

        // Keep only last 1000 HTTP requests
        if (userData.httpRequests.length > 1000) {
          userData.httpRequests = userData.httpRequests.slice(-1000);
        }
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
