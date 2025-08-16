'use client';

import { Box, Card, Stack, Text } from '@sanity/ui';

import React from 'react';

export function StudentAnalyticsDashboard() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Student Analytics Dashboard
            </Text>
            <Text size={2} muted>
              Student behavior and learning analytics
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Student Metrics
            </Text>
            <Stack space={2}>
              <Text size={1}>• Learning Progress</Text>
              <Text size={1}>• Engagement Levels</Text>
              <Text size={1}>• Study Patterns</Text>
              <Text size={1}>• Achievement Rates</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default StudentAnalyticsDashboard;
