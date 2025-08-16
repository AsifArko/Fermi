import React from 'react';

import DataTable from './data-table';

interface PageViewsTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PageViewsTab: React.FC<PageViewsTabProps> = ({
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
    {
      key: 'loadTime',
      label: 'Load Time',
      render: (value: unknown) => formatDuration(Number(value ?? 0)),
    },
    {
      key: 'userAgent',
      label: 'User Agent',
      render: (value: unknown) => (
        <span className='max-w-xs truncate'>{String(value ?? '')}</span>
      ),
    },
  ];

  return (
    <DataTable
      title='Page Views'
      description='Track user page navigation and engagement'
      data={data}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default PageViewsTab;
