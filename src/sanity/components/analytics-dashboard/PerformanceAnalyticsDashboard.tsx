'use client';

import { Box, Card, Stack, Text } from '@sanity/ui';

import React from 'react';

export function PerformanceAnalyticsDashboard() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Performance Analytics Dashboard
            </Text>
            <Text size={2} muted>
              System and application performance metrics
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Performance Metrics
            </Text>
            <Stack space={2}>
              <Text size={1}>• Response Times</Text>
              <Text size={1}>• Throughput</Text>
              <Text size={1}>• Error Rates</Text>
              <Text size={1}>• Resource Usage</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default PerformanceAnalyticsDashboard;
