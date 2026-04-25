'use client';

import React from 'react';
import { Card, Text, Stack, Box } from '@sanity/ui';

export function AccessControl() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Access Control
            </Text>
            <Text size={2} muted>
              Manage user access and permissions
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Access Management
            </Text>
            <Stack space={2}>
              <Text size={1}>• User Roles</Text>
              <Text size={1}>• Permission Settings</Text>
              <Text size={1}>• Access Logs</Text>
              <Text size={1}>• Security Policies</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default AccessControl;
