import type {
  MetricsStorage,
  SystemMetrics,
  PerformanceMetrics,
  UserEvent,
  PageView,
  TimeRange,
  TimeGranularity,
} from '../core/types';

export class SanityMetricsStorage
  implements
    MetricsStorage<SystemMetrics | PerformanceMetrics | UserEvent | PageView>
{
  async initialize(): Promise<void> {
    // Initialize storage
  }

  async store(
    metrics: SystemMetrics | PerformanceMetrics | UserEvent | PageView
  ): Promise<void> {
    // Store metrics
    // Metrics stored successfully

    // In a real implementation, you would store the metrics here
    // For example: await this.database.insert(metrics);

    // Use the parameter to avoid TypeScript warning
    void metrics;
  }

  async retrieve(
    timeRange: TimeRange,
    granularity: TimeGranularity
  ): Promise<(SystemMetrics | PerformanceMetrics | UserEvent | PageView)[]> {
    // Retrieve metrics
    // Metrics retrieved successfully

    // In a real implementation, you would retrieve metrics here
    // For example: return await this.database.query({ timeRange, granularity });

    // Use the parameters to avoid TypeScript warning
    void timeRange;
    void granularity;

    return [];
  }

  async aggregate(
    timeRange: TimeRange,
    granularity: TimeGranularity
  ): Promise<SystemMetrics | PerformanceMetrics | UserEvent | PageView> {
    // Aggregate metrics
    // Metrics aggregated successfully

    // In a real implementation, you would aggregate metrics here
    // For example: return await this.database.aggregate({ timeRange, granularity });

    // Use the parameters to avoid TypeScript warning
    void timeRange;
    void granularity;

    return {} as SystemMetrics;
  }

  async cleanup(retentionDays: number): Promise<void> {
    // Cleanup old metrics
    // Cleanup completed successfully

    // In a real implementation, you would cleanup old metrics here
    // For example: await this.database.deleteOlderThan(retentionDays);

    // Use the parameter to avoid TypeScript warning
    void retentionDays;
  }

  // Legacy methods for backward compatibility
  async storeSystemMetrics(metrics: SystemMetrics): Promise<void> {
    await this.store(metrics);
  }

  async storePerformanceMetrics(metrics: PerformanceMetrics): Promise<void> {
    await this.store(metrics);
  }

  async storeUserEvent(event: UserEvent): Promise<void> {
    await this.store(event);
  }

  async storePageView(pageView: PageView): Promise<void> {
    await this.store(pageView);
  }

  async queryMetrics(type: string, timeRange: TimeRange): Promise<unknown[]> {
    // Query metrics
    // Metrics queried successfully

    // In a real implementation, you would query metrics here
    // For example: return await this.database.query({ type, timeRange });

    // Use the parameters to avoid TypeScript warning
    void type;
    void timeRange;

    return [];
  }
}
