import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Flex, Badge } from '@sanity/ui';
import { Users, Eye, Zap, TrendingUp } from 'lucide-react';

interface RealTimeData {
  activeUsers: number;
  recentPageViews: number;
  recentEvents: number;
}

export function RealTimeStats() {
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch('/api/monitoring/realtime');
        const data = await response.json();
        setRealTimeData(data);
      } catch (error) {
        // Failed to fetch real-time data
      } finally {
        setLoading(false);
      }
    };

    fetchRealTimeData();

    // Update every 10 seconds for real-time feel
    const interval = setInterval(fetchRealTimeData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card padding={3} radius={3} shadow={1}>
        <Text size={1} muted>
          Loading real-time data...
        </Text>
      </Card>
    );
  }

  if (!realTimeData) {
    return (
      <Card padding={3} radius={3} shadow={1}>
        <Text size={1} muted>
          No real-time data available
        </Text>
      </Card>
    );
  }

  const getActivityLevel = (users: number) => {
    if (users > 50) return { level: 'High', tone: 'positive' };
    if (users > 20) return { level: 'Medium', tone: 'caution' };
    return { level: 'Low', tone: 'primary' };
  };

  return (
    <Stack space={3}>
      {/* Active Users */}
      <Card padding={4} radius={3} shadow={1} tone='primary'>
        <Stack space={3}>
          <Flex align='center' gap={2}>
            <Users size={16} />
            <Text size={1} weight='semibold'>
              Active Users
            </Text>
          </Flex>
          <Flex align='center' justify='space-between'>
            <Text size={3} weight='bold' style={{ color: '#3b82f6' }}>
              {realTimeData.activeUsers}
            </Text>
            <Badge
              tone={
                getActivityLevel(realTimeData.activeUsers).tone as
                  | 'positive'
                  | 'caution'
                  | 'critical'
              }
              radius={2}
              className='status-badge'
            >
              {getActivityLevel(realTimeData.activeUsers).level}
            </Badge>
          </Flex>
          <Text size={0} muted style={{ textAlign: 'center' }}>
            Last 5 minutes
          </Text>
        </Stack>
      </Card>

      {/* Recent Activity */}
      <Card padding={4} radius={3} shadow={1}>
        <Stack space={3}>
          <Flex align='center' gap={2}>
            <Zap size={16} />
            <Text size={1} weight='semibold'>
              Recent Activity
            </Text>
          </Flex>

          <Stack space={3}>
            <Flex align='center' justify='space-between' padding={2}>
              <Flex align='center' gap={2}>
                <Eye size={14} />
                <Text size={1} style={{ color: '#374151' }}>
                  Page Views
                </Text>
              </Flex>
              <Text size={1} weight='bold' style={{ color: '#059669' }}>
                {realTimeData.recentPageViews}
              </Text>
            </Flex>

            <Flex align='center' justify='space-between' padding={2}>
              <Flex align='center' gap={2}>
                <TrendingUp size={14} />
                <Text size={1} style={{ color: '#374151' }}>
                  User Events
                </Text>
              </Flex>
              <Text size={1} weight='bold' style={{ color: '#059669' }}>
                {realTimeData.recentEvents}
              </Text>
            </Flex>
          </Stack>

          <Text size={0} muted style={{ textAlign: 'center' }}>
            Last 5 minutes
          </Text>
        </Stack>
      </Card>

      {/* Live Indicator */}
      <Card padding={3} radius={3} shadow={1} tone='positive'>
        <Flex align='center' gap={2} justify='center'>
          <div
            className='live-indicator'
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
            }}
          />
          <Text size={0} weight='semibold' style={{ color: '#059669' }}>
            Live Data
          </Text>
        </Flex>
      </Card>
    </Stack>
  );
}
