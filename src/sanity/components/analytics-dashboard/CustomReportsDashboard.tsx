import { Box, Card, Stack, Text } from '@sanity/ui';

import React from 'react';

export function CustomReportsDashboard() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Custom Reports Dashboard
            </Text>
            <Text size={2} muted>
              Create and manage custom analytics reports
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Report Features
            </Text>
            <Stack space={2}>
              <Text size={1}>• Custom Metrics</Text>
              <Text size={1}>• Data Visualization</Text>
              <Text size={1}>• Scheduled Reports</Text>
              <Text size={1}>• Export Options</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default CustomReportsDashboard;
