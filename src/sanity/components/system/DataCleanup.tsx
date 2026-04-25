'use client';

import React from 'react';
import { Card, Text, Stack, Box } from '@sanity/ui';

export function DataCleanup() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Data Cleanup
            </Text>
            <Text size={2} muted>
              Clean up old and unused data
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Cleanup Options
            </Text>
            <Stack space={2}>
              <Text size={1}>• Old Logs</Text>
              <Text size={1}>• Temporary Files</Text>
              <Text size={1}>• Unused Data</Text>
              <Text size={1}>• Cache Cleanup</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default DataCleanup;
