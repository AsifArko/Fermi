import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Button, Box, Flex, Grid } from '@sanity/ui';
import {
  Activity,
  Users,
  Eye,
  AlertTriangle,
  TrendingUp,
  Clock,
  Monitor,
  BarChart3,
  Zap,
} from 'lucide-react';
import { SystemHealth } from './system-health';
import { TrafficOverview } from './traffic-overview';
import { ErrorLogs } from './error-logs';
import { PerformanceMetrics } from './performance-metrics';
import { RealTimeStats } from './real-time-stats';

// Add CSS animations
const dashboardStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .dashboard-container {
    animation: fadeInUp 0.6s ease-out;
  }

  .metric-card {
    transition: all 0.3s ease;
    animation: slideIn 0.4s ease-out;
  }

  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .progress-bar {
    transition: width 0.8s ease-out, background-color 0.3s ease;
  }

  .live-indicator {
    animation: pulse 2s infinite;
  }

  .refresh-button {
    transition: all 0.2s ease;
  }

  .refresh-button:hover {
    transform: scale(1.05);
  }

  .data-value {
    transition: color 0.3s ease;
  }

  .status-badge {
    transition: all 0.2s ease;
  }

  .status-badge:hover {
    transform: scale(1.05);
  }
`;

interface DashboardStats {
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  uptime: number;
  activeUsers: number;
  topErrors: Array<{ message: string; count: number }>;
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

interface TrafficStats {
  totalPageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ url: string; views: number }>;
  topReferrers: Array<{ referrer: string; visits: number }>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  geographicBreakdown: Record<string, number>;
}

export function MonitoringDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [trafficStats, setTrafficStats] = useState<TrafficStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [metadataRefreshKey, setMetadataRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
    setError(null);
  };

  const refreshMetadataOnly = () => {
    setMetadataRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch dashboard stats
        const statsResponse = await fetch('/api/monitoring/stats');
        const stats = await statsResponse.json();

        if (stats.success && stats.data) {
          setDashboardStats({
            totalRequests: stats.data.totalRequests || 0,
            averageResponseTime: stats.data.averageResponseTime || 0,
            errorRate: stats.data.errorRate || 0,
            uptime: stats.data.uptime || 99.9,
            activeUsers: stats.data.activeUsers || 0,
            topErrors: stats.data.topErrors || [],
            systemHealth: {
              cpu: stats.data.systemHealth?.cpu || 0,
              memory: stats.data.systemHealth?.memory || 0,
              disk: stats.data.systemHealth?.disk || 0,
            },
          });
        }

        // Fetch traffic stats
        const trafficResponse = await fetch('/api/monitoring/traffic');
        const traffic = await trafficResponse.json();

        if (traffic.success && traffic.data) {
          setTrafficStats({
            totalPageViews: traffic.data.totalPageViews || 0,
            uniqueVisitors: traffic.data.uniqueVisitors || 0,
            averageSessionDuration: traffic.data.averageSessionDuration || 0,
            bounceRate: traffic.data.bounceRate || 0,
            topPages: traffic.data.topPages || [],
            topReferrers: traffic.data.topReferrers || [],
            deviceBreakdown: traffic.data.deviceBreakdown || {},
            browserBreakdown: traffic.data.browserBreakdown || {},
            geographicBreakdown: traffic.data.geographicBreakdown || {},
          });
        }
      } catch (error) {
        setError('Failed to load monitoring data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-refresh metadata only every 30 seconds
    const interval = setInterval(refreshMetadataOnly, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  // Separate effect for metadata-only refresh
  useEffect(() => {
    const fetchMetadataOnly = async () => {
      try {
        // Fetch only metadata (stats without full data refresh)
        const statsResponse = await fetch('/api/monitoring/stats');
        const stats = await statsResponse.json();
        if (stats.success && stats.data) {
          setDashboardStats(prev => {
            if (!prev) return null;
            return {
              ...prev,
              totalRequests: stats.data.totalRequests || 0,
              averageResponseTime: stats.data.averageResponseTime || 0,
              errorRate: stats.data.errorRate || 0,
              uptime: stats.data.uptime || 99.9,
              activeUsers: stats.data.activeUsers || 0,
              systemHealth: {
                cpu: stats.data.systemHealth?.cpu || 0,
                memory: stats.data.systemHealth?.memory || 0,
                disk: stats.data.systemHealth?.disk || 0,
              },
            };
          });
        }
      } catch (error) {
        // Failed to fetch metadata
      }
    };

    if (metadataRefreshKey > 0) {
      fetchMetadataOnly();
    }
  }, [metadataRefreshKey]);

  if (loading || !dashboardStats) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='flex items-center space-x-3'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
          <span className='text-sm text-muted-foreground'>
            Loading monitoring data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center space-y-4'>
          <div className='text-red-500 text-lg font-semibold'>
            Error Loading Dashboard
          </div>
          <div className='text-gray-600'>{error}</div>
          <Button
            mode='ghost'
            icon={Zap}
            text='Retry'
            onClick={refreshData}
            className='refresh-button'
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{dashboardStyles}</style>
      <Box
        padding={4}
        style={{ maxWidth: '100%', margin: '0 auto' }}
        className='dashboard-container'
      >
        <Stack space={4}>
          {/* Header */}
          <Card
            padding={4}
            radius={3}
            shadow={1}
            tone='primary'
            className='metric-card'
          >
            <Flex align='center' justify='space-between'>
              <Stack space={3}>
                <Text size={3} weight='bold'>
                  System Monitoring Dashboard
                </Text>
                <Text size={1} muted>
                  Real-time system health and traffic analytics
                </Text>
              </Stack>
              <Button
                mode='ghost'
                icon={Zap}
                text='Refresh'
                onClick={refreshData}
                disabled={loading}
                className='refresh-button'
              />
            </Flex>
          </Card>

          {/* Key Metrics */}
          <Grid columns={[1, 2, 4]} gap={3}>
            <Card
              padding={3}
              radius={3}
              shadow={1}
              tone='positive'
              className='metric-card'
            >
              <Stack space={2}>
                <Flex align='center' gap={2}>
                  <Activity size={16} />
                  <Text size={1} weight='semibold'>
                    Uptime
                  </Text>
                </Flex>
                <Text size={3} weight='bold' className='data-value'>
                  {dashboardStats?.uptime !== undefined
                    ? `${dashboardStats.uptime.toFixed(2)}%`
                    : 'N/A'}
                </Text>
              </Stack>
            </Card>

            <Card
              padding={3}
              radius={3}
              shadow={1}
              tone='caution'
              className='metric-card'
            >
              <Stack space={2}>
                <Flex align='center' gap={2}>
                  <Users size={16} />
                  <Text size={1} weight='semibold'>
                    Active Users
                  </Text>
                </Flex>
                <Text size={3} weight='bold' className='data-value'>
                  {dashboardStats?.activeUsers || 0}
                </Text>
              </Stack>
            </Card>

            <Card
              padding={3}
              radius={3}
              shadow={1}
              tone='primary'
              className='metric-card'
            >
              <Stack space={2}>
                <Flex align='center' gap={2}>
                  <Eye size={16} />
                  <Text size={1} weight='semibold'>
                    Total Requests
                  </Text>
                </Flex>
                <Text size={3} weight='bold' className='data-value'>
                  {typeof dashboardStats?.totalRequests === 'number'
                    ? dashboardStats.totalRequests.toLocaleString()
                    : '0'}
                </Text>
              </Stack>
            </Card>

            <Card
              padding={3}
              radius={3}
              shadow={1}
              tone='critical'
              className='metric-card'
            >
              <Stack space={2}>
                <Flex align='center' gap={2}>
                  <AlertTriangle size={16} />
                  <Text size={1} weight='semibold'>
                    Error Rate
                  </Text>
                </Flex>
                <Text size={3} weight='bold' className='data-value'>
                  {dashboardStats?.errorRate !== undefined
                    ? `${dashboardStats.errorRate.toFixed(2)}%`
                    : '0%'}
                </Text>
              </Stack>
            </Card>
          </Grid>

          {/* Main Content Grid */}
          <Grid columns={[1, 2]} gap={4}>
            {/* System Health */}
            <Card padding={4} radius={3} shadow={1} className='metric-card'>
              <Stack space={4}>
                <Flex align='center' gap={2}>
                  <Monitor size={20} />
                  <Text size={2} weight='semibold'>
                    System Health
                  </Text>
                </Flex>
                <SystemHealth
                  cpu={dashboardStats?.systemHealth?.cpu || 0}
                  memory={dashboardStats?.systemHealth?.memory || 0}
                  disk={dashboardStats?.systemHealth?.disk || 0}
                />
              </Stack>
            </Card>

            {/* Real-time Stats */}
            <Card padding={4} radius={3} shadow={1} className='metric-card'>
              <Stack space={4}>
                <Flex align='center' gap={2}>
                  <Clock size={20} />
                  <Text size={2} weight='semibold'>
                    Real-time Activity
                  </Text>
                </Flex>
                <RealTimeStats />
              </Stack>
            </Card>
          </Grid>

          {/* Traffic Overview */}
          <Card padding={4} radius={3} shadow={1} className='metric-card'>
            <Stack space={4}>
              <Flex align='center' gap={2}>
                <BarChart3 size={20} />
                <Text size={2} weight='semibold'>
                  Traffic Overview
                </Text>
              </Flex>
              <TrafficOverview
                stats={
                  trafficStats || {
                    totalPageViews: 0,
                    uniqueVisitors: 0,
                    averageSessionDuration: 0,
                    bounceRate: 0,
                    topPages: [],
                    topReferrers: [],
                    deviceBreakdown: {},
                    browserBreakdown: {},
                    geographicBreakdown: {},
                  }
                }
              />
            </Stack>
          </Card>

          {/* Performance Metrics */}
          <Card padding={4} radius={3} shadow={1} className='metric-card'>
            <Stack space={4}>
              <Flex align='center' gap={2}>
                <TrendingUp size={20} />
                <Text size={2} weight='semibold'>
                  Performance Metrics
                </Text>
              </Flex>
              <PerformanceMetrics />
            </Stack>
          </Card>

          {/* Error Logs */}
          <Card padding={4} radius={3} shadow={1} className='metric-card'>
            <Stack space={4}>
              <Flex align='center' gap={2}>
                <AlertTriangle size={20} />
                <Text size={2} weight='semibold'>
                  Recent Errors
                </Text>
              </Flex>
              <ErrorLogs errors={dashboardStats?.topErrors || []} />
            </Stack>
          </Card>
        </Stack>
      </Box>
    </>
  );
}
