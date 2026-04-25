import type { DataProcessor, UserEvent } from '../core/types';

export class UserEventProcessor implements DataProcessor {
  async process(event: UserEvent): Promise<void> {
    // Basic user event processing
    const processedEvent = {
      ...event,
      processedAt: new Date(),
    };

    // Process the event (e.g., store, analyze, etc.)
    // For now, we just process and discard
    // User event processed successfully

    // In a real implementation, you would use processedEvent here
    // For example: await this.storage.store(processedEvent);

    // Use the variable to avoid TypeScript warning
    void processedEvent;
  }

  getSupportedTypes(): string[] {
    return ['user_event'];
  }

  isEnabled(): boolean {
    return true;
  }

  async validate(data: UserEvent): Promise<boolean> {
    return data.userId !== undefined && data.eventType !== undefined;
  }
}
