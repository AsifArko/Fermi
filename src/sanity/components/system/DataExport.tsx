'use client';

import React from 'react';
import { Card, Text, Stack, Box } from '@sanity/ui';

export function DataExport() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Data Export
            </Text>
            <Text size={2} muted>
              Export system data and reports
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Export Options
            </Text>
            <Stack space={2}>
              <Text size={1}>• Course Data</Text>
              <Text size={1}>• User Analytics</Text>
              <Text size={1}>• System Metrics</Text>
              <Text size={1}>• Custom Reports</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default DataExport;
