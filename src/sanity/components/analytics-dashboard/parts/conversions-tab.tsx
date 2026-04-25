import React from 'react';

import DataTable from './data-table';

interface ConversionsTabProps {
  data: Record<string, unknown>[];
  currentPage: number;
  onPageChange: (page: number) => void;
  allData: Record<string, unknown>[];
}

const ConversionsTab: React.FC<ConversionsTabProps> = ({
  data,
  currentPage,
  onPageChange,
  allData,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (value: unknown, currency: unknown) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return String(value ?? '');

    const currencyStr = String(currency ?? 'USD');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyStr,
    }).format(numValue);
  };

  const getConversionTypeColor = (type: unknown) => {
    const typeStr = String(type ?? '').toLowerCase();
    switch (typeStr) {
      case 'purchase':
        return 'text-green-600 font-semibold';
      case 'signup':
        return 'text-blue-600 font-semibold';
      case 'download':
        return 'text-purple-600 font-semibold';
      case 'trial':
        return 'text-orange-600 font-semibold';
      default:
        return 'text-gray-600';
    }
  };

  const columns = [
    {
      key: 'conversionType',
      label: 'Conversion Type',
      render: (
        value: unknown,
        _row: Record<string, unknown>,
        _rowIndex: number
      ) => (
        <span className={`text-xs ${getConversionTypeColor(value)}`}>
          {String(value ?? '')}
        </span>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      render: (
        value: unknown,
        row: Record<string, unknown>,
        _rowIndex: number
      ) => (
        <span className='font-mono text-xs font-medium'>
          {formatCurrency(value, row.currency)}
        </span>
      ),
    },
    {
      key: 'currency',
      label: 'Currency',
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
      title='Conversion Events'
      description='Track user conversions and revenue metrics'
      data={data}
      columns={columns}
      currentPage={currentPage}
      onPageChange={onPageChange}
      allData={allData}
      filters={filters}
    />
  );
};

export default ConversionsTab;
