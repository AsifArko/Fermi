// Enhanced Monitoring System Core Types
// Strict TypeScript typing with comprehensive interfaces

export interface MonitoringConfig {
  enabled: boolean;
  sampleRate: number;
  retentionDays: number;
  privacyMode: boolean;
  geolocationEnabled: boolean;
  performanceTracking: boolean;
  errorTracking: boolean;
  userAnalytics: boolean;
  realTimeUpdates: boolean;
  alerting: boolean;
  dataExport: boolean;
}

export interface SystemMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    load: number;
    cores: number;
    temperature?: number;
    frequency?: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
    arrayBuffers: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    ioRead: number;
    ioWrite: number;
    readLatency: number;
    writeLatency: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connections: number;
    latency: number;
    packetLoss: number;
    bandwidth: number;
  };
  process: {
    pid: number;
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    threadCount: number;
  };
}

export interface PerformanceMetrics {
  timestamp: Date;
  url: string;
  sessionId: string;
  userId?: string;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  speedIndex: number;
  timeToFirstByte: number;
  domContentLoaded: number;
  windowLoad: number;
  resourceCount: number;
  resourceSize: number;
}

export interface UserEvent {
  id: string;
  timestamp: Date;
  eventType: UserEventType;
  eventName: string;
  sessionId: string;
  userId?: string;
  url: string;
  referrer?: string;
  userAgent: string;
  ipAddress: string;
  deviceType: DeviceType;
  browser: BrowserInfo;
  os: OSInfo;
  location?: GeographicLocation;
  metadata?: Record<string, unknown>;
  performance?: Partial<PerformanceMetrics>;
}

export type UserEventType =
  | 'page_view'
  | 'button_click'
  | 'form_submit'
  | 'form_field_change'
  | 'download'
  | 'purchase'
  | 'error'
  | 'scroll'
  | 'hover'
  | 'focus'
  | 'blur'
  | 'keypress'
  | 'mouse_move'
  | 'touch_start'
  | 'touch_end'
  | 'gesture'
  | 'video_play'
  | 'video_pause'
  | 'video_complete'
  | 'custom';

export type DeviceType =
  | 'desktop'
  | 'mobile'
  | 'tablet'
  | 'smart_tv'
  | 'wearable';

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  engineVersion: string;
  isPrivate: boolean;
  language: string;
  languages: string[];
  cookieEnabled: boolean;
  doNotTrack: boolean;
  onLine: boolean;
  platform: string;
  userAgent: string;
}

export interface OSInfo {
  name: string;
  version: string;
  platform: string;
  architecture: string;
  language: string;
  timezone: string;
  timezoneOffset: number;
}

export interface GeographicLocation {
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  organization: string;
  asn: string;
}

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
  deviceType: DeviceType;
  browser: BrowserInfo;
  os: OSInfo;
  location?: GeographicLocation;
  performance: Partial<PerformanceMetrics>;
  metadata?: Record<string, unknown>;
}

