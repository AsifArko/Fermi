import React, { useState } from 'react';

import DataTable from './data-table';

interface UserEventsTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  onPageChange: (page: number) => void;
  allData: Record<string, unknown>[];
}

const UserEventsTab: React.FC<UserEventsTabProps> = ({
  data,
  currentPage,
  onPageChange,
  allData,
}) => {
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
      key: 'eventType',
      label: 'Event Type',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => <span className='font-medium text-xs'>{String(value ?? '')}</span>,
    },
    {
      key: 'eventName',
      label: 'Event Name',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => <span className='text-xs'>{String(value ?? '')}</span>,
    },
    {
      key: 'url',
      label: 'URL',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        rowIndex: number
      ) => {
        const urlText = String(value ?? '');
        const copyId = `${rowIndex}-url`;
        const isCopied = copiedFields.has(copyId);

        return (
          <div className='flex items-center gap-2'>
            <span className='font-mono text-xs max-w-xs truncate'>
              {urlText}
            </span>
            <button
              className='h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center'
              onClick={() => copyToClipboard(urlText, rowIndex, 'url')}
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
  ];

  const filters = {
    search: true,
    dateRange: true,
  };

  return (
    <DataTable
      title='User Events'
      description='Monitor user interactions and behavior patterns'
      data={data}
      columns={columns}
      currentPage={currentPage}
      onPageChange={onPageChange}
      allData={allData}
      filters={filters}
    />
  );
};

export default UserEventsTab;
