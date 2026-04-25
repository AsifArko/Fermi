import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Box, Flex, Grid } from '@sanity/ui';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Users,
  Eye,
  AlertTriangle,
  TrendingUp,
  Clock,
  Monitor,
  BarChart3,
  RefreshCw,
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
    animation: slideIn 0.4s ease-out;
  }

  .progress-bar {
    transition: width 0.8s ease-out, background-color 0.3s ease;
  }

  .data-value {
    transition: color 0.3s ease;
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
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [metadataRefreshKey, setMetadataRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
    setError(null);
    setRefreshing(true);
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

        setLastRefreshTime(new Date());
      } catch (error) {
        setError('Failed to load monitoring data. Please try again later.');
      } finally {
        setLoading(false);
        setRefreshing(false);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  if (loading || !dashboardStats) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='flex items-center space-x-3'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400'></div>
          <span className='text-sm text-gray-600'>
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
            onClick={refreshData}
            className='flex items-center justify-center gap-2 px-4 py-2'
          >
            <RefreshCw className='h-4 w-4' />
            <span>Retry</span>
          </Button>
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
            radius={2}
            tone='default'
            className='metric-card'
            style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
          >
            <Flex align='center' justify='space-between'>
              <Stack space={3}>
                <Text size={3} weight='bold' style={{ color: '#1e293b' }}>
                  System Monitoring Dashboard
                </Text>
                <Text size={1} style={{ color: '#64748b' }}>
                  Real-time system health and traffic analytics
                </Text>
                {lastRefreshTime && (
                  <Text size={0} style={{ color: '#94a3b8' }}>
                    Last updated: {formatTime(lastRefreshTime)}
                  </Text>
                )}
              </Stack>
              <Button
                onClick={refreshData}
                disabled={refreshing}
                className='flex items-center justify-center gap-2 px-4 py-2'
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-300'}`}
                />
                <span>Refresh</span>
              </Button>
            </Flex>
          </Card>

          {/* Key Metrics */}
          <Grid columns={[1, 2, 4]} gap={3}>
            <Card
              padding={3}
              radius={2}
              tone='default'
              className='metric-card'
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <Stack space={2}>
                <Flex align='center' gap={2}>
                  <Activity size={16} style={{ color: '#64748b' }} />
                  <Text size={1} weight='semibold' style={{ color: '#475569' }}>
                    Uptime
                  </Text>
                </Flex>
                <Text
                  size={3}
                  weight='bold'
                  className='data-value'
                  style={{ color: '#1e293b' }}
                >
                  {dashboardStats?.uptime !== undefined
                    ? `${dashboardStats.uptime.toFixed(2)}%`
                    : 'N/A'}
                </Text>
              </Stack>
            </Card>

            <Card
              padding={3}
              radius={2}
              tone='default'
              className='metric-card'
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <Stack space={2}>
                <Flex align='center' gap={2}>
                  <Users size={16} style={{ color: '#64748b' }} />
                  <Text size={1} weight='semibold' style={{ color: '#475569' }}>
                    Active Users
                  </Text>
                </Flex>
                <Text
                  size={3}
                  weight='bold'
                  className='data-value'
                  style={{ color: '#1e293b' }}
                >
                  {dashboardStats?.activeUsers || 0}
                </Text>
              </Stack>
            </Card>

            <Card
              padding={3}
              radius={2}
              tone='default'
              className='metric-card'
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <Stack space={2}>
                <Flex align='center' gap={2}>
                  <Eye size={16} style={{ color: '#64748b' }} />
                  <Text size={1} weight='semibold' style={{ color: '#475569' }}>
                    Total Requests
                  </Text>
                </Flex>
                <Text
                  size={3}
                  weight='bold'
                  className='data-value'
                  style={{ color: '#1e293b' }}
                >
                  {typeof dashboardStats?.totalRequests === 'number'
                    ? dashboardStats.totalRequests.toLocaleString()
                    : '0'}
                </Text>
              </Stack>
            </Card>

            <Card
              padding={3}
              radius={2}
              tone='default'
              className='metric-card'
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <Stack space={2}>
                <Flex align='center' gap={2}>
                  <AlertTriangle size={16} style={{ color: '#64748b' }} />
                  <Text size={1} weight='semibold' style={{ color: '#475569' }}>
                    Error Rate
                  </Text>
                </Flex>
                <Text
                  size={3}
                  weight='bold'
                  className='data-value'
                  style={{ color: '#1e293b' }}
                >
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
            <Card
              padding={4}
              radius={2}
              className='metric-card'
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <Stack space={4}>
                <Flex align='center' gap={2}>
                  <Monitor size={20} style={{ color: '#64748b' }} />
                  <Text size={2} weight='semibold' style={{ color: '#475569' }}>
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
            <Card
              padding={4}
              radius={2}
              className='metric-card'
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <Stack space={4}>
                <Flex align='center' gap={2}>
                  <Clock size={20} style={{ color: '#64748b' }} />
                  <Text size={2} weight='semibold' style={{ color: '#475569' }}>
                    Real-time Activity
                  </Text>
                </Flex>
                <RealTimeStats />
              </Stack>
            </Card>
          </Grid>

          {/* Traffic Overview */}
          <Card
            padding={4}
            radius={2}
            className='metric-card'
            style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
          >
            <Stack space={4}>
              <Flex align='center' gap={2}>
                <BarChart3 size={20} style={{ color: '#64748b' }} />
                <Text size={2} weight='semibold' style={{ color: '#475569' }}>
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
          <Card
            padding={4}
            radius={2}
            className='metric-card'
            style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
          >
            <Stack space={4}>
              <Flex align='center' gap={2}>
                <TrendingUp size={20} style={{ color: '#64748b' }} />
                <Text size={2} weight='semibold' style={{ color: '#475569' }}>
                  Performance Metrics
                </Text>
              </Flex>
              <PerformanceMetrics />
            </Stack>
          </Card>

          {/* Error Logs */}
          <Card
            padding={4}
            radius={2}
            className='metric-card'
            style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
          >
            <Stack space={4}>
              <Flex align='center' gap={2}>
                <AlertTriangle size={20} style={{ color: '#64748b' }} />
                <Text size={2} weight='semibold' style={{ color: '#475569' }}>
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
