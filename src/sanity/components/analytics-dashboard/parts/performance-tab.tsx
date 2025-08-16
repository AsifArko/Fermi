import React from 'react';

import { Badge } from '@/components/ui/badge';

import DataTable from './data-table';

interface PerformanceTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const columns = [
    {
      key: 'metricName',
      label: 'Metric',
      render: (value: unknown) => (
        <Badge variant='outline'>{String(value ?? '')}</Badge>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      render: (value: unknown) => formatDuration(Number(value ?? 0)),
    },
    {
      key: 'url',
      label: 'URL',
      render: (value: unknown) => (
        <span className='font-mono text-sm'>{String(value ?? '')}</span>
      ),
    },
    {
      key: 'sessionId',
      label: 'Session ID',
      render: (value: unknown) => (
        <span className='font-mono text-xs'>{String(value ?? '')}</span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (value: unknown) => formatDate(String(value ?? '')),
    },
  ];

  return (
    <DataTable
      title='Performance Metrics'
      description='Core Web Vitals and performance indicators'
      data={data}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default PerformanceTab;
