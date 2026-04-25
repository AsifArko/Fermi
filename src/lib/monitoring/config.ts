export interface MonitoringConfig {
  enablePageTracking: boolean;
  enableEventTracking: boolean;
  enablePerformanceTracking: boolean;
  enableErrorTracking: boolean;
  enableSystemMetrics: boolean;
  sampleRate: number; // 0-1, percentage of requests to track
  retentionDays: number;
  enableGeolocation: boolean;
  enableRealTime: boolean;
  privacyMode: boolean; // Anonymize IP addresses
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  metricsCollectionInterval: number; // milliseconds
  maxLogFileSize: string;
  maxLogFiles: string;
}

export const monitoringConfig: MonitoringConfig = {
  enablePageTracking: process.env.ENABLE_PAGE_TRACKING !== 'false',
  enableEventTracking: process.env.ENABLE_EVENT_TRACKING !== 'false',
  enablePerformanceTracking:
    process.env.ENABLE_PERFORMANCE_TRACKING !== 'false',
  enableErrorTracking: process.env.ENABLE_ERROR_TRACKING !== 'false',
  enableSystemMetrics: process.env.ENABLE_SYSTEM_METRICS !== 'false',
  sampleRate: parseFloat(process.env.MONITORING_SAMPLE_RATE || '1.0'),
  retentionDays: parseInt(process.env.MONITORING_RETENTION_DAYS || '90'),
  enableGeolocation: process.env.ENABLE_GEOLOCATION !== 'false',
  enableRealTime: process.env.ENABLE_REAL_TIME !== 'false',
  privacyMode: process.env.PRIVACY_MODE === 'true',
  logLevel: (process.env.LOG_LEVEL as MonitoringConfig['logLevel']) || 'info',
  metricsCollectionInterval: parseInt(
    process.env.METRICS_COLLECTION_INTERVAL || '30000'
  ),
  maxLogFileSize: process.env.MAX_LOG_FILE_SIZE || '20m',
  maxLogFiles: process.env.MAX_LOG_FILES || '14d',
};

// Environment variable documentation
export const ENV_VARS = {
  ENABLE_PAGE_TRACKING: 'Enable/disable page view tracking (default: true)',
  ENABLE_EVENT_TRACKING: 'Enable/disable user event tracking (default: true)',
  ENABLE_PERFORMANCE_TRACKING:
    'Enable/disable performance metrics tracking (default: true)',
  ENABLE_ERROR_TRACKING: 'Enable/disable error tracking (default: true)',
  ENABLE_SYSTEM_METRICS:
    'Enable/disable system metrics collection (default: true)',
  MONITORING_SAMPLE_RATE:
    'Percentage of requests to track (0.0-1.0, default: 1.0)',
  MONITORING_RETENTION_DAYS:
    'Number of days to retain monitoring data (default: 90)',
  ENABLE_GEOLOCATION: 'Enable/disable IP geolocation (default: true)',
  ENABLE_REAL_TIME: 'Enable/disable real-time monitoring (default: true)',
  PRIVACY_MODE: 'Enable/disable IP anonymization (default: false)',
  LOG_LEVEL: 'Logging level (error|warn|info|debug, default: info)',
  METRICS_COLLECTION_INTERVAL:
    'Metrics collection interval in milliseconds (default: 30000)',
  MAX_LOG_FILE_SIZE: 'Maximum log file size (default: 20m)',
  MAX_LOG_FILES: 'Maximum number of log files to keep (default: 14d)',
};
