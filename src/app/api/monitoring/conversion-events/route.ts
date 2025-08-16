import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return empty array since we don't collect conversion events yet
    // This will be populated when we implement conversion tracking
    const conversionEvents: any[] = [];

    return NextResponse.json({
      success: true,
      data: conversionEvents,
      message: 'Conversion events data retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve conversion events data',
      },
      { status: 500 }
    );
  }
}
