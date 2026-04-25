import { Box, Card, Stack, Text } from '@sanity/ui';

import React from 'react';

export function ConversionAnalyticsDashboard() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Conversion Analytics Dashboard
            </Text>
            <Text size={2} muted>
              Conversion funnel and optimization analysis
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Conversion Metrics
            </Text>
            <Stack space={2}>
              <Text size={1}>• Funnel Analysis</Text>
              <Text size={1}>• Conversion Rates</Text>
              <Text size={1}>• Drop-off Points</Text>
              <Text size={1}>• A/B Testing Results</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default ConversionAnalyticsDashboard;
