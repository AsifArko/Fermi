# Phase 6: Sanity Studio Enhancements

## Objectives

- Integrate monitoring and analytics tools into Sanity Studio
- Create custom list type applications for analytics
- Build monitoring dashboard within Sanity
- Implement custom studio tools for data management
- Create user-friendly analytics interface for content managers

## Current State

- Basic Sanity Studio setup
- Standard content management
- No custom tools or analytics integration
- Limited monitoring capabilities

## Implementation Plan

### Step 1: Custom Sanity Studio Tools

#### A. Create Analytics Dashboard Tool

```typescript
// src/sanity/plugins/tools/analyticsDashboard.ts
import { defineTool } from 'sanity';

export const analyticsDashboard = defineTool({
  name: 'analytics-dashboard',
  title: 'Analytics Dashboard',
  icon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  component: AnalyticsDashboardComponent,
});
```

#### B. Analytics Dashboard Component

```typescript
// src/sanity/plugins/components/AnalyticsDashboardComponent.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Eye,
  TrendingUp,
  Clock,
  Activity,
  BarChart3,
  RefreshCw,
  Calendar,
  Globe,
  Smartphone
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
  conversionRate: number;
  topPages: Array<{ path: string; views: number; change: number }>;
  userEngagement: {
    averageSessionDuration: number;
    bounceRate: number;
    pagesPerSession: number;
  };
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geographicData: Array<{ country: string; users: number; percentage: number }>;
}

export function AnalyticsDashboardComponent() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/overview');
      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">Failed to load analytics data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your website performance and user behavior</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          icon={Users}
          trend={"+12%"}
          trendUp={true}
          description="Total registered users"
        />
        <MetricCard
          title="Active Users"
          value={analytics.activeUsers.toLocaleString()}
          icon={Activity}
          trend={"+8%"}
          trendUp={true}
          description="Users active in last 30 days"
        />
        <MetricCard
          title="Page Views"
          value={analytics.pageViews.toLocaleString()}
          icon={Eye}
          trend={"+15%"}
          trendUp={true}
          description="Total page views"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${analytics.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          trend={"+2.5%"}
          trendUp={true}
          description="User conversion rate"
        />
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Session Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(analytics.userEngagement.averageSessionDuration / 60)}m
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Average session duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {(analytics.userEngagement.bounceRate * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Users who left after one page
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Pages per Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {analytics.userEngagement.pagesPerSession.toFixed(1)}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Average pages viewed per session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Device and Geographic Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-indigo-600" />
              Device Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Desktop</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(analytics.deviceStats.desktop / analytics.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analytics.deviceStats.desktop.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mobile</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(analytics.deviceStats.mobile / analytics.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analytics.deviceStats.mobile.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tablet</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(analytics.deviceStats.tablet / analytics.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analytics.deviceStats.tablet.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-600" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.geographicData.slice(0, 5).map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span className="text-sm font-medium">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{country.percentage.toFixed(1)}%</span>
                    <span className="text-sm font-medium">{country.users.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Pages</CardTitle>
          <p className="text-sm text-gray-600">Most viewed pages in the selected time period</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant={index < 3 ? "default" : "secondary"} className="w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <span className="font-mono text-sm text-gray-900">{page.path}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{page.views.toLocaleString()} views</span>
                      <span className={`text-xs ${page.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {page.change >= 0 ? '+' : ''}{page.change}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
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
  description: string;
}

