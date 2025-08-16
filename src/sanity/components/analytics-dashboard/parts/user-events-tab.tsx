import React from 'react';

import { Badge } from '@/components/ui/badge';

import DataTable from './data-table';

interface UserEventsTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserEventsTab: React.FC<UserEventsTabProps> = ({
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
      key: 'eventType',
      label: 'Event Type',
      render: (value: unknown) => (
        <Badge variant='outline'>{String(value ?? '')}</Badge>
      ),
    },
    {
      key: 'eventName',
      label: 'Event Name',
      render: (value: unknown) => String(value ?? ''),
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
      title='User Events'
      description='Monitor user interactions and behavior patterns'
      data={data}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default UserEventsTab;
