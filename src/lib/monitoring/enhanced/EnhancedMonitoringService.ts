import { EventEmitter } from 'events';

import { SystemMetricsCollector } from '../collectors/SystemMetricsCollector';
import { PerformanceMetricsCollector } from '../collectors/PerformanceMetricsCollector';

import { PageViewProcessor } from '../processors/PageViewProcessor';
import { UserEventProcessor } from '../processors/UserEventProcessor';
import { PerformanceProcessor } from '../processors/PerformanceProcessor';

import { WebSocketStreamManager } from '../realtime/WebSocketStreamManager';
import { SanityMetricsStorage } from '../storage/SanityMetricsStorage';
import { MonitoringConfigManager } from '../config/MonitoringConfigManager';

import type {
  SystemMetrics,
  PerformanceMetrics,
  UserEvent,
  PageView,
  MetricsCollector,
  DataProcessor,
  TimeRange,
  TimeGranularity,
  TrafficMetrics,
  MonitoringConfig,
  MonitoringEventMap,
  EventHandler,
} from '../core/types';

export class EnhancedMonitoringService extends EventEmitter {
  private static instance: EnhancedMonitoringService;

  private readonly config: MonitoringConfigManager;
  private readonly collectors: Map<string, MetricsCollector<unknown>>;
  private readonly processors: Map<string, DataProcessor>;
  private readonly storage: SanityMetricsStorage;
  private readonly streamManager: WebSocketStreamManager;

  private isRunning = false;
  private collectionIntervals: Map<string, NodeJS.Timeout> = new Map();
  private lastMetrics: Map<string, unknown> = new Map();

  private constructor() {
    super();

    this.config = MonitoringConfigManager.getInstance();
    this.collectors = new Map();
    this.processors = new Map();
    this.storage = new SanityMetricsStorage();
    this.streamManager = new WebSocketStreamManager(
      this.config.getWebSocketConfig()
    );

    this.initializeCollectors();
    this.initializeProcessors();
    this.setupEventHandlers();
  }

