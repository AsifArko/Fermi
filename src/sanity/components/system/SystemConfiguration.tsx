'use client';

import React from 'react';
import { Card, Text, Stack, Box } from '@sanity/ui';

export function SystemConfiguration() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              System Configuration
            </Text>
            <Text size={2} muted>
              System settings and configuration management
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Configuration Options
            </Text>
            <Stack space={2}>
              <Text size={1}>• Server Settings</Text>
              <Text size={1}>• Database Configuration</Text>
              <Text size={1}>• Security Settings</Text>
              <Text size={1}>• Performance Tuning</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default SystemConfiguration;
