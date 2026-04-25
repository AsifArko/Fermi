import type { DataProcessor, PerformanceMetrics } from '../core/types';

export class PerformanceProcessor implements DataProcessor {
  async process(event: PerformanceMetrics): Promise<void> {
    // Basic performance metrics processing
    const processedMetrics = {
      ...event,
      processedAt: new Date(),
    };

    // Process the performance metrics (e.g., store, analyze, etc.)
    // For now, we just process and discard
    // Performance metrics processed successfully

    // In a real implementation, you would use processedMetrics here
    // For example: await this.storage.store(processedMetrics);

    // Use the variable to avoid TypeScript warning
    void processedMetrics;
  }

  getSupportedTypes(): string[] {
    return ['performance_metrics'];
  }

  isEnabled(): boolean {
    return true;
  }

  async validate(data: PerformanceMetrics): Promise<boolean> {
    return data.url !== undefined && data.sessionId !== undefined;
  }
}
