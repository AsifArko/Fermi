'use client';

import React from 'react';
import { Card, Text, Stack } from '@sanity/ui';

interface StorageMonitorProps {
  // Props for future customization
}

export function StorageMonitor(_props: StorageMonitorProps) {
  // Temporarily disabled due to build errors
  return (
    <Card padding={6} radius={3} shadow={1} tone='caution'>
      <Stack space={4}>
        <Text size={3} weight='bold' align='center'>
          Storage Monitor Temporarily Disabled
        </Text>
        <Text size={2} muted align='center'>
          This component is being fixed and will be available soon.
        </Text>
      </Stack>
    </Card>
  );
}

export default StorageMonitor;
