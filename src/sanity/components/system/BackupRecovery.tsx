'use client';

import React from 'react';
import { Card, Text, Stack, Box } from '@sanity/ui';

export function BackupRecovery() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Backup & Recovery
            </Text>
            <Text size={2} muted>
              System backup and disaster recovery
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Backup Features
            </Text>
            <Stack space={2}>
              <Text size={1}>• Automated Backups</Text>
              <Text size={1}>• Data Recovery</Text>
              <Text size={1}>• Backup Verification</Text>
              <Text size={1}>• Disaster Recovery</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default BackupRecovery;
