import { Search } from 'lucide-react';

import React from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterState {
  search: string;
  dateRange: string;
  eventType: string;
  severity: string;
  metricType: string;
}

interface DashboardFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function DashboardFilters({
  filters,
  onFiltersChange,
}: DashboardFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search all data...'
          value={filters.search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFilter('search', e.target.value)
          }
          className='pl-10'
        />
      </div>

      <Select
        value={filters.dateRange}
        onValueChange={(value: string) => updateFilter('dateRange', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Date Range' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='1d'>Last 24 hours</SelectItem>
          <SelectItem value='7d'>Last 7 days</SelectItem>
          <SelectItem value='30d'>Last 30 days</SelectItem>
          <SelectItem value='90d'>Last 90 days</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.eventType}
        onValueChange={(value: string) => updateFilter('eventType', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Event Type' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Events</SelectItem>
          <SelectItem value='page_view'>Page View</SelectItem>
          <SelectItem value='button_click'>Button Click</SelectItem>
          <SelectItem value='form_submit'>Form Submit</SelectItem>
          <SelectItem value='download'>Download</SelectItem>
          <SelectItem value='purchase'>Purchase</SelectItem>
          <SelectItem value='error'>Error</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.severity}
        onValueChange={(value: string) => updateFilter('severity', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Severity' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Severities</SelectItem>
          <SelectItem value='low'>Low</SelectItem>
          <SelectItem value='medium'>Medium</SelectItem>
          <SelectItem value='high'>High</SelectItem>
          <SelectItem value='critical'>Critical</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.metricType}
        onValueChange={(value: string) => updateFilter('metricType', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Metric Type' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Metrics</SelectItem>
          <SelectItem value='cpu'>CPU Usage</SelectItem>
          <SelectItem value='memory'>Memory Usage</SelectItem>
          <SelectItem value='disk'>Disk Usage</SelectItem>
          <SelectItem value='network'>Network Latency</SelectItem>
          <SelectItem value='response_time'>Response Time</SelectItem>
          <SelectItem value='error_rate'>Error Rate</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
