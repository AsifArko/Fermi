import React from 'react';

import DataTable from './data-table';

interface SystemMetricsTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  onPageChange: (page: number) => void;
  allData: Record<string, unknown>[];
}

const SystemMetricsTab: React.FC<SystemMetricsTabProps> = ({
  data,
  currentPage,
  onPageChange,
  allData,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatValue = (value: unknown, unit: unknown) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return String(value ?? '');

    if (unit === 'percentage') {
      return `${numValue.toFixed(1)}%`;
    } else if (unit === 'bytes') {
      return `${(numValue / 1024 / 1024).toFixed(2)} MB`;
    } else if (unit === 'ms') {
      return `${numValue.toFixed(2)}ms`;
    }

    return `${numValue} ${unit || ''}`;
  };

  const getStatusColor = (status: unknown) => {
    const statusStr = String(status ?? '').toLowerCase();
    switch (statusStr) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const columns = [
    {
      key: 'metricType',
      label: 'Metric Type',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => <span className='font-medium text-xs'>{String(value ?? '')}</span>,
    },
    {
      key: 'value',
      label: 'Value',
      render: (
        value: unknown,
        row: Record<string, unknown>,
        _rowIndex: number
      ) => (
        <span className='font-mono text-xs'>
          {formatValue(value, row.unit)}
        </span>
      ),
    },
    {
      key: 'unit',
      label: 'Unit',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => (
        <span className='text-xs text-muted-foreground'>
          {String(value ?? '')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => (
        <span className={`text-xs font-medium ${getStatusColor(value)}`}>
          {String(value ?? '')}
        </span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => formatDate(String(value ?? '')),
    },
  ];

  const filters = {
    search: true,
    dateRange: true,
  };

  return (
    <DataTable
      title='System Metrics'
      description='Monitor server performance and resource utilization'
      data={data}
      columns={columns}
      currentPage={currentPage}
      onPageChange={onPageChange}
      allData={allData}
      filters={filters}
    />
  );
};

export default SystemMetricsTab;
