'use client';

import React from 'react';
import { Card, Text, Stack, Box } from '@sanity/ui';

export function DataImport() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={3} weight='bold'>
              Data Import
            </Text>
            <Text size={2} muted>
              Import data and configuration files
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight='semibold'>
              Import Options
            </Text>
            <Stack space={2}>
              <Text size={1}>• Course Content</Text>
              <Text size={1}>• User Data</Text>
              <Text size={1}>• Configuration Files</Text>
              <Text size={1}>• Backup Data</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default DataImport;
