import React, { useState } from 'react';

import DataTable from './data-table';

interface PerformanceTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  onPageChange: (page: number) => void;
  allData: Record<string, unknown>[];
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({
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

  const getPerformanceColor = (value: unknown, metric: unknown) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return 'text-gray-600';

    const metricStr = String(metric ?? '').toLowerCase();

    if (
      metricStr.includes('lcp') ||
      metricStr.includes('fid') ||
      metricStr.includes('cls')
    ) {
      // Core Web Vitals
      if (metricStr.includes('lcp')) {
        return numValue <= 2500
          ? 'text-green-600'
          : numValue <= 4000
            ? 'text-yellow-600'
            : 'text-red-600';
      } else if (metricStr.includes('fid')) {
        return numValue <= 100
          ? 'text-green-600'
          : numValue <= 300
            ? 'text-yellow-600'
            : 'text-red-600';
      } else if (metricStr.includes('cls')) {
        return numValue <= 0.1
          ? 'text-green-600'
          : numValue <= 0.25
            ? 'text-yellow-600'
            : 'text-red-600';
      }
    }

    // Default performance metrics
    if (numValue <= 1000) return 'text-green-600';
    if (numValue <= 3000) return 'text-yellow-600';
    return 'text-red-600';
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
      key: 'metric',
      label: 'Metric',
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
        <span
          className={`font-mono text-xs ${getPerformanceColor(value, row.metric)}`}
        >
          {formatDuration(Number(value ?? 0))}
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
      title='Performance Metrics'
      description='Core Web Vitals and performance indicators'
      data={data}
      columns={columns}
      currentPage={currentPage}
      onPageChange={onPageChange}
      allData={allData}
      filters={filters}
    />
  );
};

export default PerformanceTab;
