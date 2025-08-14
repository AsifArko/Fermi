# Phase 5: Monitoring & Analytics Integration

## Objectives

- Implement comprehensive website monitoring
- Create custom analytics dashboard
- Integrate monitoring tools with Sanity Studio
- Build real-time performance tracking
- Implement user behavior analytics

## Current State

- No monitoring or analytics tools
- Basic health check endpoint planned
- No performance tracking
- No user analytics

## Implementation Plan

### Step 1: Core Monitoring Infrastructure

#### A. Install Monitoring Dependencies

```bash
npm install prometheus-client
npm install winston
npm install winston-daily-rotate-file
npm install express-rate-limit
npm install helmet
npm install compression
npm install cors
```

#### B. Create Monitoring Service

```typescript
// src/lib/monitoring/monitoringService.ts
import { register, Counter, Histogram, Gauge } from 'prometheus-client';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export class MonitoringService {
  private static instance: MonitoringService;

  // Prometheus metrics
  public readonly httpRequestsTotal: Counter;
  public readonly httpRequestDuration: Histogram;
  public readonly activeConnections: Gauge;
  public readonly memoryUsage: Gauge;
  public readonly cpuUsage: Gauge;

  // Winston logger
  public readonly logger: winston.Logger;

  private constructor() {
    // Initialize Prometheus metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
    });

    this.memoryUsage = new Gauge({
      name: 'memory_usage_bytes',
      help: 'Memory usage in bytes',
      labelNames: ['type'],
    });

    this.cpuUsage = new Gauge({
      name: 'cpu_usage_percent',
      help: 'CPU usage percentage',
    });

    // Initialize Winston logger
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });

    // Start monitoring
    this.startSystemMonitoring();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private startSystemMonitoring(): void {
    // Monitor system resources every 30 seconds
    setInterval(() => {
      const memUsage = process.memoryUsage();
      this.memoryUsage.set({ type: 'rss' }, memUsage.rss);
      this.memoryUsage.set({ type: 'heapUsed' }, memUsage.heapUsed);
      this.memoryUsage.set({ type: 'heapTotal' }, memUsage.heapTotal);

      // CPU usage monitoring (simplified)
      const startUsage = process.cpuUsage();
      setTimeout(() => {
        const endUsage = process.cpuUsage(startUsage);
        const cpuPercent = (endUsage.user + endUsage.system) / 1000000;
        this.cpuUsage.set(cpuPercent);
      }, 100);
    }, 30000);
  }

  public recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number
  ): void {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
    this.httpRequestDuration.observe({ method, route }, duration);

    this.logger.info('HTTP Request', {
      method,
      route,
      statusCode,
      duration,
      timestamp: new Date().toISOString(),
    });
  }

  public getMetrics(): string {
    return register.metrics();
  }
}
```

### Step 2: Performance Monitoring Middleware

#### A. Create Performance Middleware

```typescript
// src/middleware/performance.ts
import { NextRequest, NextResponse } from 'next/server';
import { MonitoringService } from '@/lib/monitoring/monitoringService';

export function performanceMiddleware(request: NextRequest) {
  const startTime = Date.now();
  const monitoring = MonitoringService.getInstance();

  // Record request start
  monitoring.activeConnections.inc();

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  }).then(response => {
    // Record request completion
    const duration = (Date.now() - startTime) / 1000;
    const method = request.method;
    const route = request.nextUrl.pathname;
    const statusCode = response.status;

    monitoring.recordHttpRequest(method, route, statusCode, duration);
    monitoring.activeConnections.dec();

    return response;
  });
}
```

#### B. Update Next.js Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { performanceMiddleware } from './middleware/performance';

export function middleware(request: NextRequest) {
  // Apply performance monitoring
  return performanceMiddleware(request);
}

export const config = {
  matcher: ['/((?!api/health|_next/static|_next/image|favicon.ico).*)'],
};
```

### Step 3: Analytics Dashboard API

#### A. Create Analytics Endpoints

```typescript
// src/app/api/analytics/overview/route.ts
import { NextResponse } from 'next/server';
import { MonitoringService } from '@/lib/monitoring/monitoringService';
import { getAnalyticsData } from '@/lib/analytics/analyticsService';

