import React from 'react';

import { Badge } from '@/components/ui/badge';

import DataTable from './data-table';

interface SystemMetricsTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SystemMetricsTab: React.FC<SystemMetricsTabProps> = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getMetricColor = (value: number, type: string) => {
    if (type === 'cpu' || type === 'memory' || type === 'disk') {
      if (value > 80) return 'destructive';
      if (value > 60) return 'secondary';
      return 'outline';
    }
    return 'outline';
  };

  const columns = [
    {
      key: 'metricType',
      label: 'Metric Type',
      render: (value: unknown) => (
        <Badge variant='outline'>{String(value ?? '')}</Badge>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      render: (value: unknown) => String(value ?? ''),
    },
    {
      key: 'unit',
      label: 'Unit',
      render: (value: unknown) => String(value ?? ''),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_value: unknown, row: Record<string, unknown>) => {
        const metricValue = Number(row.value ?? 0);
        const metricType = String(row.metricType ?? '');
        const status =
          metricValue > 80
            ? 'Critical'
            : metricValue > 60
              ? 'Warning'
              : 'Normal';
        return (
          <Badge
            variant={
              getMetricColor(metricValue, metricType) as
                | 'destructive'
                | 'secondary'
                | 'outline'
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (value: unknown) => formatDate(String(value ?? '')),
    },
  ];

  return (
    <DataTable
      title='System Metrics'
      description='Monitor server performance and resource utilization'
      data={data}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default SystemMetricsTab;
