import { Box, Card, Stack, Text } from '@sanity/ui';

import React from 'react';

export function CourseAnalyticsDashboard() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Course Analytics Dashboard
            </Text>
            <Text size={2} muted>
              Course performance and student engagement analysis
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Course Metrics
            </Text>
            <Stack space={2}>
              <Text size={1}>• Enrollment Rates</Text>
              <Text size={1}>• Completion Rates</Text>
              <Text size={1}>• Student Progress</Text>
              <Text size={1}>• Course Ratings</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default CourseAnalyticsDashboard;
