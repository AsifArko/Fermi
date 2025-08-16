import React from 'react';

import { Badge } from '@/components/ui/badge';

import DataTable from './data-table';

interface ErrorLogsTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ErrorLogsTab: React.FC<ErrorLogsTabProps> = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const columns = [
    {
      key: 'errorType',
      label: 'Error Type',
      render: (value: unknown) => (
        <Badge variant='outline'>{String(value ?? '')}</Badge>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (value: unknown) => (
        <span className='max-w-xs truncate'>{String(value ?? '')}</span>
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      render: (value: unknown) => (
        <Badge
          variant={
            getSeverityColor(String(value ?? '')) as
              | 'destructive'
              | 'secondary'
              | 'outline'
          }
        >
          {String(value ?? '')}
        </Badge>
      ),
    },
    {
      key: 'url',
      label: 'URL',
      render: (value: unknown) => (
        <span className='font-mono text-sm'>{String(value ?? '')}</span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (value: unknown) => formatDate(String(value ?? '')),
    },
    {
      key: 'resolved',
      label: 'Status',
      render: (value: unknown) => (
        <Badge variant={value ? 'outline' : 'destructive'}>
          {String(value ? 'Resolved' : 'Open')}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      title='Error Logs'
      description='Track and monitor application errors and issues'
      data={data}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default ErrorLogsTab;
