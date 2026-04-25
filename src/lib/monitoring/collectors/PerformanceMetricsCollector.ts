import type { MetricsCollector, PerformanceMetrics } from '../core/types';

export class PerformanceMetricsCollector
  implements MetricsCollector<PerformanceMetrics>
{
  private isCollecting = false;
  private lastCollection: PerformanceMetrics | null = null;
  private enabled = true;
  private collectionInterval = 5000; // 5 seconds

  async collect(): Promise<PerformanceMetrics> {
    // Basic performance metrics collection
    const metrics: PerformanceMetrics = {
      timestamp: new Date(),
      url: window.location.href,
      sessionId: 'session-' + Date.now(),
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      timeToInteractive: 0,
      totalBlockingTime: 0,
      speedIndex: 0,
      timeToFirstByte: 0,
      domContentLoaded: 0,
      windowLoad: 0,
      resourceCount: 0,
      resourceSize: 0,
    };

    this.lastCollection = metrics;
    return metrics;
  }

  async start(): Promise<void> {
    this.isCollecting = true;
  }

  async stop(): Promise<void> {
    this.isCollecting = false;
  }

  isActive(): boolean {
    return this.isCollecting;
  }

  getLastCollection(): PerformanceMetrics | null {
    return this.lastCollection;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getCollectionInterval(): number {
    return this.collectionInterval;
  }
}
