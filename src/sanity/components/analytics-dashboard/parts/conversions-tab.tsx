import React from 'react';

import { Badge } from '@/components/ui/badge';

import DataTable from './data-table';

interface ConversionsTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ConversionsTab: React.FC<ConversionsTabProps> = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const columns = [
    {
      key: 'conversionType',
      label: 'Conversion Type',
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
      key: 'currency',
      label: 'Currency',
      render: (value: unknown) => String(value ?? ''),
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
      title='Conversion Events'
      description='Track user conversions and revenue metrics'
      data={data}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default ConversionsTab;