export interface SystemAlert {
  id: string;
  timestamp: Date;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  source: string;
  metadata?: Record<string, unknown>;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export type AlertCategory =
  | 'system'
  | 'performance'
  | 'security'
  | 'user_experience'
  | 'business'
  | 'infrastructure'
  | 'application'
  | 'database'
  | 'network'
  | 'storage';

export interface TrafficMetrics {
  timestamp: Date;
  totalRequests: number;
  uniqueVisitors: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  averageSessionDuration: number;
  pagesPerSession: number;
  topPages: Array<{ url: string; views: number; uniqueViews: number }>;
  topReferrers: Array<{ referrer: string; visits: number; percentage: number }>;
  deviceBreakdown: Record<DeviceType, { count: number; percentage: number }>;
  browserBreakdown: Record<string, { count: number; percentage: number }>;
  osBreakdown: Record<string, { count: number; percentage: number }>;
  geographicBreakdown: Record<string, { count: number; percentage: number }>;
  hourlyBreakdown: Array<{ hour: number; requests: number; visitors: number }>;
  dailyBreakdown: Array<{ date: string; requests: number; visitors: number }>;
}

export interface ConversionMetrics {
  timestamp: Date;
  totalConversions: number;
  conversionRate: number;
  revenue: number;
  averageOrderValue: number;
  topConversionPaths: Array<{
    path: string;
    conversions: number;
    rate: number;
  }>;
  conversionFunnel: Array<{
    stage: string;
    visitors: number;
    conversionRate: number;
  }>;
  timeToConversion: number;
  conversionByDevice: Record<DeviceType, { conversions: number; rate: number }>;
  conversionBySource: Record<string, { conversions: number; rate: number }>;
}

export interface AnalyticsInsight {
  id: string;
  timestamp: Date;
  type: InsightType;
  title: string;
  description: string;
  severity: InsightSeverity;
  confidence: number;
  data: Record<string, unknown>;
  recommendations: string[];
  tags: string[];
  expiresAt?: Date;
}

export type InsightType =
  | 'performance_optimization'
  | 'user_behavior'
  | 'conversion_optimization'
  | 'technical_issue'
  | 'trend_analysis'
  | 'anomaly_detection'
  | 'opportunity_identification'
  | 'risk_assessment';

export type InsightSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface MetricsCollector<T> {
  collect(): Promise<T>;
  getLastCollection(): T | null;
  isEnabled(): boolean;
  getCollectionInterval(): number;
}

export interface MetricsStorage<T> {
  store(metrics: T): Promise<void>;
  retrieve(timeRange: TimeRange, granularity: TimeGranularity): Promise<T[]>;
  aggregate(timeRange: TimeRange, granularity: TimeGranularity): Promise<T>;
  cleanup(retentionDays: number): Promise<void>;
}

export interface DataProcessor {
  process(event: UserEvent | PageView | PerformanceMetrics): Promise<void>;
  getSupportedTypes(): string[];
  isEnabled(): boolean;
}

export interface StreamManager {
  addConnection(connection: WebSocket): void;
  removeConnection(connection: WebSocket): void;
  broadcast(data: unknown): void;
  getConnectionCount(): number;
}

export type TimeRange =
  | '1h'
  | '6h'
  | '24h'
  | '7d'
  | '30d'
  | '90d'
  | '1y'
  | 'custom';

export type TimeGranularity =
  | '1m'
  | '5m'
  | '15m'
  | '1h'
  | '6h'
  | '1d'
  | '1w'
  | '1M';

export interface WebSocketConfig {
  heartbeatInterval: number;
  maxConnections: number;
  connectionTimeout: number;
  enableCompression: boolean;
}

export interface MLConfig {
  enabled: boolean;
  models: string[];
  confidenceThreshold: number;
  updateInterval: number;
  trainingDataRetention: number;
}

export interface MonitoringConfigData {
  enabled: boolean;
  sampleRate: number;
  retentionDays: number;
  privacyMode: boolean;
  geolocationEnabled: boolean;
  performanceTracking: boolean;
  errorTracking: boolean;
  userAnalytics: boolean;
  realTimeUpdates: boolean;
  alerting: boolean;
  dataExport: boolean;
  webSocket: WebSocketConfig;
  ml: MLConfig;
}

export interface MonitoringData {
  type: string;
  timestamp: number;
  data?: unknown;
  metadata?: Record<string, unknown>;
}

export interface MetricsResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  metadata: {
    type: string;
    timeRange: TimeRange;
    granularity: TimeGranularity;
    dataPoints: number;
    cached: boolean;
    cacheAge?: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  timestamp: string;
  code?: string;
  details?: Record<string, unknown>;
}

export type ApiResponse<T> = MetricsResponse<T> | ErrorResponse;

// Utility types for better type safety
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event emitter types for the monitoring system
export interface MonitoringEventEmitter {
  on(event: string, listener: (...args: unknown[]) => void): this;
  off(event: string, listener: (...args: unknown[]) => void): this;
  emit(event: string, ...args: unknown[]): boolean;
  once(event: string, listener: (...args: unknown[]) => void): this;
}

export interface MonitoringEventMap {
  metrics_collected: [SystemMetrics | SystemMetrics[] | PerformanceMetrics[]];
  user_event: [UserEvent];
  page_view: [PageView];
  system_alert: [SystemAlert];
  insight_generated: [AnalyticsInsight];
  error_occurred: [Error];
  configuration_changed: [Partial<MonitoringConfig>];
  service_started: [{ timestamp: Date }];
  service_stopped: [{ timestamp: Date }];
  data_stored: [unknown];
  client_connected: [WebSocket];
  client_disconnected: [WebSocket];
}

// Generic event handler type
export type EventHandler<T> = (event: T) => void | Promise<void>;

// Configuration validation types
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConfigValidator {
  validate(config: Partial<MonitoringConfig>): ValidationResult;
  getDefaultConfig(): MonitoringConfig;
  getRequiredFields(): (keyof MonitoringConfig)[];
}
