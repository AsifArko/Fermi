import { MonitoringService } from './monitoringService';
import { EnhancedMonitoringService } from './enhanced/EnhancedMonitoringService';
import { SystemMetricsCollector } from './collectors/SystemMetricsCollector';

// Initialize monitoring services
export function initializeMonitoring() {
  try {
    // Start the basic monitoring service
    const basicMonitoring = MonitoringService.getInstance();

    // Start the enhanced monitoring service
    const enhancedMonitoring = EnhancedMonitoringService.getInstance();

    // Start system metrics collection
    const systemCollector = new SystemMetricsCollector({
      enabled: true,
      interval: 10000, // 10 seconds
      trackCPU: true,
      trackMemory: true,
      trackDisk: true,
      trackNetwork: true,
      trackProcess: true,
      cpuSamplingInterval: 1000,
      memorySamplingInterval: 5000,
      diskSamplingInterval: 10000,
      networkSamplingInterval: 5000,
    });

    // Start continuous monitoring
    systemCollector.startContinuousMonitoring();

    // Log that monitoring is initialized
    if (
      typeof console !== 'undefined' &&
      process.env.NODE_ENV === 'development'
    ) {
      console.log('Monitoring services initialized successfully');
      console.log('System metrics collection started');
    }

    return { basicMonitoring, enhancedMonitoring, systemCollector };
  } catch (error) {
    if (typeof console !== 'undefined') {
      console.error('Failed to initialize monitoring services:', error);
    }
    return null;
  }
}

// Auto-initialize when this module is imported
if (typeof window !== 'undefined') {
  // Client-side initialization
  initializeMonitoring();
} else {
  // Server-side initialization
  initializeMonitoring();
}
