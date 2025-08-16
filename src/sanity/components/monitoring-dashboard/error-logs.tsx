import React from 'react';
import { Card, Text, Stack, Flex, Badge, Button } from '@sanity/ui';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';

interface ErrorLog {
  message: string;
  count: number;
}

interface ErrorLogsProps {
  errors: ErrorLog[];
}

export function ErrorLogs({ errors }: ErrorLogsProps) {
  const getSeverityColor = (count: number) => {
    if (count > 10) return 'critical';
    if (count > 5) return 'caution';
    return 'primary';
  };

  const getSeverityLabel = (count: number) => {
    if (count > 10) return 'High';
    if (count > 5) return 'Medium';
    return 'Low';
  };

  if (errors.length === 0) {
    return (
      <Card padding={4} radius={3} shadow={1} tone='positive'>
        <Flex align='center' gap={2} justify='center'>
          <CheckCircle size={16} />
          <Text size={1} style={{ color: '#059669' }}>
            No errors reported
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Stack space={3}>
      {errors.map((error, index) => (
        <Card
          key={`error-${error.message.substring(0, 20)}-${index}`}
          padding={4}
          radius={3}
          shadow={1}
          tone={getSeverityColor(error.count)}
        >
          <Stack space={3}>
            <Flex align='center' justify='space-between'>
              <Flex align='center' gap={2}>
                <AlertTriangle size={16} />
                <Text
                  size={1}
                  weight='semibold'
                  style={{
                    maxWidth: '70%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: '#374151',
                  }}
                >
                  {error.message}
                </Text>
              </Flex>
              <Flex align='center' gap={2}>
                <Badge tone={getSeverityColor(error.count)} radius={2}>
                  {getSeverityLabel(error.count)}
                </Badge>
                <Text size={1} weight='bold' style={{ color: '#dc2626' }}>
                  {error.count} occurrences
                </Text>
              </Flex>
            </Flex>
            <Flex align='center' justify='space-between'>
              <Text size={0} muted style={{ color: '#6b7280' }}>
                Last seen: Recently
              </Text>
              <Button
                mode='ghost'
                icon={X}
                text='Dismiss'
                size={0}
                padding={2}
                style={{ color: '#6b7280' }}
              />
            </Flex>
          </Stack>
        </Card>
      ))}

      {errors.length > 5 && (
        <Card padding={3} radius={3} shadow={1}>
          <Text size={1} muted style={{ textAlign: 'center' }}>
            Showing top 5 errors. View all errors in the Error Logs section.
          </Text>
        </Card>
      )}
    </Stack>
  );
}
