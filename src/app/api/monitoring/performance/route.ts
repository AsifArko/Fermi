import { NextResponse } from 'next/server';
import { userData } from '../../../../lib/monitoring/data';

export async function GET() {
  try {
    // Get performance data from user data
    const performanceData = {
      totalMetrics: userData.performance.length,
      averageLoadTime:
        userData.performance.length > 0
          ? userData.performance.reduce(
              (sum, metric) => sum + metric.value,
              0
            ) / userData.performance.length
          : 0,
      lastPerformanceMetric:
        userData.performance.length > 0
          ? userData.performance[userData.performance.length - 1]
          : null,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: performanceData,
      message: 'Performance data retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve performance data',
      },
      { status: 500 }
    );
  }
}
