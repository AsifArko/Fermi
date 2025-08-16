import React from 'react';
import { Card, Text, Stack, Flex, Grid } from '@sanity/ui';
import {
  Eye,
  Users,
  Clock,
  TrendingDown,
  Globe,
  Monitor,
  Smartphone,
} from 'lucide-react';

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

interface TrafficOverviewProps {
  stats: TrafficStats | null;
}

export function TrafficOverview({ stats }: TrafficOverviewProps) {
  if (!stats) {
    return (
      <Card padding={3} radius={3} shadow={1}>
        <Text size={1} muted>
          No traffic data available
        </Text>
      </Card>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'desktop':
        return <Monitor size={14} />;
      case 'mobile':
        return <Smartphone size={14} />;
      case 'tablet':
        return <Monitor size={14} />;
      default:
        return <Globe size={14} />;
    }
  };

  const formatPageUrl = (url: string) => {
    // Remove leading slash and format for display
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    if (cleanUrl === '') return 'Home';
    return cleanUrl
      .split('/')
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' / ');
  };

  return (
    <Stack space={4}>
      {/* Key Metrics */}
      <Grid columns={[2, 4]} gap={3}>
        <Card padding={3} radius={3} shadow={1} tone='primary'>
          <Stack space={2}>
            <Flex align='center' gap={2}>
              <Eye size={16} />
              <Text size={1} weight='semibold'>
                Page Views
              </Text>
            </Flex>
            <Text size={2} weight='bold'>
              {stats.totalPageViews.toLocaleString()}
            </Text>
          </Stack>
        </Card>

        <Card padding={3} radius={3} shadow={1} tone='caution'>
          <Stack space={2}>
            <Flex align='center' gap={2}>
              <Users size={16} />
              <Text size={1} weight='semibold'>
                Unique Visitors
              </Text>
            </Flex>
            <Text size={2} weight='bold'>
              {stats.uniqueVisitors.toLocaleString()}
            </Text>
          </Stack>
        </Card>

        <Card padding={3} radius={3} shadow={1} tone='positive'>
          <Stack space={2}>
            <Flex align='center' gap={2}>
              <Clock size={16} />
              <Text size={1} weight='semibold'>
                Avg Session
              </Text>
            </Flex>
            <Text size={2} weight='bold'>
              {formatDuration(stats.averageSessionDuration)}
            </Text>
          </Stack>
        </Card>

        <Card padding={3} radius={3} shadow={1} tone='critical'>
          <Stack space={2}>
            <Flex align='center' gap={2}>
              <TrendingDown size={16} />
              <Text size={1} weight='semibold'>
                Bounce Rate
              </Text>
            </Flex>
            <Text size={2} weight='bold'>
              {typeof stats.bounceRate === 'number'
                ? stats.bounceRate.toFixed(1)
                : '0.0'}
              %
            </Text>
          </Stack>
        </Card>
      </Grid>

      {/* Top Pages - New Clean Design */}
      <Card padding={4} radius={3} shadow={1}>
        <Stack space={4}>
          <Text size={1} weight='semibold'>
            Top Pages
          </Text>
          <Stack space={3}>
            {Array.isArray(stats.topPages) ? (
              stats.topPages.slice(0, 5).map((page, index) => (
                <div
                  key={`page-${page.url ? page.url.substring(0, 20) : 'unknown'}-${index}`}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Flex align='center' justify='space-between'>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        size={1}
                        style={{
                          color: '#1e293b',
                          fontWeight: '600',
                          lineHeight: '1.4',
                          wordBreak: 'break-word',
                        }}
                      >
                        {page.url ? formatPageUrl(page.url) : 'Unknown URL'}
                      </Text>
                    </div>
                    <div style={{ marginLeft: '16px', flexShrink: 0 }}>
                      <Text
                        size={1}
                        weight='bold'
                        style={{
                          color: '#059669',
                        }}
                      >
                        {typeof page.views === 'number'
                          ? page.views.toLocaleString()
                          : '0'}
                      </Text>
                    </div>
                  </Flex>
                </div>
              ))
            ) : (
              <Text
                size={1}
                muted
                style={{ textAlign: 'center', padding: '20px' }}
              >
                No page view data available
              </Text>
            )}
          </Stack>
        </Stack>
      </Card>

      {/* Device Breakdown */}
      <Card padding={4} radius={3} shadow={1}>
        <Stack space={3}>
          <Text size={1} weight='semibold'>
            Device Breakdown
          </Text>
          <Stack space={2}>
            {stats.deviceBreakdown &&
            typeof stats.deviceBreakdown === 'object' ? (
              Object.entries(stats.deviceBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([device, count]) => (
                  <Flex
                    key={device}
                    align='center'
                    justify='space-between'
                    padding={3}
                    style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <Flex align='center' gap={2}>
                      {device ? getDeviceIcon(device) : null}
                      <Text
                        size={1}
                        style={{
                          textTransform: 'capitalize',
                          color: '#374151',
                        }}
                      >
                        {device || 'Unknown Device'}
                      </Text>
                    </Flex>
                    <Text size={1} weight='bold' style={{ color: '#059669' }}>
                      {typeof count === 'number' ? count.toLocaleString() : '0'}
                    </Text>
                  </Flex>
                ))
            ) : (
              <Text
                size={1}
                muted
                style={{ textAlign: 'center', padding: '20px' }}
              >
                No device data available
              </Text>
            )}
          </Stack>
        </Stack>
      </Card>

      {/* Geographic Breakdown */}
      <Card padding={4} radius={3} shadow={1}>
        <Stack space={3}>
          <Text size={1} weight='semibold'>
            Top Countries
          </Text>
          <Stack space={2}>
            {stats.geographicBreakdown &&
            typeof stats.geographicBreakdown === 'object' ? (
              Object.entries(stats.geographicBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([country, count]) => (
                  <Flex
                    key={country}
                    align='center'
                    justify='space-between'
                    padding={3}
                    style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <Flex align='center' gap={2}>
                      <Globe size={14} />
                      <Text size={1} style={{ color: '#374151' }}>
                        {country || 'Unknown Country'}
                      </Text>
                    </Flex>
                    <Text size={1} weight='bold' style={{ color: '#059669' }}>
                      {typeof count === 'number' ? count.toLocaleString() : '0'}
                    </Text>
                  </Flex>
                ))
            ) : (
              <Text
                size={1}
                muted
                style={{ textAlign: 'center', padding: '20px' }}
              >
                No geographic data available
              </Text>
            )}
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
