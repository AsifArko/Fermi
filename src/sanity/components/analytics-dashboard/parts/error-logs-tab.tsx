import React, { useState } from 'react';

import DataTable from './data-table';

interface ErrorLogsTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  onPageChange: (page: number) => void;
  allData: Record<string, unknown>[];
}

const ErrorLogsTab: React.FC<ErrorLogsTabProps> = ({
  data,
  currentPage,
  onPageChange,
  allData,
}) => {
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityColor = (severity: unknown) => {
    const severityStr = String(severity ?? '').toLowerCase();
    switch (severityStr) {
      case 'critical':
        return 'text-red-600 font-bold';
      case 'high':
        return 'text-orange-600 font-semibold';
      case 'medium':
        return 'text-yellow-600 font-medium';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusColor = (status: unknown) => {
    const statusStr = String(status ?? '').toLowerCase();
    switch (statusStr) {
      case 'resolved':
        return 'text-green-600';
      case 'investigating':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
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
      key: 'errorType',
      label: 'Error Type',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => <span className='font-medium text-xs'>{String(value ?? '')}</span>,
    },
    {
      key: 'message',
      label: 'Message',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        rowIndex: number
      ) => {
        const messageText = String(value ?? '');
        const copyId = `${rowIndex}-message`;
        const isCopied = copiedFields.has(copyId);

        return (
          <div className='flex items-center gap-2'>
            <span className='text-xs max-w-xs truncate'>{messageText}</span>
            <button
              className='h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center'
              onClick={() => copyToClipboard(messageText, rowIndex, 'message')}
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
      key: 'severity',
      label: 'Severity',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => (
        <span className={`text-xs ${getSeverityColor(value)}`}>
          {String(value ?? '')}
        </span>
      ),
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
      key: 'timestamp',
      label: 'Timestamp',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => formatDate(String(value ?? '')),
    },
    {
      key: 'status',
      label: 'Status',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => (
        <span className={`text-xs ${getStatusColor(value)}`}>
          {String(value ?? '')}
        </span>
      ),
    },
  ];

  const filters = {
    search: true,
    dateRange: true,
  };

  return (
    <DataTable
      title='Error Logs'
      description='Track and monitor application errors and issues'
      data={data}
      columns={columns}
      currentPage={currentPage}
      onPageChange={onPageChange}
      allData={allData}
      filters={filters}
    />
  );
};

export default ErrorLogsTab;
