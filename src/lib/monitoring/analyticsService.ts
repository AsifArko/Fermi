import { client } from '@/sanity/lib/client';

export interface PageView {
  id: string;
  timestamp: Date;
  url: string;
  referrer?: string;
  userAgent: string;
  ipAddress: string;
  sessionId: string;
  userId?: string;
  pageLoadTime: number;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  country?: string;
  city?: string;
  isp?: string;
}

export interface UserEvent {
  id: string;
  timestamp: Date;
  eventType:
    | 'page_view'
    | 'button_click'
    | 'form_submit'
    | 'download'
    | 'purchase'
    | 'error';
  eventName: string;
  sessionId: string;
  userId?: string;
  url: string;
  metadata?: Record<string, unknown>;
  ipAddress: string;
}

export interface PerformanceMetric {
  id: string;
  timestamp: Date;
  url: string;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  sessionId: string;
  userId?: string;
}

export interface ErrorLog {
  id: string;
  timestamp: Date;
  errorType: 'client' | 'server' | 'database' | 'external';
  message: string;
  stack?: string;
  url: string;
  sessionId?: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  metadata?: Record<string, unknown>;
}

export interface SystemMetric {
  id: string;
  timestamp: Date;
  metricType: 'cpu' | 'memory' | 'disk' | 'network' | 'uptime';
  value: number;
  unit: string;
  metadata?: Record<string, unknown>;
}

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

export class AnalyticsService {
  private static instance: AnalyticsService;
  private pageViews: PageView[] = [];
  private userEvents: UserEvent[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private errorLogs: ErrorLog[] = [];
  private systemMetrics: SystemMetric[] = [];
  private sanityClient = client;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public async trackPageView(pageView: PageView): Promise<void> {
    try {
      // Add to local storage
      this.pageViews.push(pageView);

      // Keep only last 1000 page views
      if (this.pageViews.length > 1000) {
        this.pageViews = this.pageViews.slice(-1000);
      }

      // Store in Sanity if available
      if (this.sanityClient) {
        try {
          await this.sanityClient.create({
            _type: 'pageView',
            ...pageView,
          });
        } catch (error) {
          // Silently fail if Sanity is not available
        }
      }
    } catch (error) {
      // Silently fail if tracking fails
    }
  }

  public async trackUserEvent(event: UserEvent): Promise<void> {
    try {
      // Add to local storage
      this.userEvents.push(event);

      // Keep only last 1000 user events
      if (this.userEvents.length > 1000) {
        this.userEvents = this.userEvents.slice(-1000);
      }

      // Store in Sanity if available
      if (this.sanityClient) {
        try {
          await this.sanityClient.create({
            _type: 'userEvent',
            ...event,
          });
        } catch (error) {
          // Silently fail if Sanity is not available
        }
      }
    } catch (error) {
      // Silently fail if tracking fails
    }
  }

  public async trackPerformanceMetric(
    metric: PerformanceMetric
  ): Promise<void> {
    try {
      // Add to local storage
      this.performanceMetrics.push(metric);

      // Keep only last 1000 performance metrics
      if (this.performanceMetrics.length > 1000) {
        this.performanceMetrics = this.performanceMetrics.slice(-1000);
      }

      // Store in Sanity if available
      if (this.sanityClient) {
        try {
          await this.sanityClient.create({
            _type: 'performanceMetric',
            ...metric,
          });
        } catch (error) {
          // Silently fail if Sanity is not available
        }
      }
    } catch (error) {
      // Silently fail if tracking fails
    }
  }

  public async trackError(error: ErrorLog): Promise<void> {
    try {
      // Add to local storage
      this.errorLogs.push(error);

      // Keep only last 1000 error logs
      if (this.errorLogs.length > 1000) {
        this.errorLogs = this.errorLogs.slice(-1000);
      }

      // Store in Sanity if available
      if (this.sanityClient) {
        try {
          await this.sanityClient.create({
            _type: 'errorLog',
            ...error,
          });
        } catch (error) {
          // Silently fail if Sanity is not available
        }
      }
    } catch (error) {
      // Silently fail if tracking fails
    }
  }

  public async trackSystemMetric(metric: SystemMetric): Promise<void> {
    try {
      // Add to local storage
      this.systemMetrics.push(metric);

      // Keep only last 1000 system metrics
      if (this.systemMetrics.length > 1000) {
        this.systemMetrics = this.systemMetrics.slice(-1000);
      }

      // Store in Sanity if available
      if (this.sanityClient) {
        try {
          await this.sanityClient.create({
            _type: 'systemMetric',
            ...metric,
          });
        } catch (error) {
          // Silently fail if Sanity is not available
        }
      }
    } catch (error) {
      // Silently fail if tracking fails
    }
  }

  public async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      // Calculate analytics from collected data
      const totalUsers = new Set([
        ...this.pageViews.map(pv => pv.sessionId),
        ...this.userEvents.map(ue => ue.sessionId),
      ]).size;

      const activeUsers = this.pageViews
        .filter(
          pv =>
            new Date(pv.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
        )
        .map(pv => pv.sessionId)
        .filter((value, index, self) => self.indexOf(value) === index).length;

      const pageViews = this.pageViews.length;
      const conversionRate =
        (this.userEvents.filter(ue => ue.eventType === 'purchase').length /
          Math.max(pageViews, 1)) *
        100;

      // Calculate top pages
      const pageViewsByPath = this.pageViews.reduce(
        (acc, pv) => {
          acc[pv.url] = (acc[pv.url] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const topPages = Object.entries(pageViewsByPath)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Calculate user engagement
      const sessions = new Set(this.pageViews.map(pv => pv.sessionId));
      const totalSessionDuration = this.pageViews.reduce(
        (acc, pv) => acc + pv.pageLoadTime,
        0
      );
      const averageSessionDuration =
        totalSessionDuration / Math.max(sessions.size, 1);

      const bounceRate =
        (this.pageViews.filter((pv, index, arr) => {
          const nextPv = arr[index + 1];
          if (!nextPv) return true;
          return pv.sessionId !== nextPv.sessionId;
        }).length /
          Math.max(pageViews, 1)) *
        100;

      const pagesPerSession = pageViews / Math.max(sessions.size, 1);

      return {
        totalUsers,
        activeUsers,
        pageViews,
        conversionRate,
        topPages,
        userEngagement: {
          averageSessionDuration,
          bounceRate,
          pagesPerSession,
        },
      };
    } catch (error) {
      // Return default data if calculation fails
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
  }
}

export const analyticsService = AnalyticsService.getInstance();