export async function GET() {
  try {
    const monitoring = MonitoringService.getInstance();
    const analytics = await getAnalyticsData();

    const overview = {
      timestamp: new Date().toISOString(),
      metrics: {
        httpRequests: await monitoring.httpRequestsTotal.get(),
        requestDuration: await monitoring.httpRequestDuration.get(),
        activeConnections: await monitoring.activeConnections.get(),
        memoryUsage: await monitoring.memoryUsage.get(),
        cpuUsage: await monitoring.cpuUsage.get(),
      },
      analytics: {
        totalUsers: analytics.totalUsers,
        activeUsers: analytics.activeUsers,
        pageViews: analytics.pageViews,
        conversionRate: analytics.conversionRate,
        topPages: analytics.topPages,
        userEngagement: analytics.userEngagement,
      },
    };

    return NextResponse.json(overview);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
```

#### B. Analytics Service

```typescript
// src/lib/analytics/analyticsService.ts
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
  conversionRate: number;
  topPages: Array<{ path: string; views: number }>;
  userEngagement: {
    averageSessionDuration: number;
    bounceRate: number;
    pagesPerSession: number;
  };
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    // Fetch data from Sanity
    const [userStats, pageStats, engagementStats] = await Promise.all([
      getUserStats(),
      getPageStats(),
      getEngagementStats(),
    ]);

    return {
      totalUsers: userStats.total,
      activeUsers: userStats.active,
      pageViews: pageStats.totalViews,
      conversionRate: calculateConversionRate(userStats, pageStats),
      topPages: pageStats.topPages,
      userEngagement: engagementStats,
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return getDefaultAnalyticsData();
  }
}

async function getUserStats() {
  const query = groq`
    {
      "total": count(*[_type == "student"]),
      "active": count(*[_type == "student" && defined(lastActive) && lastActive > now() - 30*24*60*60*1000])
    }
  `;

  return await client.fetch(query);
}

async function getPageStats() {
  const query = groq`
    {
      "totalViews": count(*[_type == "pageView"]),
      "topPages": *[_type == "pageView"] | order(views desc)[0...10] {
        path,
        views
      }
    }
  `;

  return await client.fetch(query);
}

async function getEngagementStats() {
  // This would be calculated from actual user behavior data
  return {
    averageSessionDuration: 300, // 5 minutes
    bounceRate: 0.35, // 35%
    pagesPerSession: 2.5,
  };
}

function calculateConversionRate(userStats: any, pageStats: any): number {
  if (userStats.total === 0) return 0;
  return (userStats.active / userStats.total) * 100;
}

function getDefaultAnalyticsData(): AnalyticsData {
  return {
    totalUsers: 0,
    activeUsers: 0,
    pageViews: 0,
    conversionRate: 0,
    topPages: [],
    userEngagement: {
      averageSessionDuration: 0,
      bounceRate: 0,
      pagesPerSession: 0,
    },
  };
}
```

### Step 4: Real-time Analytics Dashboard

#### A. Create Dashboard Component

```typescript
// src/components/analytics/AnalyticsDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Eye,
  TrendingUp,
  Clock,
  Activity,
  BarChart3
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
  conversionRate: number;
  topPages: Array<{ path: string; views: number }>;
  userEngagement: {
    averageSessionDuration: number;
    bounceRate: number;
    pagesPerSession: number;
  };
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
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
      setAnalytics(data.analytics);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600 text-center">
            {error || 'Failed to load analytics data'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          icon={Users}
          trend="+12%"
          trendUp={true}
        />
        <MetricCard
          title="Active Users"
          value={analytics.activeUsers.toLocaleString()}
          icon={Activity}
          trend="+8%"
          trendUp={true}
        />
        <MetricCard
          title="Page Views"
          value={analytics.pageViews.toLocaleString()}
          icon={Eye}
          trend="+15%"
          trendUp={true}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${analytics.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          trend="+2.5%"
          trendUp={true}
        />
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(analytics.userEngagement.averageSessionDuration / 60)}m
            </div>
            <p className="text-sm text-muted-foreground">
              Average session duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(analytics.userEngagement.bounceRate * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">
              Users who left after one page
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Pages per Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics.userEngagement.pagesPerSession.toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">
              Average pages viewed per session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <span className="font-mono text-sm">{page.path}</span>
                </div>
                <span className="text-sm text-muted-foreground">
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

function MetricCard({ title, value, icon: Icon, trend, trendUp }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend} from last month
        </p>
      </CardContent>
    </Card>
  );
}
```

### Step 5: Sanity Studio Integration

#### A. Create Analytics Schema

```typescript
// src/sanity/schemaTypes/analyticsType.ts
export default {
  name: 'analytics',
  title: 'Analytics',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'type',
      title: 'Analytics Type',
      type: 'string',
      options: {
        list: [
          { title: 'Page View', value: 'pageView' },
          { title: 'User Action', value: 'userAction' },
          { title: 'Performance Metric', value: 'performanceMetric' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'data',
      title: 'Analytics Data',
      type: 'object',
      fields: [
        {
          name: 'path',
          title: 'Page Path',
          type: 'string',
        },
        {
          name: 'views',
          title: 'View Count',
          type: 'number',
        },
        {
          name: 'timestamp',
          title: 'Timestamp',
          type: 'datetime',
        },
        {
          name: 'userAgent',
          title: 'User Agent',
          type: 'string',
        },
        {
          name: 'ipAddress',
          title: 'IP Address',
          type: 'string',
        },
      ],
    },
    {
      name: 'metadata',
      title: 'Additional Metadata',
      type: 'object',
      fields: [
        {
          name: 'sessionId',
          title: 'Session ID',
          type: 'string',
        },
        {
          name: 'userId',
          title: 'User ID',
          type: 'string',
        },
        {
          name: 'referrer',
          title: 'Referrer',
          type: 'url',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      timestamp: 'data.timestamp',
    },
    prepare({ title, type, timestamp }: any) {
      return {
        title: title || `${type} Analytics`,
        subtitle: timestamp
          ? new Date(timestamp).toLocaleString()
          : 'No timestamp',
      };
    },
  },
};
```

#### B. Create Custom Studio Tool

```typescript
// src/sanity/plugins/components/AnalyticsTool.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AnalyticsTool() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [metrics, setMetrics] = useState(['pageViews', 'users', 'engagement']);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/overview');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, metrics]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Display analytics data */}
        </div>
      )}
    </div>
  );
}
```

## Expected Outcomes

- **Real-time Monitoring**: Live performance and health monitoring
- **Analytics Dashboard**: Comprehensive user behavior insights
- **Sanity Integration**: Analytics data visible in CMS
- **Performance Tracking**: Detailed performance metrics
- **User Insights**: Understanding user behavior patterns

## Success Criteria

- [ ] Monitoring service operational
- [ ] Real-time metrics collection
- [ ] Analytics dashboard functional
- [ ] Sanity Studio integration complete
- [ ] Performance tracking implemented
- [ ] User analytics working
- [ ] Dashboard accessible in Sanity Studio
