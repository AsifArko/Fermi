import type { DataProcessor, PageView } from '../core/types';

export class PageViewProcessor implements DataProcessor {
  async process(event: PageView): Promise<void> {
    // Basic page view processing
    const processedPageView = {
      ...event,
      processedAt: new Date(),
    };

    // Process the page view (e.g., store, analyze, etc.)
    // For now, we just process and discard
    // Page view processed successfully

    // In a real implementation, you would use processedPageView here
    // For example: await this.storage.store(processedPageView);

    // Use the variable to avoid TypeScript warning
    void processedPageView;
  }

  getSupportedTypes(): string[] {
    return ['page_view'];
  }

  isEnabled(): boolean {
    return true;
  }

  async validate(data: PageView): Promise<boolean> {
    return data.url !== undefined && data.sessionId !== undefined;
  }
}
