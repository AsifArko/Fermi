'use client';

import { Box, Card, Stack, Text } from '@sanity/ui';

import React from 'react';

export function MLInsightsDashboard() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              ML Insights Dashboard
            </Text>
            <Text size={2} muted>
              Machine learning powered analytics and predictions
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              ML Features
            </Text>
            <Stack space={2}>
              <Text size={1}>• Predictive Analytics</Text>
              <Text size={1}>• Pattern Recognition</Text>
              <Text size={1}>• Anomaly Detection</Text>
              <Text size={1}>• Smart Recommendations</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default MLInsightsDashboard;
