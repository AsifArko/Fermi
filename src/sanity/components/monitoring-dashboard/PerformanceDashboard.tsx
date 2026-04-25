'use client';

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Button, Box, Flex, Grid, Badge } from '@sanity/ui';
import {
  Clock,
  Gauge,
  Activity,
  RefreshCw,
  BarChart3,
  Target,
  AlertTriangle,
} from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  speedIndex: number;
  timeToFirstByte: number;
  domContentLoaded: number;
  windowLoad: number;
  resourceCount: number;
  resourceSize: number;
}

interface PerformanceDashboardProps {
  // Props for future customization
}

export function PerformanceDashboard(_props: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, _setTimeRange] = useState<'1h' | '24h' | '7d'>('1h');

  useEffect(() => {
    fetchPerformanceMetrics();
  }, [timeRange]);

  const fetchPerformanceMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/monitoring/enhanced?type=performance&range=${timeRange}&granularity=5m`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch performance metrics');
      }

      const data = await response.json();
      setMetrics(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchPerformanceMetrics();
  };

  if (loading) {
    return <PerformanceDashboardSkeleton />;
  }

  if (error) {
    return (
      <Card padding={6} radius={3} shadow={1} tone='critical'>
        <Stack space={4}>
          <Box style={{ textAlign: 'center' }}>
            <AlertTriangle size={48} />
          </Box>
          <Text size={3} weight='bold' align='center'>
            Failed to Load Performance Data
          </Text>
          <Text size={2} muted align='center'>
            {error}
          </Text>
          <Box style={{ textAlign: 'center' }}>
            <Button
              mode='ghost'
              icon={RefreshCw}
              text='Retry'
              onClick={refreshData}
            />
          </Box>
        </Stack>
      </Card>
    );
  }

  const latestMetrics = metrics[0] || getDefaultMetrics();
  const averageMetrics = calculateAverageMetrics(metrics);

  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        {/* Header */}
        <Card padding={4} radius={3} shadow={1} tone='primary'>
          <Flex align='center' justify='space-between'>
            <Stack space={3}>
              <Text size={3} weight='bold'>
                Performance Metrics Dashboard
              </Text>
              <Text size={1} muted>
                Core Web Vitals and Performance Analytics
              </Text>
            </Stack>
            <Flex gap={2}>
              <Button
                mode='ghost'
                icon={RefreshCw}
                text='Refresh'
                onClick={refreshData}
                disabled={loading}
              />
            </Flex>
          </Flex>
        </Card>

        {/* Core Web Vitals */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            <Flex align='center' gap={2}>
              <Target size={20} />
              <Text size={2} weight='semibold'>
                Core Web Vitals
              </Text>
            </Flex>
            <Grid columns={[1, 2, 3]} gap={3}>
              <CoreWebVitalCard
                title='Largest Contentful Paint (LCP)'
                value={latestMetrics.largestContentfulPaint}
                unit='ms'
                threshold={2500}
                description='Time to render the largest content element'
              />
              <CoreWebVitalCard
                title='First Input Delay (FID)'
                value={latestMetrics.firstInputDelay}
                unit='ms'
                threshold={100}
                description='Time to first user interaction'
              />
              <CoreWebVitalCard
                title='Cumulative Layout Shift (CLS)'
                value={latestMetrics.cumulativeLayoutShift}
                unit=''
                threshold={0.1}
                description='Visual stability measure'
              />
            </Grid>
          </Stack>
        </Card>

        {/* Performance Metrics Grid */}
        <Grid columns={[1, 2]} gap={4}>
          <Card padding={4} radius={3} shadow={1}>
            <Stack space={4}>
              <Flex align='center' gap={2}>
                <Clock size={20} />
                <Text size={2} weight='semibold'>
                  Load Times
                </Text>
              </Flex>
              <Stack space={3}>
                <MetricRow
                  label='Page Load Time'
                  value={latestMetrics.loadTime}
                  unit='ms'
                  threshold={3000}
                />
                <MetricRow
                  label='Time to First Byte'
                  value={latestMetrics.timeToFirstByte}
                  unit='ms'
                  threshold={600}
                />
                <MetricRow
                  label='DOM Content Loaded'
                  value={latestMetrics.domContentLoaded}
                  unit='ms'
                  threshold={2000}
                />
                <MetricRow
                  label='Window Load'
                  value={latestMetrics.windowLoad}
                  unit='ms'
                  threshold={3000}
                />
              </Stack>
            </Stack>
          </Card>

          <Card padding={4} radius={3} shadow={1}>
            <Stack space={4}>
              <Flex align='center' gap={2}>
                <Activity size={20} />
                <Text size={2} weight='semibold'>
                  Interactive Metrics
                </Text>
              </Flex>
              <Stack space={3}>
                <MetricRow
                  label='Time to Interactive'
                  value={latestMetrics.timeToInteractive}
                  unit='ms'
                  threshold={3500}
                />
                <MetricRow
                  label='Total Blocking Time'
                  value={latestMetrics.totalBlockingTime}
                  unit='ms'
                  threshold={300}
                />
                <MetricRow
                  label='Speed Index'
                  value={latestMetrics.speedIndex}
                  unit='ms'
                  threshold={3400}
                />
                <MetricRow
                  label='First Contentful Paint'
                  value={latestMetrics.firstContentfulPaint}
                  unit='ms'
                  threshold={1800}
                />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Resource Metrics */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            <Flex align='center' gap={2}>
              <BarChart3 size={20} />
              <Text size={2} weight='semibold'>
                Resource Metrics
              </Text>
            </Flex>
            <Grid columns={[1, 2]} gap={4}>
              <Stack space={3}>
                <Text size={1} weight='semibold'>
                  Current Page
                </Text>
                <MetricRow
                  label='Resource Count'
                  value={latestMetrics.resourceCount}
                  unit=''
                  threshold={50}
                />
                <MetricRow
                  label='Resource Size'
                  value={latestMetrics.resourceSize}
                  unit='KB'
                  threshold={2048}
                />
              </Stack>
              <Stack space={3}>
                <Text size={1} weight='semibold'>
                  Average (Last {timeRange})
                </Text>
                <MetricRow
                  label='Avg Load Time'
                  value={averageMetrics.loadTime}
                  unit='ms'
                  threshold={3000}
                />
                <MetricRow
                  label='Avg LCP'
                  value={averageMetrics.largestContentfulPaint}
                  unit='ms'
                  threshold={2500}
                />
              </Stack>
            </Grid>
          </Stack>
        </Card>

        {/* Performance Score */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            <Flex align='center' gap={2}>
              <Gauge size={20} />
              <Text size={2} weight='semibold'>
                Performance Score
              </Text>
            </Flex>
            <PerformanceScore metrics={latestMetrics} />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

// Core Web Vital Card Component
interface CoreWebVitalCardProps {
  title: string;
  value: number;
  unit: string;
  threshold: number;
  description: string;
}

function CoreWebVitalCard({
  title,
  value,
  unit,
  threshold,
  description,
}: CoreWebVitalCardProps) {
  const isGood = value <= threshold;
  const isNeedsImprovement = value > threshold && value <= threshold * 1.5;

  const getTone = () => {
    if (isGood) return 'positive';
    if (isNeedsImprovement) return 'caution';
    return 'critical';
  };

  const getStatus = () => {
    if (isGood) return 'Good';
    if (isNeedsImprovement) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <Card padding={3} radius={3} shadow={1} tone={getTone()}>
      <Stack space={2}>
        <Text size={1} weight='semibold'>
          {title}
        </Text>
        <Text size={3} weight='bold'>
          {typeof value === 'number' ? value.toFixed(2) : '0.00'} {unit}
        </Text>
        <Badge tone={getTone()}>{getStatus()}</Badge>
        <Text size={1} muted>
          {description}
        </Text>
      </Stack>
    </Card>
  );
}

// Metric Row Component
interface MetricRowProps {
  label: string;
  value: number;
  unit: string;
  threshold: number;
}

function MetricRow({ label, value, unit, threshold }: MetricRowProps) {
  const percentage = Math.min((value / threshold) * 100, 100);
  const isGood = value <= threshold;
  const isWarning = value > threshold && value <= threshold * 1.2;

  const getTone = () => {
    if (isGood) return 'positive';
    if (isWarning) return 'caution';
    return 'critical';
  };

  return (
    <Stack space={2}>
      <Flex align='center' justify='space-between'>
        <Text size={1} weight='semibold'>
          {label}
        </Text>
        <Text size={1} weight='bold'>
          {typeof value === 'number' ? value.toFixed(2) : '0.00'} {unit}
        </Text>
      </Flex>
      <Box
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor:
              getTone() === 'positive'
                ? '#10b981'
                : getTone() === 'caution'
                  ? '#f59e0b'
                  : '#ef4444',
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
      <Text size={1} muted>
        Threshold: {threshold} {unit}
      </Text>
    </Stack>
  );
}

// Performance Score Component
interface PerformanceScoreProps {
  metrics: PerformanceMetrics;
}

function PerformanceScore({ metrics }: PerformanceScoreProps) {
  const calculateScore = () => {
    let score = 100;

    // LCP scoring
    if (metrics.largestContentfulPaint > 4000) score -= 20;
    else if (metrics.largestContentfulPaint > 2500) score -= 10;

    // FID scoring
    if (metrics.firstInputDelay > 300) score -= 20;
    else if (metrics.firstInputDelay > 100) score -= 10;

    // CLS scoring
    if (metrics.cumulativeLayoutShift > 0.25) score -= 20;
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 10;

    // Load time scoring
    if (metrics.loadTime > 5000) score -= 15;
    else if (metrics.loadTime > 3000) score -= 7;

    return Math.max(score, 0);
  };

  const score = calculateScore();
  const getScoreColor = () => {
    if (score >= 90) return 'positive';
    if (score >= 70) return 'caution';
    return 'critical';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <Stack space={3}>
      <Box style={{ textAlign: 'center' }}>
        <Text size={1} weight='semibold'>
          Overall Performance Score
        </Text>
      </Box>
      <Box style={{ textAlign: 'center' }}>
        <Box style={{ position: 'relative', width: '120px', height: '120px' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `conic-gradient(${getScoreColor() === 'positive' ? '#10b981' : getScoreColor() === 'caution' ? '#f59e0b' : '#ef4444'} ${score * 3.6}deg, #e5e7eb 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text size={3} weight='bold'>
                {score}
              </Text>
            </div>
          </div>
        </Box>
      </Box>
      <Box style={{ textAlign: 'center' }}>
        <Badge tone={getScoreColor()} size={2}>
          {getScoreLabel()}
        </Badge>
      </Box>
    </Stack>
  );
}

