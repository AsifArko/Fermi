'use client';

import React from 'react';
import { Card, Text, Stack, Box } from '@sanity/ui';

export function AuditLogs() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Audit Logs
            </Text>
            <Text size={2} muted>
              System audit and activity logs
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Log Categories
            </Text>
            <Stack space={2}>
              <Text size={1}>• User Actions</Text>
              <Text size={1}>• System Events</Text>
              <Text size={1}>• Security Events</Text>
              <Text size={1}>• Performance Metrics</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default AuditLogs;