function MetricCard({ title, value, icon: Icon, trend, trendUp, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
          <span className="text-xs text-gray-500">from last period</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
```

### Step 2: Monitoring Dashboard Tool

#### A. Create Monitoring Tool

```typescript
// src/sanity/plugins/tools/monitoringDashboard.ts
import { defineTool } from 'sanity';

export const monitoringDashboard = defineTool({
  name: 'monitoring-dashboard',
  title: 'System Monitoring',
  icon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  component: MonitoringDashboardComponent,
});
```

#### B. Monitoring Dashboard Component

```typescript
// src/sanity/plugins/components/MonitoringDashboardComponent.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Server,
  Cpu,
  Memory,
  HardDrive,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SystemMetrics {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    incoming: number;
    outgoing: number;
    connections: number;
  };
  services: Array<{
    name: string;
    status: 'running' | 'stopped' | 'error';
    uptime: number;
    lastCheck: string;
  }>;
}

export function MonitoringDashboardComponent() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) throw new Error('Failed to fetch metrics');

      const data = await response.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">Failed to load system metrics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time system health and performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant={metrics.status === 'healthy' ? 'default' : 'destructive'}
            className="flex items-center gap-2"
          >
            {getStatusIcon(metrics.status)}
            {metrics.status.charAt(0).toUpperCase() + metrics.status.slice(1)}
          </Badge>
          <div className="text-sm text-gray-600">
            Uptime: {formatUptime(metrics.uptime)}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.cpu.usage.toFixed(1)}%
            </div>
            <Progress value={metrics.cpu.usage} className="mt-2" />
            <p className="text-xs text-gray-500 mt-2">
              {metrics.cpu.cores} cores • {metrics.cpu.temperature}°C
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Memory Usage</CardTitle>
            <Memory className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.memory.percentage.toFixed(1)}%
            </div>
            <Progress value={metrics.memory.percentage} className="mt-2" />
            <p className="text-xs text-gray-500 mt-2">
              {formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.disk.percentage.toFixed(1)}%
            </div>
            <Progress value={metrics.disk.percentage} className="mt-2" />
            <p className="text-xs text-gray-500 mt-2">
              {formatBytes(metrics.disk.used)} / {formatBytes(metrics.disk.total)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Network</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.network.connections}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formatBytes(metrics.network.incoming)} in • {formatBytes(metrics.network.outgoing)} out
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          <p className="text-sm text-gray-600">Current status of all system services</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <span className="font-medium text-gray-900">{service.name}</span>
                    <p className="text-sm text-gray-500">
                      Uptime: {formatUptime(service.uptime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={service.status === 'running' ? 'default' : 'destructive'}
                  >
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Last check: {new Date(service.lastCheck).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 3: Integrate Tools into Sanity Studio

#### A. Update Sanity Configuration

```typescript
// src/sanity.config.ts
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { analyticsDashboard } from './plugins/tools/analyticsDashboard';
import { monitoringDashboard } from './plugins/tools/monitoringDashboard';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Fermi CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    deskTool({
      structure: S =>
        S.list()
          .title('Content')
          .items([
            // Content items
            S.listItem().title('Courses').child(S.documentTypeList('course')),
            S.listItem().title('Lessons').child(S.documentTypeList('lesson')),
            S.listItem().title('Students').child(S.documentTypeList('student')),
            S.listItem()
              .title('Enrollments')
              .child(S.documentTypeList('enrollment')),

            // Divider
            S.divider(),

            // Analytics and Monitoring
            S.listItem().title('Analytics Dashboard').child(analyticsDashboard),
            S.listItem().title('System Monitoring').child(monitoringDashboard),
          ]),
    }),
    visionTool(),
    analyticsDashboard,
    monitoringDashboard,
  ],

  schema: {
    types: schemaTypes,
  },

  tools: [analyticsDashboard, monitoringDashboard],
});
```

### Step 4: Create Custom List Views

#### A. Analytics List View

```typescript
// src/sanity/plugins/components/AnalyticsListView.tsx
import React from 'react';
import { useClient } from 'sanity';
import { groq } from 'next-sanity';

export function AnalyticsListView() {
  const client = useClient();
  const [analytics, setAnalytics] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const query = groq`*[_type == "analytics"] | order(data.timestamp desc) {
          _id,
          title,
          type,
          "path": data.path,
          "views": data.views,
          "timestamp": data.timestamp
        }`;

        const result = await client.fetch(query);
        setAnalytics(result);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [client]);

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Analytics Data</h2>
      <div className="space-y-2">
        {analytics.map((item: any) => (
          <div key={item._id} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.path}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">{item.views} views</div>
                <div className="text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Expected Outcomes

- **Integrated Analytics**: Analytics dashboard within Sanity Studio
- **System Monitoring**: Real-time system health monitoring
- **Custom Tools**: Specialized tools for content managers
- **Data Visualization**: Clear presentation of analytics data
- **User Experience**: Intuitive interface for non-technical users

## Success Criteria

- [ ] Analytics dashboard integrated into Sanity Studio
- [ ] Monitoring dashboard accessible in studio
- [ ] Custom tools working properly
- [ ] Data visualization clear and useful
- [ ] User interface intuitive and responsive
- [ ] Real-time data updates working
- [ ] All tools accessible from studio navigation
