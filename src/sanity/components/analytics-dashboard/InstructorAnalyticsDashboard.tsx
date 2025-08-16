'use client';

import { Box, Card, Stack, Text } from '@sanity/ui';

import React from 'react';

export function InstructorAnalyticsDashboard() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Instructor Analytics Dashboard
            </Text>
            <Text size={2} muted>
              Instructor performance and course effectiveness metrics
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Instructor Metrics
            </Text>
            <Stack space={2}>
              <Text size={1}>• Student Satisfaction</Text>
              <Text size={1}>• Course Completion Rates</Text>
              <Text size={1}>• Student Engagement</Text>
              <Text size={1}>• Performance Ratings</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default InstructorAnalyticsDashboard;
