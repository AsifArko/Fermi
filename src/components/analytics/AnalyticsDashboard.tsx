'use client';

import {
  Users,
  Eye,
  TrendingUp,
  Clock,
  Activity,
  BarChart3,
  AlertTriangle,
  Server,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardData {
  metrics: {
    httpRequests: number;
    requestDuration: number[];
    activeConnections: number;
    pageViews: number;
    userEvents: number;
    errors: number;
    cpuUsage: number;
    memoryUsage: number;
  };
  analytics: {
    totalUsers: number;
    activeUsers: number;
    pageViews: number;
    conversionRate: number;
    userEngagement: {
      averageSessionDuration: number;
      bounceRate: number;
      pagesPerSession: number;
    };
    topPages: Array<{
      path: string;
      views: number;
    }>;
  };
}

export function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/overview');
      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {Array.from({ length: 8 }, (_, i) => (
          <Card
            key={`skeleton-card-${Date.now()}-${i}`}
            className='animate-pulse'
          >
            <CardHeader className='pb-2'>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            </CardHeader>
            <CardContent>
              <div className='h-8 bg-gray-200 rounded w-1/2'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <Card className='border-red-200 bg-red-50'>
        <CardContent className='pt-6'>
          <p className='text-red-600 text-center'>
            {error || 'Failed to load analytics data'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const { metrics, analytics } = dashboardData;

  return (
    <div className='space-y-4'>
      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <MetricCard
          title='Total Users'
          value={analytics.totalUsers.toLocaleString()}
          icon={Users}
          trend='+12%'
          trendUp={true}
        />
        <MetricCard
          title='Active Users'
          value={analytics.activeUsers.toLocaleString()}
          icon={Activity}
          trend='+8%'
          trendUp={true}
        />
        <MetricCard
          title='Page Views'
          value={analytics.pageViews.toLocaleString()}
          icon={Eye}
          trend='+15%'
          trendUp={true}
        />
        <MetricCard
          title='Conversion Rate'
          value={`${analytics.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          trend='+2.5%'
          trendUp={true}
        />
      </div>

      {/* System Health */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <Server className='h-4 w-4' />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span>CPU Usage</span>
              <Badge variant={getCpuStatus(metrics.cpuUsage)}>
                {getCpuValue(metrics.cpuUsage)}%
              </Badge>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span>Memory Usage</span>
              <Badge variant={getMemoryStatus(metrics.memoryUsage)}>
                {getMemoryValue(metrics.memoryUsage)}%
              </Badge>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span>Active Connections</span>
              <span className='font-mono'>
                {metrics.activeConnections || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <Clock className='h-4 w-4' />
              Session Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {Math.round(analytics.userEngagement.averageSessionDuration / 60)}
              m
            </div>
            <p className='text-xs text-muted-foreground'>
              Average session duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <BarChart3 className='h-4 w-4' />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span>Bounce Rate</span>
              <span>
                {(analytics.userEngagement.bounceRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span>Pages/Session</span>
              <span>{analytics.userEngagement.pagesPerSession.toFixed(1)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Errors */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <TrendingUp className='h-4 w-4' />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span>HTTP Requests</span>
              <span className='font-mono'>{metrics.httpRequests || 0}</span>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span>Avg Response Time</span>
              <span className='font-mono'>
                {getAvgResponseTime(metrics.requestDuration)}ms
              </span>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span>User Events</span>
              <span className='font-mono'>{metrics.userEvents || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <AlertTriangle className='h-4 w-4' />
              Errors & Issues
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span>Total Errors</span>
              <Badge variant='destructive'>{metrics.errors || 0}</Badge>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span>Error Rate</span>
              <span className='font-mono'>
                {calculateErrorRate(metrics.httpRequests, metrics.errors)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm'>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {analytics.topPages.map((page, index) => (
              <div
                key={page.path}
                className='flex items-center justify-between'
              >
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary' className='text-xs'>
                    {index + 1}
                  </Badge>
                  <span className='font-mono text-xs'>{page.path}</span>
                </div>
                <span className='text-xs text-muted-foreground'>
                  {page.views.toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  trendUp: boolean;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-xl font-bold'>{value}</div>
        <p className={`text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend} from last month
        </p>
      </CardContent>
    </Card>
  );
}

// Helper functions
function getCpuStatus(
  cpuMetric: number
): 'default' | 'secondary' | 'destructive' {
  if (!cpuMetric) return 'default';
  if (cpuMetric > 80) return 'destructive';
  if (cpuMetric > 60) return 'secondary';
  return 'default';
}

function getCpuValue(cpuMetric: number): number {
  if (!cpuMetric) return 0;
  return Math.round(cpuMetric);
}

function getMemoryStatus(
  memoryMetric: number
): 'default' | 'secondary' | 'destructive' {
  if (!memoryMetric) return 'default';
  if (memoryMetric > 80) return 'destructive';
  if (memoryMetric > 60) return 'secondary';
  return 'default';
}

function getMemoryValue(memoryMetric: number): number {
  if (!memoryMetric) return 0;
  return Math.round(memoryMetric);
}

function getAvgResponseTime(durationMetric: number[]): number {
  if (!durationMetric || durationMetric.length === 0) return 0;
  const sum = durationMetric.reduce((a, b) => a + b, 0);
  const count = durationMetric.length;
  return Math.round((sum / count) * 1000); // Convert to milliseconds
}

function calculateErrorRate(requestCount: number, errorCount: number): number {
  if (!requestCount || requestCount === 0) return 0;
  return Math.round((errorCount / requestCount) * 100);
}
