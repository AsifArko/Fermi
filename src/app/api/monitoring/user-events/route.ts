import { NextResponse } from 'next/server';
import { userData } from '../../../../lib/monitoring/data';

export async function GET() {
  try {
    // Return real user events from user data
    const userEvents = userData.userEvents.map(event => ({
      id: event.id,
      eventType: event.eventType,
      eventName: event.eventName,
      url: event.url,
      timestamp: event.timestamp,
      sessionId: `sess_${event.id.split('_')[1]}`,
      metadata: {
        source: 'user_interaction',
        category: event.eventType,
      },
    }));

    return NextResponse.json({
      success: true,
      data: userEvents,
      message: 'User events data retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve user events data',
      },
      { status: 500 }
    );
  }
}
