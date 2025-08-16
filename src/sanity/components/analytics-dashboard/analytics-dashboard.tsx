'use client';

import { Box, Stack, Text } from '@sanity/ui';

import React, { useState, useEffect, useCallback } from 'react';

import ConversionsTab from './parts/conversions-tab';
import { DashboardFilters } from './parts/dashboard-filters';
import DashboardHeader from './parts/dashboard-header';
import ErrorLogsTab from './parts/error-logs-tab';
import OverviewTab from './parts/overview-tab';
import PageViewsTab from './parts/page-views-tab';
import PerformanceTab from './parts/performance-tab';
import SystemMetricsTab from './parts/system-metrics-tab';
import UserEventsTab from './parts/user-events-tab';

type PageView = Record<string, unknown>;
type UserEvent = Record<string, unknown>;
type SystemMetric = Record<string, unknown>;
type ErrorLog = Record<string, unknown>;
type PerformanceMetric = Record<string, unknown>;
type ConversionEvent = Record<string, unknown>;

interface AnalyticsData {
  pageViews: PageView[];
  userEvents: UserEvent[];
  systemMetrics: SystemMetric[];
  errorLogs: ErrorLog[];
  performanceMetrics: PerformanceMetric[];
  conversionEvents: ConversionEvent[];
}

interface FilterState {
  search: string;
  dateRange: string;
  eventType: string;
  severity: string;
  metricType: string;
}

