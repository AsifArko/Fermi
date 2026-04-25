import { NextResponse } from 'next/server';
import { userData } from '../../../../lib/monitoring/data';

export async function GET() {
  try {
    // Get performance metrics from collected data
    const performanceData = userData.performance;

    // Calculate average values for each metric
    const metricAverages: Record<string, number> = {};
    const metricCounts: Record<string, number> = {};

    performanceData.forEach(metric => {
      if (!metricAverages[metric.metric]) {
        metricAverages[metric.metric] = 0;
        metricCounts[metric.metric] = 0;
      }
      metricAverages[metric.metric] += metric.value;
      metricCounts[metric.metric]++;
    });

    // Calculate averages
    Object.keys(metricAverages).forEach(metric => {
      if (metricCounts[metric] > 0) {
        metricAverages[metric] = Math.round(
          metricAverages[metric] / metricCounts[metric]
        );
      }
    });

    // Get recent performance data (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentPerformance = performanceData.filter(
      perf => new Date(perf.timestamp) > oneDayAgo
    );

    // Group by metric type
    const performanceByMetric = recentPerformance.reduce(
      (acc, perf) => {
        if (!acc[perf.metric]) {
          acc[perf.metric] = [];
        }
        acc[perf.metric].push(perf);
        return acc;
      },
      {} as Record<string, typeof performanceData>
    );

    // Calculate trends (simple comparison with previous period)
    const trends: Record<string, string> = {};
    Object.keys(performanceByMetric).forEach(metric => {
      const recent = performanceByMetric[metric].slice(-10); // Last 10 measurements
      const previous = performanceByMetric[metric].slice(-20, -10); // Previous 10 measurements

      if (recent.length > 0 && previous.length > 0) {
        const recentAvg =
          recent.reduce((sum, p) => sum + p.value, 0) / recent.length;
        const previousAvg =
          previous.reduce((sum, p) => sum + p.value, 0) / previous.length;

        if (recentAvg < previousAvg * 0.9) trends[metric] = 'improving';
        else if (recentAvg > previousAvg * 1.1) trends[metric] = 'degrading';
        else trends[metric] = 'stable';
      } else {
        trends[metric] = 'insufficient_data';
      }
    });

    const performanceMetrics = {
      coreWebVitals: {
        lcp: {
          value: metricAverages['LCP'] || 0,
          unit: 'ms',
          status: getPerformanceStatus('LCP', metricAverages['LCP'] || 0),
          trend: trends['LCP'] || 'insufficient_data',
        },
        fid: {
          value: metricAverages['FID'] || 0,
          unit: 'ms',
          status: getPerformanceStatus('FID', metricAverages['FID'] || 0),
          trend: trends['FID'] || 'insufficient_data',
        },
        cls: {
          value: metricAverages['CLS'] || 0,
          unit: 'score',
          status: getPerformanceStatus('CLS', metricAverages['CLS'] || 0),
          trend: trends['CLS'] || 'insufficient_data',
        },
        fcp: {
          value: metricAverages['FCP'] || 0,
          unit: 'ms',
          status: getPerformanceStatus('FCP', metricAverages['FCP'] || 0),
          trend: trends['FCP'] || 'insufficient_data',
        },
        ttfb: {
          value: metricAverages['TTFB'] || 0,
          unit: 'ms',
          status: getPerformanceStatus('TTFB', metricAverages['TTFB'] || 0),
          trend: trends['TTFB'] || 'insufficient_data',
        },
      },
      additionalMetrics: {
        pageLoadTime: {
          value: metricAverages['LCP'] || 0,
          unit: 'ms',
          status: getPerformanceStatus('LCP', metricAverages['LCP'] || 0),
        },
        firstContentfulPaint: {
          value: metricAverages['FCP'] || 0,
          unit: 'ms',
          status: getPerformanceStatus('FCP', metricAverages['FCP'] || 0),
        },
      },
      trends,
      totalMeasurements: performanceData.length,
      recentMeasurements: recentPerformance.length,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: performanceMetrics,
      message: 'Performance metrics retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve performance metrics',
      },
      { status: 500 }
    );
  }
}

// Helper function to determine performance status
function getPerformanceStatus(metric: string, value: number): string {
  switch (metric) {
    case 'LCP':
      if (value <= 2500) return 'Good';
      if (value <= 4000) return 'Needs Improvement';
      return 'Poor';
    case 'FID':
      if (value <= 100) return 'Good';
      if (value <= 300) return 'Needs Improvement';
      return 'Poor';
    case 'CLS':
      if (value <= 0.1) return 'Good';
      if (value <= 0.25) return 'Needs Improvement';
      return 'Poor';
    case 'FCP':
      if (value <= 1800) return 'Good';
      if (value <= 3000) return 'Needs Improvement';
      return 'Poor';
    case 'TTFB':
      if (value <= 800) return 'Good';
      if (value <= 1800) return 'Needs Improvement';
      return 'Poor';
    default:
      return 'Unknown';
  }
}
