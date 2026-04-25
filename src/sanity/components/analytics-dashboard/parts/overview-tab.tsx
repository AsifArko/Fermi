import { Activity, Eye, TrendingUp, Users } from 'lucide-react';

import React from 'react';

import MetricCard from './metric-card';

interface AnalyticsData {
  pageViews: Record<string, unknown>[];
  userEvents: Record<string, unknown>[];
  errorLogs: Record<string, unknown>[];
  conversionEvents: Record<string, unknown>[];
}

interface OverviewTabProps {
  data: AnalyticsData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => {
  // Ensure all data properties are arrays with fallbacks
  const pageViews = Array.isArray(data.pageViews) ? data.pageViews : [];
  const userEvents = Array.isArray(data.userEvents) ? data.userEvents : [];
  const errorLogs = Array.isArray(data.errorLogs) ? data.errorLogs : [];
  const conversionEvents = Array.isArray(data.conversionEvents)
    ? data.conversionEvents
    : [];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <MetricCard
        title='Total Page Views'
        value={pageViews.length}
        description='+20.1% from last month'
        icon={<Eye className='h-4 w-4 text-muted-foreground' />}
      />

      <MetricCard
        title='Active Users'
        value={new Set(userEvents.map(e => e.sessionId).filter(Boolean)).size}
        description='Unique sessions today'
        icon={<Users className='h-4 w-4 text-muted-foreground' />}
      />

      <MetricCard
        title='System Health'
        value={
          errorLogs.filter(
            e => e.severity === 'critical' || e.severity === 'high'
          ).length
        }
        description='Critical/High errors'
        icon={<Activity className='h-4 w-4 text-muted-foreground' />}
      />

      <MetricCard
        title='Conversions'
        value={conversionEvents.length}
        description='Total conversions'
        icon={<TrendingUp className='h-4 w-4 text-muted-foreground' />}
      />
    </div>
  );
};

export default OverviewTab;
