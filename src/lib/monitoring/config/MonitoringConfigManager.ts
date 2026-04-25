import type {
  MonitoringConfig,
  MonitoringConfigData,
  WebSocketConfig,
  MLConfig,
  ValidationResult,
  ConfigValidator,
} from '../core/types';

export class MonitoringConfigManager implements ConfigValidator {
  private static instance: MonitoringConfigManager;
  private config: MonitoringConfigData;
  private readonly defaultConfig: MonitoringConfigData;

  private constructor() {
    this.defaultConfig = this.getDefaultConfig();
    this.config = this.loadConfiguration();
  }

  public static getInstance(): MonitoringConfigManager {
    if (!MonitoringConfigManager.instance) {
      MonitoringConfigManager.instance = new MonitoringConfigManager();
    }
    return MonitoringConfigManager.instance;
  }

  public getConfig(): MonitoringConfig {
    return {
      enabled: this.config.enabled,
      sampleRate: this.config.sampleRate,
      retentionDays: this.config.retentionDays,
      privacyMode: this.config.privacyMode,
      geolocationEnabled: this.config.geolocationEnabled,
      performanceTracking: this.config.performanceTracking,
      errorTracking: this.config.errorTracking,
      userAnalytics: this.config.userAnalytics,
      realTimeUpdates: this.config.realTimeUpdates,
      alerting: this.config.alerting,
      dataExport: this.config.dataExport,
    };
  }

  public getFullConfig(): MonitoringConfigData {
    return { ...this.config };
  }

  public getWebSocketConfig(): WebSocketConfig {
    return { ...this.config.webSocket };
  }

  public getMLConfig(): MLConfig {
    return { ...this.config.ml };
  }

  public getSystemMetricsConfig(): { enabled: boolean; interval: number } {
    return {
      enabled: this.config.enabled && this.config.performanceTracking,
      interval: this.getCollectionInterval('system'),
    };
  }

  public getPerformanceConfig(): {
    enabled: boolean;
    interval: number;
    trackCoreWebVitals: boolean;
  } {
    return {
      enabled: this.config.enabled && this.config.performanceTracking,
      interval: this.getCollectionInterval('performance'),
      trackCoreWebVitals: true,
    };
  }

  public getUserAnalyticsConfig(): {
    enabled: boolean;
    sampleRate: number;
    privacyMode: boolean;
  } {
    return {
      enabled: this.config.enabled && this.config.userAnalytics,
      sampleRate: this.config.sampleRate,
      privacyMode: this.config.privacyMode,
    };
  }

  public isFeatureEnabled(feature: keyof MonitoringConfig): boolean {
    if (!this.config.enabled) {
      return false;
    }

    switch (feature) {
      case 'performanceTracking':
        return this.config.performanceTracking;
      case 'userAnalytics':
        return this.config.userAnalytics;
      case 'errorTracking':
        return this.config.errorTracking;
      case 'realTimeUpdates':
        return this.config.realTimeUpdates;
      case 'alerting':
        return this.config.alerting;
      case 'dataExport':
        return this.config.dataExport;
      default:
        return false;
    }
  }

  public async update(updates: Partial<MonitoringConfigData>): Promise<void> {
    const newConfig = { ...this.config, ...updates };
    const validation = this.validate(newConfig);

    if (!validation.valid) {
      throw new Error(
        `Configuration validation failed: ${validation.errors.join(', ')}`
      );
    }

    this.config = newConfig;
    await this.saveConfiguration();
  }