  public static getInstance(): EnhancedMonitoringService {
    if (!EnhancedMonitoringService.instance) {
      EnhancedMonitoringService.instance = new EnhancedMonitoringService();
    }
    return EnhancedMonitoringService.instance;
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    try {
      await this.storage.initialize();
      await this.streamManager.start();

      this.startCollectionIntervals();
      this.isRunning = true;

      this.emit('service_started', { timestamp: new Date() });
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      this.stopCollectionIntervals();
      await this.streamManager.stop();
      this.isRunning = false;

      this.emit('service_stopped', { timestamp: new Date() });
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public async collectSystemMetrics(): Promise<SystemMetrics> {
    try {
      const collector = this.collectors.get(
        'system'
      ) as MetricsCollector<SystemMetrics>;
      if (!collector) {
        throw new Error('System metrics collector not found');
      }

      const metrics = await collector.collect();
      this.lastMetrics.set('system', metrics);

      await this.storage.storeSystemMetrics(metrics);
      this.emit('metrics_collected', metrics);

      // Broadcast to real-time clients
      this.streamManager.broadcast({
        type: 'system_metrics',
        data: metrics,
        timestamp: Date.now(),
      });

      return metrics;
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public async collectPerformanceMetrics(): Promise<PerformanceMetrics[]> {
    try {
      const collector = this.collectors.get('performance') as MetricsCollector<
        PerformanceMetrics[]
      >;
      if (!collector) {
        throw new Error('Performance metrics collector not found');
      }

      const metrics = await collector.collect();
      this.lastMetrics.set('performance', metrics);

      await Promise.all(metrics.map(metric => this.storage.store(metric)));
      this.emit('metrics_collected', metrics);

      return metrics;
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public async processUserEvent(event: UserEvent): Promise<void> {
    try {
      const processor = this.processors.get('userEvent');
      if (!processor) {
        throw new Error('User event processor not found');
      }

      await processor.process(event);
      await this.storage.store(event);

      this.emit('user_event', event);

      // Broadcast to real-time clients
      this.streamManager.broadcast({
        type: 'user_event',
        data: event,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public async processPageView(pageView: PageView): Promise<void> {
    try {
      const processor = this.processors.get('pageView');
      if (!processor) {
        throw new Error('Page view processor not found');
      }

      await processor.process(pageView);
      await this.storage.store(pageView);

      this.emit('page_view', pageView);

      // Broadcast to real-time clients
      this.streamManager.broadcast({
        type: 'page_view',
        data: pageView,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public async getSystemMetrics(
    timeRange: TimeRange = '1h',
    granularity: TimeGranularity = '5m'
  ): Promise<SystemMetrics[]> {
    try {
      return (await this.storage.retrieve(
        timeRange,
        granularity
      )) as SystemMetrics[];
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public async getPerformanceMetrics(
    timeRange: TimeRange = '1h',
    granularity: TimeGranularity = '5m'
  ): Promise<PerformanceMetrics[]> {
    try {
      return (await this.storage.retrieve(
        timeRange,
        granularity
      )) as PerformanceMetrics[];
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public async getTrafficMetrics(): Promise<TrafficMetrics[]> {
    try {
      // TODO: Implement TrafficMetrics collection and storage
      // For now, return empty array as TrafficMetrics is not fully implemented
      return [];
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public async getUserMetrics(
    timeRange: TimeRange = '24h',
    granularity: TimeGranularity = '1h'
  ): Promise<UserEvent[]> {
    try {
      return (await this.storage.retrieve(
        timeRange,
        granularity
      )) as UserEvent[];
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public async getAllMetrics(
    timeRange: TimeRange = '1h',
    granularity: TimeGranularity = '5m'
  ): Promise<Record<string, unknown[]>> {
    try {
      const [system, performance, traffic, users] = await Promise.all([
        this.getSystemMetrics(timeRange, granularity),
        this.getPerformanceMetrics(timeRange, granularity),
        this.getTrafficMetrics(),
        this.getUserMetrics(timeRange, granularity),
      ]);

      return {
        system,
        performance,
        traffic,
        users,
      };
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public getLastMetrics(type: string): unknown | null {
    return this.lastMetrics.get(type) || null;
  }

  public getConfiguration(): MonitoringConfig {
    return this.config.getConfig();
  }

  public async updateConfiguration(
    updates: Partial<MonitoringConfig>
  ): Promise<void> {
    try {
      await this.config.update(updates);
      this.emit('configuration_changed', updates);

      // Restart collection intervals if needed
      if (this.isRunning) {
        this.stopCollectionIntervals();
        this.startCollectionIntervals();
      }
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }

  public getConnectionCount(): number {
    return this.streamManager.getConnectionCount();
  }

  public isServiceRunning(): boolean {
    return this.isRunning;
  }

  private initializeCollectors(): void {
    // System metrics are always enabled when monitoring is enabled
    this.collectors.set(
      'system',
      new SystemMetricsCollector({
        enabled: this.config.getSystemMetricsConfig().enabled,
        interval: this.config.getSystemMetricsConfig().interval,
        trackCPU: true,
        trackMemory: true,
        trackDisk: true,
        trackNetwork: true,
        trackProcess: true,
        cpuSamplingInterval: 100,
        memorySamplingInterval: 100,
        diskSamplingInterval: 100,
        networkSamplingInterval: 100,
      })
    );

    if (this.config.isFeatureEnabled('performanceTracking')) {
      this.collectors.set('performance', new PerformanceMetricsCollector());
    }
  }

  private initializeProcessors(): void {
    if (this.config.isFeatureEnabled('userAnalytics')) {
      this.processors.set('userEvent', new UserEventProcessor());
      this.processors.set('pageView', new PageViewProcessor());
    }

    if (this.config.isFeatureEnabled('performanceTracking')) {
      this.processors.set('performance', new PerformanceProcessor());
    }
  }

  private setupEventHandlers(): void {
    // Event handling setup - simplified for now
    // TODO: Implement proper event handling when storage and stream manager support events
  }

  private startCollectionIntervals(): void {
    this.collectors.forEach((collector, type) => {
      const interval = collector.getCollectionInterval();
      if (interval > 0) {
        const timeout = setInterval(async () => {
          try {
            if (collector.isEnabled()) {
              await collector.collect();
            }
          } catch (error) {
            this.emit('error_occurred', error as Error);
          }
        }, interval);

        this.collectionIntervals.set(type, timeout);
      }
    });
  }

  private stopCollectionIntervals(): void {
    this.collectionIntervals.forEach(timeout => {
      clearInterval(timeout);
    });
    this.collectionIntervals.clear();
  }

  // Event handling with proper typing
  public on<K extends keyof MonitoringEventMap>(
    event: K,
    listener: EventHandler<MonitoringEventMap[K][0]>
  ): this {
    return super.on(event, listener);
  }

  public off<K extends keyof MonitoringEventMap>(
    event: K,
    listener: EventHandler<MonitoringEventMap[K][0]>
  ): this {
    return super.off(event, listener);
  }

  public emit<K extends keyof MonitoringEventMap>(
    event: K,
    ...args: MonitoringEventMap[K]
  ): boolean {
    return super.emit(event, ...args);
  }

  // Cleanup method
  public async cleanup(): Promise<void> {
    try {
      await this.stop();
      this.removeAllListeners();
      await this.storage.cleanup(this.config.getConfig().retentionDays);
    } catch (error) {
      this.emit('error_occurred', error as Error);
      throw error;
    }
  }
}
