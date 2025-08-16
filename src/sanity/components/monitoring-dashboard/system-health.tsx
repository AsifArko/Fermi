import React from 'react';
import { Card, Text, Stack, Flex } from '@sanity/ui';
import { Cpu, HardDrive, MemoryStick } from 'lucide-react';

interface SystemHealthProps {
  cpu: number;
  memory: number;
  disk: number;
}

export function SystemHealth({ cpu, memory, disk }: SystemHealthProps) {
  const getTone = (value: number) => {
    if (value < 50) return 'positive';
    if (value < 80) return 'caution';
    return 'critical';
  };

  const getStatus = (value: number) => {
    if (value < 50) return 'Good';
    if (value < 80) return 'Warning';
    return 'Critical';
  };

  const getProgressColor = (value: number) => {
    if (value > 80) return 'rgba(239, 68, 68, 0.8)'; // Less intense red with transparency
    if (value > 60) return 'rgba(245, 158, 11, 0.8)'; // Less intense orange with transparency
    return 'rgba(16, 185, 129, 0.8)'; // Less intense green with transparency
  };

  return (
    <Stack space={3}>
      {/* CPU Usage */}
      <Card
        padding={4}
        radius={3}
        shadow={1}
        tone={typeof cpu === 'number' ? getTone(cpu) : 'positive'}
      >
        <Stack space={3}>
          <Flex align='center' justify='space-between'>
            <Flex align='center' gap={2}>
              <Cpu size={16} />
              <Text size={1} weight='semibold'>
                CPU Usage
              </Text>
            </Flex>
            <Text
              size={1}
              weight='bold'
              style={{
                color:
                  typeof cpu === 'number'
                    ? getProgressColor(cpu)
                    : 'rgba(16, 185, 129, 0.8)',
              }}
            >
              {typeof cpu === 'number' ? cpu.toFixed(1) : '0.0'}%
            </Text>
          </Flex>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className='progress-bar'
              style={{
                width: `${typeof cpu === 'number' ? (cpu / 100) * 100 : 0}%`,
                height: '100%',
                backgroundColor:
                  typeof cpu === 'number'
                    ? getProgressColor(cpu)
                    : 'rgba(16, 185, 129, 0.8)',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
          <Text size={0} muted style={{ textAlign: 'center' }}>
            Status: {typeof cpu === 'number' ? getStatus(cpu) : 'Good'}
          </Text>
        </Stack>
      </Card>

      {/* Memory Usage */}
      <Card
        padding={4}
        radius={3}
        shadow={1}
        tone={typeof memory === 'number' ? getTone(memory) : 'positive'}
      >
        <Stack space={3}>
          <Flex align='center' justify='space-between'>
            <Flex align='center' gap={2}>
              <MemoryStick size={16} />
              <Text size={1} weight='semibold'>
                Memory Usage
              </Text>
            </Flex>
            <Text
              size={1}
              weight='bold'
              style={{
                color:
                  typeof memory === 'number'
                    ? getProgressColor(memory)
                    : 'rgba(16, 185, 129, 0.8)',
              }}
            >
              {typeof memory === 'number' ? memory.toFixed(1) : '0.0'}%
            </Text>
          </Flex>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className='progress-bar'
              style={{
                width: `${typeof memory === 'number' ? (memory / 100) * 100 : 0}%`,
                height: '100%',
                backgroundColor:
                  typeof memory === 'number'
                    ? getProgressColor(memory)
                    : 'rgba(16, 185, 129, 0.8)',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
          <Text size={0} muted style={{ textAlign: 'center' }}>
            Status: {typeof memory === 'number' ? getStatus(memory) : 'Good'}
          </Text>
        </Stack>
      </Card>

      {/* Disk Usage */}
      <Card
        padding={4}
        radius={3}
        shadow={1}
        tone={typeof disk === 'number' ? getTone(disk) : 'positive'}
      >
        <Stack space={3}>
          <Flex align='center' justify='space-between'>
            <Flex align='center' gap={2}>
              <HardDrive size={16} />
              <Text size={1} weight='semibold'>
                Disk Usage
              </Text>
            </Flex>
            <Text
              size={1}
              weight='bold'
              style={{
                color:
                  typeof disk === 'number'
                    ? getProgressColor(disk)
                    : 'rgba(16, 185, 129, 0.8)',
              }}
            >
              {typeof disk === 'number' ? disk.toFixed(1) : '0.0'}%
            </Text>
          </Flex>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className='progress-bar'
              style={{
                width: `${typeof disk === 'number' ? (disk / 100) * 100 : 0}%`,
                height: '100%',
                backgroundColor:
                  typeof disk === 'number'
                    ? getProgressColor(disk)
                    : 'rgba(16, 185, 129, 0.8)',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
          <Text size={0} muted style={{ textAlign: 'center' }}>
            Status: {typeof disk === 'number' ? getStatus(disk) : 'Good'}
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
