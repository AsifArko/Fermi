'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, Stack, Button, Box, Flex, Grid, Badge } from '@sanity/ui';
import {
  Activity,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  BarChart3,
  Zap,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Gauge,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

import type {
  SystemMetrics,
  PerformanceMetrics,
  SystemAlert,
} from '../../../lib/monitoring/core/types';

interface DashboardStats {
  uptime: number;
  activeConnections: number;
  totalRequests: number;
  errorRate: number;
  lastUpdate: Date;
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

interface DashboardState {
  metrics: SystemMetrics | null;
  performance: PerformanceMetrics[] | null;
  alerts: SystemAlert[];
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  configOpen: boolean;
  refreshKey: number;
}

export function EnhancedMonitoringDashboard() {
  const [state, setState] = useState<DashboardState>({
    metrics: null,
    performance: null,
    alerts: [],
    stats: null,
    loading: true,
    error: null,
    configOpen: false,
    refreshKey: 0,
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval] = useState(30000); // 30 seconds

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setState(prev => ({ ...prev, refreshKey: prev.refreshKey + 1 }));
    } else {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      const [
        metricsResponse,
        performanceResponse,
        alertsResponse,
        statsResponse,
      ] = await Promise.all([
        fetch('/api/monitoring/enhanced?type=system&range=1h&granularity=5m'),
        fetch(
          '/api/monitoring/enhanced?type=performance&range=1h&granularity=5m'
        ),
        fetch('/api/monitoring/enhanced?type=alerts&range=24h&granularity=1h'),
        fetch('/api/monitoring/enhanced?type=overview&range=1h&granularity=5m'),
      ]);

      if (
        !metricsResponse.ok ||
        !performanceResponse.ok ||
        !alertsResponse.ok ||
        !statsResponse.ok
      ) {
        throw new Error('Failed to fetch monitoring data');
      }

      const [metrics, performance, alerts, stats] = await Promise.all([
        metricsResponse.json(),
        performanceResponse.json(),
        alertsResponse.json(),
        statsResponse.json(),
      ]);

      setState(prev => ({
        ...prev,
        metrics: metrics.data?.[0] || null,
        performance: performance.data || null,
        alerts: alerts.data || [],
        stats: stats.data || null,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  const toggleAutoRefresh = () => setAutoRefresh(!autoRefresh);
  const manualRefresh = () => fetchData(true);

  if (state.loading && !state.metrics) {
    return <DashboardSkeleton />;
  }

  if (state.error && !state.metrics) {
    return (
      <Card padding={6} radius={3} shadow={1} tone='critical'>
        <Stack space={4}>
          <Box style={{ textAlign: 'center' }}>
            <AlertTriangle size={48} />
          </Box>
          <Text size={3} weight='bold' align='center'>
            Failed to Load Dashboard
          </Text>
          <Text size={2} muted align='center'>
            {state.error}
          </Text>
          <Box style={{ textAlign: 'center' }}>
            <Button
              mode='ghost'
              icon={RefreshCw}
              text='Retry'
              onClick={manualRefresh}
            />
          </Box>
        </Stack>
      </Card>
    );
  }

  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        {/* Header */}
        <Card padding={4} radius={3} shadow={1} tone='primary'>
          <Flex align='center' justify='space-between'>
            <Stack space={3}>
              <Text size={3} weight='bold'>
                Enhanced Monitoring Dashboard
              </Text>
              <Text size={1} muted>
                Real-time system health and performance monitoring
              </Text>
              <Flex gap={3} align='center'>
                <Badge tone='primary'>
                  {state.stats?.activeConnections || 0} Active Connections
                </Badge>
                <Badge tone='primary'>
                  {state.stats?.totalRequests || 0} Total Requests
                </Badge>
                <Badge tone='primary'>{state.stats?.uptime || 0}% Uptime</Badge>
              </Flex>
            </Stack>
            <Flex gap={2}>
              <Button
                mode='ghost'
                icon={autoRefresh ? Zap : Clock}
                text={autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
                onClick={toggleAutoRefresh}
                tone={autoRefresh ? 'positive' : 'primary'}
              />
              <Button
                mode='ghost'
                icon={RefreshCw}
                text='Refresh Now'
                onClick={manualRefresh}
                disabled={state.loading}
              />
            </Flex>
          </Flex>
        </Card>

        {/* System Health Overview */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            <Flex align='center' gap={2}>
              <Gauge size={20} />
              <Text size={2} weight='semibold'>
                System Health Overview
              </Text>
            </Flex>

            {state.metrics && (
              <Grid columns={[1, 2, 3, 4]} gap={3}>
                <HealthMetric
                  label='CPU Usage'
                  value={state.metrics.cpu.usage}
                  unit='%'
                  icon={Cpu}
                  tone={getHealthTone(state.metrics.cpu.usage, 80, 90)}
                />
                <HealthMetric
                  label='Memory Usage'
                  value={
                    (state.metrics.memory.used / state.metrics.memory.total) *
                    100
                  }
                  unit='%'
                  icon={MemoryStick}
                  tone={getHealthTone(
                    (state.metrics.memory.used / state.metrics.memory.total) *
                      100,
                    80,
                    90
                  )}
                />
                <HealthMetric
                  label='Disk Usage'
                  value={
                    (state.metrics.disk.used / state.metrics.disk.total) * 100
                  }
                  unit='%'
                  icon={HardDrive}
                  tone={getHealthTone(
                    (state.metrics.disk.used / state.metrics.disk.total) * 100,
                    85,
                    95
                  )}
                />
                <HealthMetric
                  label='Network Status'
                  value={state.metrics.network.connections}
                  unit=' connections'
                  icon={Network}
                  tone='primary'
                />
              </Grid>
            )}
          </Stack>
        </Card>

        {/* Performance Metrics */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            <Flex align='center' gap={2}>
              <TrendingUp size={20} />
              <Text size={2} weight='semibold'>
                Performance Metrics
              </Text>
            </Flex>

            {state.performance && state.performance.length > 0 && (
              <Grid columns={[1, 2]} gap={4}>
                <Stack space={3}>
                  <Text size={1} weight='semibold'>
                    Response Times
                  </Text>
                  <Stack space={2}>
                    {state.performance.slice(0, 5).map((metric, index) => (
                      <PerformanceMetric
                        key={`perf-${metric.url}-${index}`}
                        metric={metric}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Stack space={3}>
                  <Text size={1} weight='semibold'>
                    Performance Summary
                  </Text>
                  <Grid columns={2} gap={3}>
                    <StatCard
                      label='Avg Response Time'
                      value={
                        state.performance.reduce(
                          (sum, m) => sum + m.loadTime,
                          0
                        ) / state.performance.length
                      }
                      unit='ms'
                      icon={Clock}
                    />
                    <StatCard
                      label='Total Requests'
                      value={state.performance.length}
                      unit=''
                      icon={Activity}
                    />
                  </Grid>
                </Stack>
              </Grid>
            )}
          </Stack>
        </Card>

        {/* Real-Time Alerts */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            <Flex align='center' gap={2}>
              <AlertTriangle size={20} />
              <Text size={2} weight='semibold'>
                Real-Time Alerts
              </Text>
            </Flex>

            {state.alerts.length > 0 ? (
              <Stack space={3}>
                {state.alerts.slice(0, 5).map((alert, index) => (
                  <AlertCard key={`alert-${alert.id || index}`} alert={alert} />
                ))}
              </Stack>
            ) : (
              <Box padding={4} style={{ textAlign: 'center' }}>
                <CheckCircle
                  size={32}
                  style={{ color: '#10b981', margin: '0 auto 1rem' }}
                />
                <Text size={2} weight='semibold'>
                  No Active Alerts
                </Text>
                <Text size={1} muted>
                  All systems are running smoothly
                </Text>
              </Box>
            )}
          </Stack>
        </Card>

        {/* System Statistics */}
        {state.stats && (
          <Card padding={4} radius={3} shadow={1}>
            <Stack space={4}>
              <Flex align='center' gap={2}>
                <BarChart3 size={20} />
                <Text size={2} weight='semibold'>
                  System Statistics
                </Text>
              </Flex>

              <Grid columns={[1, 2, 3, 4]} gap={3}>
                <StatCard
                  label='Uptime'
                  value={state.stats.uptime}
                  unit='%'
                  icon={CheckCircle}
                  tone='positive'
                />
                <StatCard
                  label='Active Connections'
                  value={state.stats.activeConnections}
                  unit=''
                  icon={Users}
                  tone='primary'
                />
                <StatCard
                  label='Total Requests'
                  value={state.stats.totalRequests}
                  unit=''
                  icon={Activity}
                  tone='primary'
                />
                <StatCard
                  label='Error Rate'
                  value={state.stats.errorRate}
                  unit='%'
                  icon={AlertTriangle}
                  tone={state.stats.errorRate > 5 ? 'critical' : 'primary'}
                />
              </Grid>
            </Stack>
          </Card>
        )}
      </Stack>
    </Box>
  );
}

// Health Metric Component
interface HealthMetricProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tone: 'positive' | 'caution' | 'critical' | 'primary';
}

function HealthMetric({
  label,
  value,
  unit,
  icon: Icon,
  tone,
}: HealthMetricProps) {
  return (
    <Card padding={3} radius={3} shadow={1} tone={tone}>
      <Stack space={2}>
        <Box style={{ textAlign: 'center' }}>
          <Icon className='w-5 h-5' />
        </Box>
        <Text size={2} weight='bold' align='center'>
          {typeof value === 'number' ? value.toFixed(1) : '0.0'}
          {unit}
        </Text>
        <Text size={1} weight='semibold' align='center'>
          {label}
        </Text>
      </Stack>
    </Card>
  );
}

// Performance Metric Component
interface PerformanceMetricProps {
  metric: PerformanceMetrics;
}

function PerformanceMetric({ metric }: PerformanceMetricProps) {
  return (
    <Card padding={2} radius={2} shadow={1} tone='primary'>
      <Flex align='center' justify='space-between'>
        <Text size={1} weight='semibold'>
          Response Time
        </Text>
        <Text size={1} weight='bold'>
          {typeof metric.loadTime === 'number'
            ? metric.loadTime.toFixed(2)
            : '0.00'}
          ms
        </Text>
      </Flex>
    </Card>
  );
}

// Alert Card Component
interface AlertCardProps {
  alert: SystemAlert;
}

function AlertCard({ alert }: AlertCardProps) {
  const getSeverityTone = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'critical';
      case 'error':
        return 'critical';
      case 'warning':
        return 'caution';
      default:
        return 'primary';
    }
  };

  return (
    <Card
      padding={3}
      radius={3}
      shadow={1}
      tone={getSeverityTone(alert.severity)}
    >
      <Stack space={2}>
        <Flex align='center' justify='space-between'>
          <Text size={1} weight='semibold'>
            {alert.title}
          </Text>
          <Badge tone={getSeverityTone(alert.severity)} size={1}>
            {alert.severity}
          </Badge>
        </Flex>
        <Text size={1}>{alert.message}</Text>
      </Stack>
    </Card>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tone?: 'positive' | 'caution' | 'critical' | 'primary';
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  tone = 'primary',
}: StatCardProps) {
  return (
    <Card padding={3} radius={3} shadow={1} tone={tone}>
      <Stack space={2}>
        <Box style={{ textAlign: 'center' }}>
          <Icon size={20} />
        </Box>
        <Text size={2} weight='bold' align='center'>
          {typeof value === 'number' ? value.toFixed(1) : '0.0'}
          {unit}
        </Text>
        <Text size={1} weight='semibold' align='center'>
          {label}
        </Text>
      </Stack>
    </Card>
  );
}

// Dashboard Skeleton Component
function DashboardSkeleton() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
          <div className='flex gap-3'>
            {[...Array(3)].map((_, i) => (
              <div
                key={`skeleton-stat-${i}`}
                className='h-6 bg-gray-200 rounded w-20'
              ></div>
            ))}
          </div>
        </Card>

        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-1/3 mb-4'></div>
          <div className='grid grid-cols-4 gap-3'>
            {[...Array(4)].map((_, i) => (
              <div
                key={`skeleton-metric-${i}`}
                className='h-20 bg-gray-200 rounded'
              ></div>
            ))}
          </div>
        </Card>

        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-1/3 mb-4'></div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='h-32 bg-gray-200 rounded'></div>
            <div className='h-32 bg-gray-200 rounded'></div>
          </div>
        </Card>

        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-1/3 mb-4'></div>
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <div
                key={`skeleton-alert-${i}`}
                className='h-16 bg-gray-200 rounded'
              ></div>
            ))}
          </div>
        </Card>
      </Stack>
    </Box>
  );
}

// Utility functions
function getHealthTone(
  value: number,
  warningThreshold: number,
  criticalThreshold: number
): 'positive' | 'caution' | 'critical' {
  if (value >= criticalThreshold) return 'critical';
  if (value >= warningThreshold) return 'caution';
  return 'positive';
}

export default EnhancedMonitoringDashboard;