interface PaginationState {
  pageViews: { current: number; itemsPerPage: number };
  userEvents: { current: number; itemsPerPage: number };
  systemMetrics: { current: number; itemsPerPage: number };
  errorLogs: { current: number; itemsPerPage: number };
  performance: { current: number; itemsPerPage: number };
  conversions: { current: number; itemsPerPage: number };
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    pageViews: [],
    userEvents: [],
    systemMetrics: [],
    errorLogs: [],
    performanceMetrics: [],
    conversionEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: '7d',
    eventType: 'all',
    severity: 'all',
    metricType: 'all',
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageViews: { current: 1, itemsPerPage: 5 },
    userEvents: { current: 1, itemsPerPage: 5 },
    systemMetrics: { current: 1, itemsPerPage: 5 },
    errorLogs: { current: 1, itemsPerPage: 5 },
    performance: { current: 1, itemsPerPage: 5 },
    conversions: { current: 1, itemsPerPage: 5 },
  });

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [
        pageViews,
        userEvents,
        systemMetrics,
        errorLogs,
        performanceMetrics,
        conversionEvents,
      ] = await Promise.all([
        fetch('/api/monitoring/page-views').then(res => res.json()),
        fetch('/api/monitoring/user-events').then(res => res.json()),
        fetch('/api/monitoring/system-metrics').then(res => res.json()),
        fetch('/api/monitoring/error-logs').then(res => res.json()),
        fetch('/api/monitoring/performance-metrics').then(res => res.json()),
        fetch('/api/monitoring/conversion-events').then(res => res.json()),
      ]);

      // Debug logging
      console.log('API Responses:', {
        pageViews,
        userEvents,
        systemMetrics,
        errorLogs,
        performanceMetrics,
        conversionEvents,
      });

      setData({
        pageViews: pageViews.data || [],
        userEvents: userEvents.data || [],
        systemMetrics: systemMetrics.data || [],
        errorLogs: errorLogs.data || [],
        performanceMetrics: performanceMetrics.data || [],
        conversionEvents: conversionEvents.data || [],
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh only the data (not the entire component)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true); // Pass true to indicate this is a refresh
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleManualRefresh = () => {
    fetchData(true);
  };

  const handlePageChange = (tab: string, page: number) => {
    setPagination(prev => ({
      ...prev,
      [tab]: { ...prev[tab as keyof typeof prev], current: page },
    }));
  };

  const filterData = (data: unknown[], type: string) => {
    if (!Array.isArray(data)) {
      return [];
    }

    return (data as Record<string, unknown>[]).filter(item => {
      const matchesSearch =
        !filters.search ||
        JSON.stringify(item)
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      if (!matchesSearch) return false;

      switch (type) {
        case 'userEvents':
          return (
            filters.eventType === 'all' || item.eventType === filters.eventType
          );
        case 'errorLogs':
          return (
            filters.severity === 'all' || item.severity === filters.severity
          );
        case 'systemMetrics':
          return (
            filters.metricType === 'all' ||
            item.metricType === filters.metricType
          );
        default:
          return true;
      }
    });
  };

  const getPaginatedData = (data: unknown[], tab: keyof PaginationState) => {
    if (!data || !Array.isArray(data)) {
      return { data: [], totalPages: 0 };
    }

    const filteredData = filterData(data, tab);
    const { current, itemsPerPage } = pagination[tab];
    const startIndex = (current - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: filteredData.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredData.length / itemsPerPage),
    };
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='flex items-center space-x-3'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
          <span className='text-sm text-muted-foreground'>
            Loading analytics data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <DashboardHeader
        onRefresh={handleManualRefresh}
        refreshing={refreshing}
      />

      {/* Filters */}
      <DashboardFilters filters={filters} onFiltersChange={setFilters} />

      {/* Analytics Tabs */}
      <Box padding={4}>
        <Stack space={4}>
          <Text size={3} weight='bold'>
            Analytics Dashboard
          </Text>

          {/* Tab Navigation */}
          <Stack space={2}>
            <Text size={2} weight='semibold'>
              Overview
            </Text>
            <OverviewTab data={data} />
          </Stack>

          <Stack space={2}>
            <Text size={2} weight='semibold'>
              Page Views
            </Text>
            <PageViewsTab
              data={getPaginatedData(data.pageViews, 'pageViews').data}
              currentPage={pagination.pageViews.current}
              totalPages={
                getPaginatedData(data.pageViews, 'pageViews').totalPages
              }
              onPageChange={page => handlePageChange('pageViews', page)}
            />
          </Stack>

          <Stack space={2}>
            <Text size={2} weight='semibold'>
              User Events
            </Text>
            <UserEventsTab
              data={getPaginatedData(data.userEvents, 'userEvents').data}
              currentPage={pagination.userEvents.current}
              totalPages={
                getPaginatedData(data.userEvents, 'userEvents').totalPages
              }
              onPageChange={page => handlePageChange('userEvents', page)}
            />
          </Stack>

          <Stack space={2}>
            <Text size={2} weight='semibold'>
              System Metrics
            </Text>
            <SystemMetricsTab
              data={getPaginatedData(data.systemMetrics, 'systemMetrics').data}
              currentPage={pagination.systemMetrics.current}
              totalPages={
                getPaginatedData(data.systemMetrics, 'systemMetrics').totalPages
              }
              onPageChange={page => handlePageChange('systemMetrics', page)}
            />
          </Stack>

          <Stack space={2}>
            <Text size={2} weight='semibold'>
              Error Logs
            </Text>
            <ErrorLogsTab
              data={getPaginatedData(data.errorLogs, 'errorLogs').data}
              currentPage={pagination.errorLogs.current}
              totalPages={
                getPaginatedData(data.errorLogs, 'errorLogs').totalPages
              }
              onPageChange={page => handlePageChange('errorLogs', page)}
            />
          </Stack>

          <Stack space={2}>
            <Text size={2} weight='semibold'>
              Performance
            </Text>
            <PerformanceTab
              data={
                getPaginatedData(data.performanceMetrics, 'performance').data
              }
              currentPage={pagination.performance.current}
              totalPages={
                getPaginatedData(data.performanceMetrics, 'performance')
                  .totalPages
              }
              onPageChange={page => handlePageChange('performance', page)}
            />
          </Stack>

          <Stack space={2}>
            <Text size={2} weight='semibold'>
              Conversions
            </Text>
            <ConversionsTab
              data={getPaginatedData(data.conversionEvents, 'conversions').data}
              currentPage={pagination.conversions.current}
              totalPages={
                getPaginatedData(data.conversionEvents, 'conversions')
                  .totalPages
              }
              onPageChange={page => handlePageChange('conversions', page)}
            />
          </Stack>
        </Stack>
      </Box>
    </div>
  );
};

export default AnalyticsDashboard;