// Dashboard Skeleton Component
function PerformanceDashboardSkeleton() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </Card>

        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-1/3 mb-4'></div>
          <Grid columns={[1, 2, 3]} gap={3}>
            {[...Array(3)].map((_, i) => (
              <div
                key={`perf-skeleton-chart-${i}`}
                className='h-24 bg-gray-200 rounded'
              ></div>
            ))}
          </Grid>
        </Card>

        <Grid columns={[1, 2]} gap={4}>
          {[...Array(2)].map((_, i) => (
            <Card
              key={`perf-skeleton-card-${i}`}
              padding={4}
              radius={3}
              shadow={1}
              className='animate-pulse'
            >
              <div className='h-5 bg-gray-200 rounded w-1/3 mb-4'></div>
              <div className='space-y-3'>
                {[...Array(4)].map((_, j) => (
                  <div
                    key={`perf-skeleton-line-${i}-${j}`}
                    className='h-4 bg-gray-200 rounded w-full'
                  ></div>
                ))}
              </div>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}

// Utility functions
function getDefaultMetrics(): PerformanceMetrics {
  return {
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    timeToInteractive: 0,
    totalBlockingTime: 0,
    speedIndex: 0,
    timeToFirstByte: 0,
    domContentLoaded: 0,
    windowLoad: 0,
    resourceCount: 0,
    resourceSize: 0,
  };
}

export default PerformanceDashboard;

function calculateAverageMetrics(
  metrics: PerformanceMetrics[]
): PerformanceMetrics {
  if (metrics.length === 0) return getDefaultMetrics();

  const sum = metrics.reduce(
    (acc, metric) => ({
      loadTime: acc.loadTime + metric.loadTime,
      firstContentfulPaint:
        acc.firstContentfulPaint + metric.firstContentfulPaint,
      largestContentfulPaint:
        acc.largestContentfulPaint + metric.largestContentfulPaint,
      cumulativeLayoutShift:
        acc.cumulativeLayoutShift + metric.cumulativeLayoutShift,
      firstInputDelay: acc.firstInputDelay + metric.firstInputDelay,
      timeToInteractive: acc.timeToInteractive + metric.timeToInteractive,
      totalBlockingTime: acc.totalBlockingTime + metric.totalBlockingTime,
      speedIndex: acc.speedIndex + metric.speedIndex,
      timeToFirstByte: acc.timeToFirstByte + metric.timeToFirstByte,
      domContentLoaded: acc.domContentLoaded + metric.domContentLoaded,
      windowLoad: acc.windowLoad + metric.windowLoad,
      resourceCount: acc.resourceCount + metric.resourceCount,
      resourceSize: acc.resourceSize + metric.resourceSize,
    }),
    getDefaultMetrics()
  );

  const count = metrics.length;
  return {
    loadTime: sum.loadTime / count,
    firstContentfulPaint: sum.firstContentfulPaint / count,
    largestContentfulPaint: sum.largestContentfulPaint / count,
    cumulativeLayoutShift: sum.cumulativeLayoutShift / count,
    firstInputDelay: sum.firstInputDelay / count,
    timeToInteractive: sum.timeToInteractive / count,
    totalBlockingTime: sum.totalBlockingTime / count,
    speedIndex: sum.speedIndex / count,
    timeToFirstByte: sum.timeToFirstByte / count,
    domContentLoaded: sum.domContentLoaded / count,
    windowLoad: sum.windowLoad / count,
    resourceCount: sum.resourceCount / count,
    resourceSize: sum.resourceSize / count,
  };
}
