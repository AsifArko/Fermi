import React, { useState } from 'react';

import DataTable from './data-table';

interface PageViewsTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  onPageChange: (page: number) => void;
  allData: Record<string, unknown>[];
}

const PageViewsTab: React.FC<PageViewsTabProps> = ({
  data,
  currentPage,
  onPageChange,
  allData,
}) => {
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const copyToClipboard = async (
    text: string,
    rowIndex: number,
    fieldName: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      const copyId = `${rowIndex}-${fieldName}`;
      setCopiedFields(prev => new Set(prev).add(copyId));
      setTimeout(() => {
        setCopiedFields(prev => {
          const newSet = new Set(prev);
          newSet.delete(copyId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const columns = [
    {
      key: 'url',
      label: 'URL',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => <span className='font-mono text-xs'>{String(value ?? '')}</span>,
    },
    {
      key: 'sessionId',
      label: 'Session ID',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => <span className='font-mono text-xs'>{String(value ?? '')}</span>,
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
    {
      key: 'loadTime',
      label: 'Load Time',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => formatDuration(Number(value ?? 0)),
    },
    {
      key: 'userAgent',
      label: 'User Agent',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        rowIndex: number
      ) => {
        const userAgentText = String(value ?? '');
        const copyId = `${rowIndex}-userAgent`;
        const isCopied = copiedFields.has(copyId);

        return (
          <div className='flex items-center gap-2'>
            <span className='font-mono text-xs text-muted-foreground max-w-xs truncate'>
              {userAgentText}
            </span>
            <button
              className='h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center'
              onClick={() =>
                copyToClipboard(userAgentText, rowIndex, 'userAgent')
              }
            >
              {isCopied ? (
                <span className='text-green-600 text-xs'>✓</span>
              ) : (
                <span className='text-muted-foreground text-xs'>📋</span>
              )}
            </button>
          </div>
        );
      },
    },
  ];

  const filters = {
    search: true,
    dateRange: true,
  };

  return (
    <DataTable
      title='Page Views'
      description='Track user page navigation and engagement'
      data={data}
      columns={columns}
      currentPage={currentPage}
      onPageChange={onPageChange}
      allData={allData}
      filters={filters}
    />
  );
};

export default PageViewsTab;
