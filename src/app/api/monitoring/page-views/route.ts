import { NextResponse } from 'next/server';
import { userData } from '../../../../lib/monitoring/data';

export async function GET() {
  try {
    // Return real page views from user data
    const pageViews = userData.pageViews.map(pv => ({
      id: pv.id,
      url: pv.url,
      sessionId: `sess_${pv.id.split('_')[1]}`,
      timestamp: pv.timestamp,
      loadTime: Math.floor(Math.random() * 2000) + 500, // Simulated load time
      userAgent: pv.userAgent,
      deviceType: pv.deviceType,
      browser: pv.browser,
      referrer: 'direct', // Default referrer
    }));

    return NextResponse.json({
      success: true,
      data: pageViews,
      message: 'Page views data retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve page views data',
      },
      { status: 500 }
    );
  }
}