  public validate(config: Partial<MonitoringConfigData>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (config.enabled !== undefined && typeof config.enabled !== 'boolean') {
      errors.push('enabled must be a boolean');
    }

    if (config.sampleRate !== undefined) {
      if (typeof config.sampleRate !== 'number') {
        errors.push('sampleRate must be a number');
      } else if (config.sampleRate < 0 || config.sampleRate > 1) {
        errors.push('sampleRate must be between 0 and 1');
      }
    }

    if (config.retentionDays !== undefined) {
      if (typeof config.retentionDays !== 'number') {
        errors.push('retentionDays must be a number');
      } else if (config.retentionDays < 1 || config.retentionDays > 3650) {
        errors.push('retentionDays must be between 1 and 3650');
      }
    }

    // Validate WebSocket config
    if (config.webSocket) {
      if (config.webSocket.heartbeatInterval !== undefined) {
        if (typeof config.webSocket.heartbeatInterval !== 'number') {
          errors.push('webSocket.heartbeatInterval must be a number');
        } else if (
          config.webSocket.heartbeatInterval < 1000 ||
          config.webSocket.heartbeatInterval > 60000
        ) {
          errors.push(
            'webSocket.heartbeatInterval must be between 1000 and 60000 ms'
          );
        }
      }

      if (config.webSocket.maxConnections !== undefined) {
        if (typeof config.webSocket.maxConnections !== 'number') {
          errors.push('webSocket.maxConnections must be a number');
        } else if (
          config.webSocket.maxConnections < 1 ||
          config.webSocket.maxConnections > 10000
        ) {
          errors.push('webSocket.maxConnections must be between 1 and 10000');
        }
      }
    }

    // Validate ML config
    if (config.ml) {
      if (config.ml.confidenceThreshold !== undefined) {
        if (typeof config.ml.confidenceThreshold !== 'number') {
          errors.push('ml.confidenceThreshold must be a number');
        } else if (
          config.ml.confidenceThreshold < 0 ||
          config.ml.confidenceThreshold > 1
        ) {
          errors.push('ml.confidenceThreshold must be between 0 and 1');
        }
      }
    }

    // Warnings for potentially problematic configurations
    if (config.sampleRate === 0) {
      warnings.push('sampleRate is set to 0, no data will be collected');
    }

    if (config.retentionDays === 1) {
      warnings.push(
        'retentionDays is set to 1, data will be deleted very quickly'
      );
    }

    if (
      config.webSocket?.maxConnections &&
      config.webSocket.maxConnections > 1000
    ) {
      warnings.push('High maxConnections may impact performance');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  public getDefaultConfig(): MonitoringConfigData {
    return {
      enabled: true,
      sampleRate: 1.0,
      retentionDays: 90,
      privacyMode: false,
      geolocationEnabled: true,
      performanceTracking: true,
      errorTracking: true,
      userAnalytics: true,
      realTimeUpdates: true,
      alerting: true,
      dataExport: true,
      webSocket: {
        heartbeatInterval: 30000,
        maxConnections: 1000,
        connectionTimeout: 30000,
        enableCompression: true,
      },
      ml: {
        enabled: true,
        models: [
          'user_behavior',
          'performance_anomaly',
          'conversion_prediction',
        ],
        confidenceThreshold: 0.7,
        updateInterval: 3600000, // 1 hour
        trainingDataRetention: 365,
      },
    };
  }

  public getRequiredFields(): (keyof MonitoringConfig)[] {
    return ['enabled', 'sampleRate', 'retentionDays'];
  }

  private loadConfiguration(): MonitoringConfigData {
    try {
      const config = {
        enabled: this.getEnvBoolean(
          'MONITORING_ENABLED',
          this.defaultConfig.enabled
        ),
        sampleRate: this.getEnvNumber(
          'MONITORING_SAMPLE_RATE',
          this.defaultConfig.sampleRate
        ),
        retentionDays: this.getEnvNumber(
          'MONITORING_RETENTION_DAYS',
          this.defaultConfig.retentionDays
        ),
        privacyMode: this.getEnvBoolean(
          'MONITORING_PRIVACY_MODE',
          this.defaultConfig.privacyMode
        ),
        geolocationEnabled: this.getEnvBoolean(
          'MONITORING_GEOLOCATION',
          this.defaultConfig.geolocationEnabled
        ),
        performanceTracking: this.getEnvBoolean(
          'MONITORING_PERFORMANCE',
          this.defaultConfig.performanceTracking
        ),
        errorTracking: this.getEnvBoolean(
          'MONITORING_ERRORS',
          this.defaultConfig.errorTracking
        ),
        userAnalytics: this.getEnvBoolean(
          'MONITORING_USER_ANALYTICS',
          this.defaultConfig.userAnalytics
        ),
        realTimeUpdates: this.getEnvBoolean(
          'MONITORING_REALTIME',
          this.defaultConfig.realTimeUpdates
        ),
        alerting: this.getEnvBoolean(
          'MONITORING_ALERTING',
          this.defaultConfig.alerting
        ),
        dataExport: this.getEnvBoolean(
          'MONITORING_DATA_EXPORT',
          this.defaultConfig.dataExport
        ),
        webSocket: {
          heartbeatInterval: this.getEnvNumber(
            'MONITORING_WS_HEARTBEAT',
            this.defaultConfig.webSocket.heartbeatInterval
          ),
          maxConnections: this.getEnvNumber(
            'MONITORING_WS_MAX_CONNECTIONS',
            this.defaultConfig.webSocket.maxConnections
          ),
          connectionTimeout: this.getEnvNumber(
            'MONITORING_WS_TIMEOUT',
            this.defaultConfig.webSocket.connectionTimeout
          ),
          enableCompression: this.getEnvBoolean(
            'MONITORING_WS_COMPRESSION',
            this.defaultConfig.webSocket.enableCompression
          ),
        },
        ml: {
          enabled: this.getEnvBoolean(
            'MONITORING_ML_ENABLED',
            this.defaultConfig.ml.enabled
          ),
          models: this.getEnvArray(
            'MONITORING_ML_MODELS',
            this.defaultConfig.ml.models
          ),
          confidenceThreshold: this.getEnvNumber(
            'MONITORING_ML_CONFIDENCE',
            this.defaultConfig.ml.confidenceThreshold
          ),
          updateInterval: this.getEnvNumber(
            'MONITORING_ML_UPDATE_INTERVAL',
            this.defaultConfig.ml.updateInterval
          ),
          trainingDataRetention: this.getEnvNumber(
            'MONITORING_ML_TRAINING_RETENTION',
            this.defaultConfig.ml.trainingDataRetention
          ),
        },
      };

      // Validate loaded configuration
      const validation = this.validate(config);
      if (!validation.valid) {
        // Configuration validation warnings: validation.warnings
        if (validation.errors.length > 0) {
          // Configuration validation errors: validation.errors
          // Fall back to default config if there are critical errors
          return this.defaultConfig;
        }
      }

      return config;
    } catch (error) {
      // Failed to load monitoring configuration
      return this.defaultConfig;
    }
  }

  private async saveConfiguration(): Promise<void> {
    try {
      // In a real implementation, this would save to a database or file
      // For now, we'll just update the in-memory config
      // Configuration updated successfully
    } catch (error) {
      // Failed to save configuration
      throw error;
    }
  }

  private getEnvBoolean(key: string, defaultValue: boolean): boolean {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue;
    }
    return value.toLowerCase() === 'true';
  }

  private getEnvNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  private getEnvArray(key: string, defaultValue: string[]): string[] {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue;
    }
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  private getCollectionInterval(type: string): number {
    switch (type) {
      case 'system':
        return 30000; // 30 seconds
      case 'performance':
        return 60000; // 1 minute
      case 'user':
        return 15000; // 15 seconds
      default:
        return 60000; // 1 minute default
    }
  }

  // Method to reset configuration to defaults
  public async resetToDefaults(): Promise<void> {
    this.config = { ...this.defaultConfig };
    await this.saveConfiguration();
  }

  // Method to get configuration as environment variables
  public getEnvironmentVariables(): Record<string, string> {
    return {
      MONITORING_ENABLED: this.config.enabled.toString(),
      MONITORING_SAMPLE_RATE: this.config.sampleRate.toString(),
      MONITORING_RETENTION_DAYS: this.config.retentionDays.toString(),
      MONITORING_PRIVACY_MODE: this.config.privacyMode.toString(),
      MONITORING_GEOLOCATION: this.config.geolocationEnabled.toString(),
      MONITORING_PERFORMANCE: this.config.performanceTracking.toString(),
      MONITORING_ERRORS: this.config.errorTracking.toString(),
      MONITORING_USER_ANALYTICS: this.config.userAnalytics.toString(),
      MONITORING_REALTIME: this.config.realTimeUpdates.toString(),
      MONITORING_ALERTING: this.config.alerting.toString(),
      MONITORING_DATA_EXPORT: this.config.dataExport.toString(),
      MONITORING_WS_HEARTBEAT:
        this.config.webSocket.heartbeatInterval.toString(),
      MONITORING_WS_MAX_CONNECTIONS:
        this.config.webSocket.maxConnections.toString(),
      MONITORING_WS_TIMEOUT: this.config.webSocket.connectionTimeout.toString(),
      MONITORING_WS_COMPRESSION:
        this.config.webSocket.enableCompression.toString(),
      MONITORING_ML_ENABLED: this.config.ml.enabled.toString(),
      MONITORING_ML_MODELS: this.config.ml.models.join(','),
      MONITORING_ML_CONFIDENCE: this.config.ml.confidenceThreshold.toString(),
      MONITORING_ML_UPDATE_INTERVAL: this.config.ml.updateInterval.toString(),
      MONITORING_ML_TRAINING_RETENTION:
        this.config.ml.trainingDataRetention.toString(),
    };
  }

  // Method to validate current configuration
  public validateCurrentConfig(): ValidationResult {
    return this.validate(this.config);
  }

  // Method to get configuration summary
  public getConfigSummary(): Record<string, unknown> {
    return {
      enabled: this.config.enabled,
      features: {
        performanceTracking: this.isFeatureEnabled('performanceTracking'),
        userAnalytics: this.isFeatureEnabled('userAnalytics'),
        errorTracking: this.isFeatureEnabled('errorTracking'),
        realTimeUpdates: this.isFeatureEnabled('realTimeUpdates'),
        alerting: this.isFeatureEnabled('alerting'),
        dataExport: this.isFeatureEnabled('dataExport'),
      },
      dataRetention: `${this.config.retentionDays} days`,
      sampleRate: `${(this.config.sampleRate * 100).toFixed(1)}%`,
      privacyMode: this.config.privacyMode ? 'enabled' : 'disabled',
      geolocation: this.config.geolocationEnabled ? 'enabled' : 'disabled',
      webSocket: {
        maxConnections: this.config.webSocket.maxConnections,
        heartbeatInterval: `${this.config.webSocket.heartbeatInterval}ms`,
      },
      machineLearning: {
        enabled: this.config.ml.enabled,
        models: this.config.ml.models.length,
        confidenceThreshold: `${(this.config.ml.confidenceThreshold * 100).toFixed(1)}%`,
      },
    };
  }
}
