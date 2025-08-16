'use client';

import React from 'react';
import { Card, Text, Stack } from '@sanity/ui';

interface NetworkMonitorProps {
  // Props for future customization
}

export function NetworkMonitor(_props: NetworkMonitorProps) {
  // Temporarily disabled due to build errors
  return (
    <Card padding={6} radius={3} shadow={1} tone='caution'>
      <Stack space={4}>
        <Text size={3} weight='bold' align='center'>
          Network Monitor Temporarily Disabled
        </Text>
        <Text size={2} muted align='center'>
          This component is being fixed and will be available soon.
        </Text>
      </Stack>
    </Card>
  );
}

export default NetworkMonitor;
