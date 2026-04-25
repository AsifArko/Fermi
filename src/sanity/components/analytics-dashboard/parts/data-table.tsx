import React, { useState, useMemo } from 'react';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Pagination from './pagination';

interface DataTableProps {
  title: string;
  description: string;
  data: Record<string, unknown>[];
  columns: {
    key: string;
    label: string;
    render?: (
      value: unknown,
      row: Record<string, unknown>,
      rowIndex: number
    ) => React.ReactNode;
  }[];
  currentPage: number;
  onPageChange: (page: number) => void;
  allData?: Record<string, unknown>[];
  filters?: {
    search?: boolean;
    dateRange?: boolean;
    customFilters?: Array<{
      key: string;
      label: string;
      options: Array<{ value: string; label: string }>;
    }>;
  };
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  description,
  data,
  columns,
  currentPage,
  onPageChange,
  allData = [],
  filters,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [customFilters, setCustomFilters] = useState<Record<string, string>>(
    {}
  );

  const filteredData = useMemo(() => {
    // Ensure we have valid data to work with
    const validAllData = Array.isArray(allData) ? allData : [];
    const validData = Array.isArray(data) ? data : [];

    let filtered = validAllData.length > 0 ? validAllData : validData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case '1h':
          filterDate.setHours(now.getHours() - 1);
          break;
        case '24h':
          filterDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          filterDate.setDate(now.getDate() - 30);
          break;
      }

      filtered = filtered.filter(item => {
        const itemDate = new Date(
          String(item.timestamp || item.createdAt || '')
        );
        return itemDate >= filterDate;
      });
    }

    // Apply custom filters
    Object.entries(customFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => item[key] === value);
      }
    });

    return filtered;
  }, [allData, data, searchTerm, dateRange, customFilters]);

  const paginatedData = useMemo(() => {
    // Ensure filteredData is an array
    if (!Array.isArray(filteredData)) {
      return [];
    }

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const totalFilteredPages = Math.ceil(
    (Array.isArray(filteredData) ? filteredData.length : 0) / 5
  );

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const updateCustomFilter = (key: string, value: string) => {
    setCustomFilters(prev => ({ ...prev, [key]: value }));
    onPageChange(1); // Reset to first page when filters change
  };

  // Generate filters for all columns
  const generateColumnFilters = () => {
    // Ensure allData is an array and has data
    if (!Array.isArray(allData) || allData.length === 0) {
      return [];
    }

    return columns.map(column => {
      const uniqueValues = Array.from(
        new Set(
          allData
            .map(item => String(item[column.key] ?? ''))
            .filter(value => value && value !== 'undefined' && value !== 'null')
        )
      ).slice(0, 10); // Limit to 10 unique values

      return {
        key: column.key,
        label: column.label,
        options: uniqueValues.map(value => ({ value, label: value })),
      };
    });
  };

  const columnFilters = generateColumnFilters();

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg'>{title}</CardTitle>
        <CardDescription className='text-sm'>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {/* Table Filters */}
        {filters && (
          <div className='space-y-3'>
            {/* Global Search and Date Range */}
            <div className='flex flex-wrap gap-3 items-center'>
              {filters.search && (
                <div className='relative flex-1 min-w-[200px]'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      onPageChange(1);
                    }}
                    className='pl-10 h-8'
                  />
                </div>
              )}

              {filters.dateRange && (
                <Select
                  value={dateRange}
                  onValueChange={value => {
                    setDateRange(value);
                    onPageChange(1);
                  }}
                >
                  <SelectTrigger className='h-8 w-[140px]'>
                    <SelectValue placeholder='Time' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Time</SelectItem>
                    <SelectItem value='1h'>Last Hour</SelectItem>
                    <SelectItem value='24h'>Last 24h</SelectItem>
                    <SelectItem value='7d'>Last 7 days</SelectItem>
                    <SelectItem value='30d'>Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Column-specific filters */}
            <div className='flex flex-wrap gap-2'>
              {columnFilters.map(filter => (
                <Select
                  key={filter.key}
                  value={customFilters[filter.key] || 'all'}
                  onValueChange={value => updateCustomFilter(filter.key, value)}
                >
                  <SelectTrigger className='h-8 w-[140px] text-xs'>
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All {filter.label}</SelectItem>
                    {filter.options.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.value.length > 20
                          ? `${option.value.substring(0, 20)}...`
                          : option.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div className='border rounded-md'>
          <Table>
            <TableHeader>
              <TableRow className='h-8'>
                {columns.map(column => (
                  <TableHead
                    key={column.key}
                    className='h-8 px-2 py-1 text-xs font-medium'
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                  const uniqueId =
                    (
                      row.id ||
                      row.sessionId ||
                      row.timestamp ||
                      row.url ||
                      `row-${index}-${Date.now()}`
                    )?.toString() || `row-${index}-${Date.now()}`;

                  return (
                    <TableRow key={uniqueId} className='h-8 hover:bg-muted/50'>
                      {columns.map(column => (
                        <TableCell
                          key={column.key}
                          className='h-8 px-2 py-1 text-xs'
                        >
                          {column.render
                            ? column.render(row[column.key], row, index)
                            : String(row[column.key] ?? '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-8 px-2 py-1 text-xs text-center text-muted-foreground'
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalFilteredPages}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  );
};

export default DataTable;
