'use client';

import { Box, Card, Stack, Text } from '@sanity/ui';

import React from 'react';

export function TrafficAnalysisDashboard() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Traffic Analysis Dashboard
            </Text>
            <Text size={2} muted>
              Website traffic and user flow analysis
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Traffic Metrics
            </Text>
            <Stack space={2}>
              <Text size={1}>• Page Views</Text>
              <Text size={1}>• User Sessions</Text>
              <Text size={1}>• Geographic Data</Text>
              <Text size={1}>• Referral Sources</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default TrafficAnalysisDashboard;
