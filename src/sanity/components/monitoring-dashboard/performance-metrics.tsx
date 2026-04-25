import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Flex, Badge } from '@sanity/ui';
import { TrendingUp, Clock } from 'lucide-react';

interface PerformanceData {
  averageLoadTime: number;
  averageFCP: number;
  averageLCP: number;
  averageCLS: number;
  averageFID: number;
}

export function PerformanceMetrics() {
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch('/api/monitoring/performance-metrics');
        const data = await response.json();
        if (data.success && data.data) {
          setPerformanceData({
            averageLoadTime:
              typeof data.data.averageLoadTime === 'number'
                ? data.data.averageLoadTime
                : 0,
            averageFCP:
              typeof data.data.averageFCP === 'number'
                ? data.data.averageFCP
                : 0,
            averageLCP:
              typeof data.data.averageLCP === 'number'
                ? data.data.averageLCP
                : 0,
            averageCLS:
              typeof data.data.averageCLS === 'number'
                ? data.data.averageCLS
                : 0,
            averageFID:
              typeof data.data.averageFID === 'number'
                ? data.data.averageFID
                : 0,
          });
        } else {
          // Set default values if API doesn't return expected data
          setPerformanceData({
            averageLoadTime: 0,
            averageFCP: 0,
            averageLCP: 0,
            averageCLS: 0,
            averageFID: 0,
          });
        }
      } catch (error) {
        // Set default values on error
        setPerformanceData({
          averageLoadTime: 0,
          averageFCP: 0,
          averageLCP: 0,
          averageCLS: 0,
          averageFID: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (loading) {
    return (
      <Card padding={3} radius={3} shadow={1}>
        <Text size={1} muted>
          Loading performance data...
        </Text>
      </Card>
    );
  }

  if (!performanceData) {
    return (
      <Card padding={3} radius={3} shadow={1}>
        <Text size={1} muted>
          No performance data available
        </Text>
      </Card>
    );
  }

  const getPerformanceScore = (metric: string, value: number) => {
    switch (metric) {
      case 'loadTime':
        if (value < 1000) return { score: 'Good', tone: 'positive' };
        if (value < 3000)
          return { score: 'Needs Improvement', tone: 'caution' };
        return { score: 'Poor', tone: 'critical' };
      case 'fcp':
        if (value < 1800) return { score: 'Good', tone: 'positive' };
        if (value < 3000)
          return { score: 'Needs Improvement', tone: 'caution' };
        return { score: 'Poor', tone: 'critical' };
      case 'lcp':
        if (value < 2500) return { score: 'Good', tone: 'positive' };
        if (value < 4000)
          return { score: 'Needs Improvement', tone: 'caution' };
        return { score: 'Poor', tone: 'critical' };
      case 'cls':
        if (value < 0.1) return { score: 'Good', tone: 'positive' };
        if (value < 0.25)
          return { score: 'Needs Improvement', tone: 'caution' };
        return { score: 'Poor', tone: 'critical' };
      case 'fid':
        if (value < 100) return { score: 'Good', tone: 'positive' };
        if (value < 300) return { score: 'Needs Improvement', tone: 'caution' };
        return { score: 'Poor', tone: 'critical' };
      default:
        return { score: 'Unknown', tone: 'primary' };
    }
  };

  const getProgressValue = (metric: string, value: number) => {
    switch (metric) {
      case 'loadTime':
        return Math.min(value / 5000, 1); // Max 5 seconds
      case 'fcp':
        return Math.min(value / 3000, 1); // Max 3 seconds
      case 'lcp':
        return Math.min(value / 4000, 1); // Max 4 seconds
      case 'cls':
        return Math.min(value / 0.5, 1); // Max 0.5
      case 'fid':
        return Math.min(value / 500, 1); // Max 500ms
      default:
        return 0;
    }
  };

  const getProgressColor = (tone: string) => {
    switch (tone) {
      case 'positive':
        return 'rgba(16, 185, 129, 0.8)'; // Less intense green with transparency
      case 'caution':
        return 'rgba(245, 158, 11, 0.8)'; // Less intense orange with transparency
      case 'critical':
        return 'rgba(239, 68, 68, 0.8)'; // Less intense red with transparency
      default:
        return 'rgba(107, 114, 128, 0.8)'; // Less intense gray with transparency
    }
  };

  return (
    <Stack space={4}>
      {/* Core Web Vitals */}
      <Card padding={4} radius={3} shadow={1}>
        <Stack space={3}>
          <Flex align='center' gap={2}>
            <TrendingUp size={16} />
            <Text size={1} weight='semibold'>
              Core Web Vitals
            </Text>
          </Flex>

          {/* Largest Contentful Paint */}
          <Stack space={3}>
            <Flex align='center' justify='space-between' padding={2}>
              <Text size={1} style={{ color: '#374151' }}>
                Largest Contentful Paint
              </Text>
              <Flex align='center' gap={2}>
                <Text size={1} weight='bold' style={{ color: '#059669' }}>
                  {typeof performanceData.averageLCP === 'number'
                    ? performanceData.averageLCP.toFixed(0)
                    : '0'}
                  ms
                </Text>
                <Badge
                  tone={
                    getPerformanceScore(
                      'lcp',
                      typeof performanceData.averageLCP === 'number'
                        ? performanceData.averageLCP
                        : 0
                    ).tone as 'positive' | 'caution' | 'critical'
                  }
                  radius={2}
                  className='status-badge'
                >
                  {
                    getPerformanceScore(
                      'lcp',
                      typeof performanceData.averageLCP === 'number'
                        ? performanceData.averageLCP
                        : 0
                    ).score
                  }
                </Badge>
              </Flex>
            </Flex>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#f3f4f6',
                borderRadius: '3px',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                className='progress-bar'
                style={{
                  width: `${getProgressValue('lcp', typeof performanceData.averageLCP === 'number' ? performanceData.averageLCP : 0) * 100}%`,
                  height: '100%',
                  backgroundColor: getProgressColor(
                    getPerformanceScore(
                      'lcp',
                      typeof performanceData.averageLCP === 'number'
                        ? performanceData.averageLCP
                        : 0
                    ).tone
                  ),
                  borderRadius: '3px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
          </Stack>

          {/* First Input Delay */}
          <Stack space={3}>
            <Flex align='center' justify='space-between' padding={2}>
              <Text size={1} style={{ color: '#374151' }}>
                First Input Delay
              </Text>
              <Flex align='center' gap={2}>
                <Text size={1} weight='bold' style={{ color: '#059669' }}>
                  {typeof performanceData.averageFID === 'number'
                    ? performanceData.averageFID.toFixed(0)
                    : '0'}
                  ms
                </Text>
                <Badge
                  tone={
                    getPerformanceScore(
                      'fid',
                      typeof performanceData.averageFID === 'number'
                        ? performanceData.averageFID
                        : 0
                    ).tone as 'positive' | 'caution' | 'critical'
                  }
                  radius={2}
                  className='status-badge'
                >
                  {
                    getPerformanceScore(
                      'fid',
                      typeof performanceData.averageFID === 'number'
                        ? performanceData.averageFID
                        : 0
                    ).score
                  }
                </Badge>
              </Flex>
            </Flex>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#f3f4f6',
                borderRadius: '3px',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                className='progress-bar'
                style={{
                  width: `${getProgressValue('fid', typeof performanceData.averageFID === 'number' ? performanceData.averageFID : 0) * 100}%`,
                  height: '100%',
                  backgroundColor: getProgressColor(
                    getPerformanceScore(
                      'fid',
                      typeof performanceData.averageFID === 'number'
                        ? performanceData.averageFID
                        : 0
                    ).tone
                  ),
                  borderRadius: '3px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
          </Stack>

          {/* Cumulative Layout Shift */}
          <Stack space={3}>
            <Flex align='center' justify='space-between' padding={2}>
              <Text size={1} style={{ color: '#374151' }}>
                Cumulative Layout Shift
              </Text>
              <Flex align='center' gap={2}>
                <Text size={1} weight='bold' style={{ color: '#059669' }}>
                  {typeof performanceData.averageCLS === 'number'
                    ? performanceData.averageCLS.toFixed(3)
                    : '0.000'}
                </Text>
                <Badge
                  tone={
                    getPerformanceScore(
                      'cls',
                      typeof performanceData.averageCLS === 'number'
                        ? performanceData.averageCLS
                        : 0
                    ).tone as 'positive' | 'caution' | 'critical'
                  }
                  radius={2}
                  className='status-badge'
                >
                  {
                    getPerformanceScore(
                      'cls',
                      typeof performanceData.averageCLS === 'number'
                        ? performanceData.averageCLS
                        : 0
                    ).score
                  }
                </Badge>
              </Flex>
            </Flex>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#f3f4f6',
                borderRadius: '3px',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                className='progress-bar'
                style={{
                  width: `${getProgressValue('cls', typeof performanceData.averageCLS === 'number' ? performanceData.averageCLS : 0) * 100}%`,
                  height: '100%',
                  backgroundColor: getProgressColor(
                    getPerformanceScore(
                      'cls',
                      typeof performanceData.averageCLS === 'number'
                        ? performanceData.averageCLS
                        : 0
                    ).tone
                  ),
                  borderRadius: '3px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
          </Stack>
        </Stack>
      </Card>

      {/* Additional Metrics */}
      <Card padding={4} radius={3} shadow={1}>
        <Stack space={3}>
          <Flex align='center' gap={2}>
            <Clock size={16} />
            <Text size={1} weight='semibold'>
              Additional Metrics
            </Text>
          </Flex>

          {/* Load Time */}
          <Stack space={3}>
            <Flex align='center' justify='space-between' padding={2}>
              <Text size={1} style={{ color: '#374151' }}>
                Page Load Time
              </Text>
              <Flex align='center' gap={2}>
                <Text size={1} weight='bold' style={{ color: '#059669' }}>
                  {typeof performanceData.averageLoadTime === 'number'
                    ? performanceData.averageLoadTime.toFixed(0)
                    : '0'}
                  ms
                </Text>
                <Badge
                  tone={
                    getPerformanceScore(
                      'loadTime',
                      typeof performanceData.averageLoadTime === 'number'
                        ? performanceData.averageLoadTime
                        : 0
                    ).tone as 'positive' | 'caution' | 'critical'
                  }
                  radius={2}
                  className='status-badge'
                >
                  {
                    getPerformanceScore(
                      'loadTime',
                      typeof performanceData.averageLoadTime === 'number'
                        ? performanceData.averageLoadTime
                        : 0
                    ).score
                  }
                </Badge>
              </Flex>
            </Flex>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#f3f4f6',
                borderRadius: '3px',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                className='progress-bar'
                style={{
                  width: `${
                    getProgressValue(
                      'loadTime',
                      typeof performanceData.averageLoadTime === 'number'
                        ? performanceData.averageLoadTime
                        : 0
                    ) * 100
                  }%`,
                  height: '100%',
                  backgroundColor: getProgressColor(
                    getPerformanceScore(
                      'loadTime',
                      typeof performanceData.averageLoadTime === 'number'
                        ? performanceData.averageLoadTime
                        : 0
                    ).tone
                  ),
                  borderRadius: '3px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
          </Stack>

          {/* First Contentful Paint */}
          <Stack space={3}>
            <Flex align='center' justify='space-between' padding={2}>
              <Text size={1} style={{ color: '#374151' }}>
                First Contentful Paint
              </Text>
              <Flex align='center' gap={2}>
                <Text size={1} weight='bold' style={{ color: '#059669' }}>
                  {typeof performanceData.averageFCP === 'number'
                    ? performanceData.averageFCP.toFixed(0)
                    : '0'}
                  ms
                </Text>
                <Badge
                  tone={
                    getPerformanceScore(
                      'fcp',
                      typeof performanceData.averageFCP === 'number'
                        ? performanceData.averageFCP
                        : 0
                    ).tone as 'positive' | 'caution' | 'critical'
                  }
                  radius={2}
                  className='status-badge'
                >
                  {
                    getPerformanceScore(
                      'fcp',
                      typeof performanceData.averageFCP === 'number'
                        ? performanceData.averageFCP
                        : 0
                    ).score
                  }
                </Badge>
              </Flex>
            </Flex>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#f3f4f6',
                borderRadius: '3px',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                className='progress-bar'
                style={{
                  width: `${getProgressValue('fcp', typeof performanceData.averageFCP === 'number' ? performanceData.averageFCP : 0) * 100}%`,
                  height: '100%',
                  backgroundColor: getProgressColor(
                    getPerformanceScore(
                      'fcp',
                      typeof performanceData.averageFCP === 'number'
                        ? performanceData.averageFCP
                        : 0
                    ).tone
                  ),
                  borderRadius: '3px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
