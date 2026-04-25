import { NextResponse } from 'next/server';
import { userData } from '../../../../lib/monitoring/data';

export async function GET() {
  try {
    // Get error logs from collected data
    const errorLogs = userData.errorLogs || [];

    // Get recent errors (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentErrors = errorLogs.filter(
      error => new Date(error.timestamp) > oneDayAgo
    );

    // Group errors by type and severity
    const errorsByType = errorLogs.reduce(
      (acc, error) => {
        if (!acc[error.errorType]) {
          acc[error.errorType] = [];
        }
        acc[error.errorType].push(error);
        return acc;
      },
      {} as Record<string, typeof errorLogs>
    );

    const errorsBySeverity = errorLogs.reduce(
      (acc, error) => {
        if (!acc[error.severity]) {
          acc[error.severity] = [];
        }
        acc[error.severity].push(error);
        return acc;
      },
      {} as Record<string, typeof errorLogs>
    );

    // Calculate error statistics
    const errorStats = {
      total: errorLogs.length,
      recent: recentErrors.length,
      byType: Object.keys(errorsByType).map(type => ({
        type,
        count: errorsByType[type].length,
        percentage: Math.round(
          (errorsByType[type].length / errorLogs.length) * 100
        ),
      })),
      bySeverity: Object.keys(errorsBySeverity).map(severity => ({
        severity,
        count: errorsBySeverity[severity].length,
        percentage: Math.round(
          (errorsBySeverity[severity].length / errorLogs.length) * 100
        ),
      })),
      errorRate:
        errorLogs.length > 0
          ? Math.round((errorLogs.length / 1000) * 100) / 100
          : 0, // Errors per 1000 requests
    };

    // Get top errors by frequency
    const errorFrequency = errorLogs.reduce(
      (acc, error) => {
        const key = `${error.errorType}:${error.message}`;
        if (!acc[key]) {
          acc[key] = {
            errorType: error.errorType,
            message: error.message,
            count: 0,
            severity: error.severity,
            firstOccurrence: error.timestamp,
            lastOccurrence: error.timestamp,
          };
        }
        acc[key].count++;
        acc[key].lastOccurrence = error.timestamp;
        return acc;
      },
      {} as Record<string, any>
    );

    const topErrors = Object.values(errorFrequency)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10);

    const errorData = {
      errors: recentErrors.slice(0, 50), // Return last 50 errors
      statistics: errorStats,
      topErrors,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: errorData,
      message: 'Error logs retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve error logs',
      },
      { status: 500 }
    );
  }
}
