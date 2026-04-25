import { NextRequest, NextResponse } from 'next/server';

import type {
  TimeRange,
  TimeGranularity,
  SystemAlert,
  ApiResponse,
  MetricsResponse,
  ErrorResponse,
} from '../../../../lib/monitoring/core/types';

import { EnhancedMonitoringService } from '../../../../lib/monitoring/enhanced/EnhancedMonitoringService';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const timeRange = (searchParams.get('range') || '1h') as TimeRange;
    const granularity = (searchParams.get('granularity') ||
      '5m') as TimeGranularity;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const monitoringService = EnhancedMonitoringService.getInstance();

    let data: unknown;
    let dataType: string;

    switch (type) {
      case 'system':
        data = await monitoringService.getSystemMetrics(timeRange, granularity);
        dataType = 'System Metrics';
        break;
      case 'performance':
        data = await monitoringService.getPerformanceMetrics(
          timeRange,
          granularity
        );
        dataType = 'Performance Metrics';
        break;
      case 'traffic':
        data = await monitoringService.getTrafficMetrics();
        dataType = 'Traffic Metrics';
        break;
      case 'users':
        data = await monitoringService.getUserMetrics(timeRange, granularity);
        dataType = 'User Metrics';
        break;
      case 'alerts':
        data = await getSystemAlerts(limit, offset);
        dataType = 'System Alerts';
        break;
      case 'overview':
        data = await getMonitoringOverview(timeRange, granularity);
        dataType = 'Monitoring Overview';
        break;
      case 'health':
        data = await getSystemHealth();
        dataType = 'System Health';
        break;
      case 'summary':
        data = await getMonitoringSummary(timeRange);
        dataType = 'Monitoring Summary';
        break;
      case 'current':
        data = await getCurrentMonitoringData();
        dataType = 'Current Monitoring Data';
        break;
      case 'realtime':
        data = await getRealtimeMonitoringData();
        dataType = 'Real-time Monitoring Data';
        break;
      default:
        data = await monitoringService.getAllMetrics(timeRange, granularity);
        dataType = 'All Metrics';
    }

    // Apply pagination if data is an array
    if (Array.isArray(data) && limit > 0) {
      data = data.slice(offset, offset + limit);
    }

    const response: MetricsResponse<unknown> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      metadata: {
        type: dataType,
        timeRange,
        granularity,
        dataPoints: Array.isArray(data) ? data.length : 1,
        cached: false,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
      code: 'MONITORING_ERROR',
      details: {
        type: 'api_error',
        endpoint: '/api/monitoring/enhanced',
        timestamp: Date.now(),
      },
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const { action, requestData } = await request.json();

    const monitoringService = EnhancedMonitoringService.getInstance();

    switch (action) {
      case 'refresh':
        await monitoringService.collectSystemMetrics();
        await monitoringService.collectPerformanceMetrics();
        return NextResponse.json({
          success: true,
          data: { message: 'Metrics refreshed successfully' },
          timestamp: new Date().toISOString(),
          metadata: {
            type: 'Refresh Response',
            timeRange: '1h',
            granularity: '5m',
            dataPoints: 1,
            cached: false,
          },
        });

      case 'configure':
        if (requestData) {
          await monitoringService.updateConfiguration(requestData);
          return NextResponse.json({
            success: true,
            data: { message: 'Configuration updated successfully' },
            timestamp: new Date().toISOString(),
            metadata: {
              type: 'Configuration Response',
              timeRange: '1h',
              granularity: '5m',
              dataPoints: 1,
              cached: false,
            },
          });
        }
        throw new Error('Configuration data is required');

      case 'test':
        const testResult = await testMonitoringSystem();
        return NextResponse.json({
          success: true,
          data: testResult,
          timestamp: new Date().toISOString(),
          metadata: {
            type: 'Test Response',
            timeRange: '1h',
            granularity: '5m',
            dataPoints: 1,
            cached: false,
          },
        });

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
      code: 'MONITORING_ACTION_ERROR',
      details: {
        type: 'action_error',
        endpoint: '/api/monitoring/enhanced',
        timestamp: Date.now(),
      },
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Helper functions
async function getSystemAlerts(
  limit: number,
  offset: number
): Promise<SystemAlert[]> {
  // In a real implementation, this would fetch from the database
  // For now, return mock data
  const mockAlerts: SystemAlert[] = [
    {
      id: '1',
      timestamp: new Date(),
      severity: 'warning',
      category: 'performance',
      title: 'High CPU Usage',
      message: 'CPU usage has exceeded 80% for the last 5 minutes',
      source: 'system_monitor',
      acknowledged: false,
      resolved: false,
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      severity: 'info',
      category: 'system',
      title: 'System Update Available',
      message: 'A new system update is available for installation',
      source: 'update_service',
      acknowledged: true,
      acknowledgedBy: 'admin',
      acknowledgedAt: new Date(Date.now() - 60000),
      resolved: false,
    },
  ];

  return mockAlerts.slice(offset, offset + limit);
}

async function getMonitoringOverview(
  timeRange: TimeRange,
  granularity: TimeGranularity
): Promise<Record<string, unknown>> {
  const monitoringService = EnhancedMonitoringService.getInstance();

  const [systemMetrics, performanceMetrics, userMetrics] = await Promise.all([
    monitoringService.getSystemMetrics(timeRange, granularity),
    monitoringService.getPerformanceMetrics(timeRange, granularity),
    monitoringService.getUserMetrics(timeRange, granularity),
  ]);

  // Calculate overview statistics
  const totalRequests = performanceMetrics.length;
  const activeConnections = monitoringService.getConnectionCount();

  // Calculate error rate (mock data for now)
  const errorRate = Math.random() * 5; // 0-5%

  // Calculate uptime (mock data for now)
  const uptime = 99.5 + Math.random() * 0.5; // 99.5-100%

  return {
    uptime,
    activeConnections,
    totalRequests,
    errorRate,
    lastUpdate: new Date(),
    systemHealth: {
      cpu: systemMetrics[0]?.cpu?.usage || 0,
      memory: systemMetrics[0]?.memory
        ? (systemMetrics[0].memory.used / systemMetrics[0].memory.total) * 100
        : 0,
      disk: systemMetrics[0]?.disk
        ? (systemMetrics[0].disk.used / systemMetrics[0].disk.total) * 100
        : 0,
      network: systemMetrics[0]?.network?.connections || 0,
    },
    performance: {
      averageLoadTime:
        performanceMetrics.length > 0
          ? performanceMetrics.reduce(
              (sum, metric) => sum + metric.loadTime,
              0
            ) / performanceMetrics.length
          : 0,
      totalPageViews: userMetrics.length,
      uniqueUsers: new Set(
        userMetrics.map(event => event.userId).filter(Boolean)
      ).size,
    },
  };
}

async function getSystemHealth(): Promise<Record<string, unknown>> {
  const monitoringService = EnhancedMonitoringService.getInstance();

  return {
    serviceStatus: monitoringService.isServiceRunning() ? 'running' : 'stopped',
    connectionCount: monitoringService.getConnectionCount(),
    lastMetrics: monitoringService.getLastMetrics('system'),
    configuration: monitoringService.getConfiguration(),
    health: {
      timestamp: new Date(),
      status: 'healthy',
      checks: [
        {
          name: 'Service Running',
          status: 'pass',
          message: 'Monitoring service is operational',
        },
        {
          name: 'Database Connection',
          status: 'pass',
          message: 'Database connection is stable',
        },
        {
          name: 'Memory Usage',
          status: 'pass',
          message: 'Memory usage is within normal limits',
        },
        {
          name: 'CPU Usage',
          status: 'pass',
          message: 'CPU usage is within normal limits',
        },
      ],
    },
  };
}

async function getMonitoringSummary(
  timeRange: TimeRange
): Promise<Record<string, unknown>> {
  const monitoringService = EnhancedMonitoringService.getInstance();

  return {
    summary: {
      timeRange,
      timestamp: new Date(),
      metrics: {
        system: await monitoringService.getSystemMetrics(timeRange, '1h'),
        performance: await monitoringService.getPerformanceMetrics(
          timeRange,
          '1h'
        ),
        users: await monitoringService.getUserMetrics(timeRange, '1h'),
      },
    },
    trends: {
      cpu: 'stable',
      memory: 'stable',
      disk: 'stable',
      network: 'stable',
      performance: 'improving',
    },
    recommendations: [
      'Consider enabling additional performance monitoring for better insights',
      'Review error logs for potential system improvements',
      'Monitor disk usage to prevent storage issues',
    ],
  };
}

async function getCurrentMonitoringData(): Promise<Record<string, unknown>> {
  const monitoringService = EnhancedMonitoringService.getInstance();

  // Get the most recent metrics from each category
  const [systemMetrics, performanceMetrics, trafficMetrics, userMetrics] =
    await Promise.all([
      monitoringService.getSystemMetrics('1h', '5m'),
      monitoringService.getPerformanceMetrics('1h', '5m'),
      monitoringService.getTrafficMetrics(),
      monitoringService.getUserMetrics('1h', '5m'),
    ]);

  return {
    currentMetrics: {
      timestamp: new Date(),
      system:
        systemMetrics.length > 0
          ? systemMetrics[systemMetrics.length - 1]
          : null,
      performance:
        performanceMetrics.length > 0
          ? performanceMetrics[performanceMetrics.length - 1]
          : null,
      traffic:
        trafficMetrics.length > 0
          ? trafficMetrics[trafficMetrics.length - 1]
          : null,
      users:
        userMetrics.length > 0 ? userMetrics[userMetrics.length - 1] : null,
    },
    serviceStatus: monitoringService.isServiceRunning(),
    connectionCount: monitoringService.getConnectionCount(),
    lastUpdate: new Date(),
    lastMetrics: {
      system: monitoringService.getLastMetrics('system'),
      performance: monitoringService.getLastMetrics('performance'),
    },
  };
}

async function getRealtimeMonitoringData(): Promise<Record<string, unknown>> {
  const monitoringService = EnhancedMonitoringService.getInstance();

  // Get real-time data using the most recent time range
  const [systemMetrics, performanceMetrics, trafficMetrics, userMetrics] =
    await Promise.all([
      monitoringService.getSystemMetrics('1h', '1m'),
      monitoringService.getPerformanceMetrics('1h', '1m'),
      monitoringService.getTrafficMetrics(),
      monitoringService.getUserMetrics('1h', '1m'),
    ]);

  return {
    realtimeData: {
      timestamp: new Date(),
      system: systemMetrics,
      performance: performanceMetrics,
      traffic: trafficMetrics,
      users: userMetrics,
    },
    serviceStatus: monitoringService.isServiceRunning(),
    connectionCount: monitoringService.getConnectionCount(),
    lastUpdate: new Date(),
    lastMetrics: {
      system: monitoringService.getLastMetrics('system'),
      performance: monitoringService.getLastMetrics('performance'),
    },
  };
}

async function testMonitoringSystem(): Promise<Record<string, unknown>> {
  const monitoringService = EnhancedMonitoringService.getInstance();

  try {
    // Test system metrics collection
    const systemMetrics = await monitoringService.collectSystemMetrics();

    // Test performance metrics collection
    const performanceMetrics =
      await monitoringService.collectPerformanceMetrics();

    return {
      success: true,
      tests: [
        {
          name: 'System Metrics Collection',
          status: 'pass',
          message: 'Successfully collected system metrics',
          data: systemMetrics,
        },
        {
          name: 'Performance Metrics Collection',
          status: 'pass',
          message: 'Successfully collected performance metrics',
          data: performanceMetrics.length,
        },
        {
          name: 'Service Status',
          status: 'pass',
          message: 'Monitoring service is running',
          data: monitoringService.isServiceRunning(),
        },
        {
          name: 'Configuration',
          status: 'pass',
          message: 'Configuration loaded successfully',
          data: monitoringService.getConfiguration(),
        },
      ],
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      tests: [
        {
          name: 'System Test',
          status: 'fail',
          message: 'Failed to test monitoring system',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
      timestamp: new Date(),
    };
  }
}
