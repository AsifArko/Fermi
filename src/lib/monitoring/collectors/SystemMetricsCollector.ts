import type { MetricsCollector, SystemMetrics } from '../core/types';

export interface SystemMetricsConfig {
  enabled: boolean;
  interval: number;
  trackCPU: boolean;
  trackMemory: boolean;
  trackDisk: boolean;
  trackNetwork: boolean;
  trackProcess: boolean;
  cpuSamplingInterval: number;
  memorySamplingInterval: number;
  diskSamplingInterval: number;
  networkSamplingInterval: number;
}

export class SystemMetricsCollector implements MetricsCollector<SystemMetrics> {
  private readonly config: SystemMetricsConfig;
  private lastCollection: SystemMetrics | null = null;
  private isCollecting = false;

  constructor(config: SystemMetricsConfig) {
    this.config = config;
  }

  public async collect(): Promise<SystemMetrics> {
    if (!this.config.enabled || this.isCollecting) {
      throw new Error(
        'System metrics collection is disabled or already in progress'
      );
    }

    this.isCollecting = true;

    try {
      const metrics = await this.gatherSystemMetrics();
      this.lastCollection = metrics;
      return metrics;
    } finally {
      this.isCollecting = false;
    }
  }

  public getLastCollection(): SystemMetrics | null {
    return this.lastCollection;
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public getCollectionInterval(): number {
    return this.config.interval;
  }

  public startContinuousMonitoring(): void {
    if (this.isCollecting) return;

    this.isCollecting = true;

    // Collect metrics every interval
    setInterval(async () => {
      try {
        await this.collect();
      } catch (error) {
        // Silently handle errors to keep monitoring running
      }
    }, this.config.interval);

    console.log('🔄 Continuous system monitoring started');
  }

  private async gatherSystemMetrics(): Promise<SystemMetrics> {
    const timestamp = new Date();

    const [cpu, memory, disk, network, process] = await Promise.all([
      this.config.trackCPU
        ? this.collectCPUMetrics()
        : this.getDefaultCPUMetrics(),
      this.config.trackMemory
        ? this.collectMemoryMetrics()
        : this.getDefaultMemoryMetrics(),
      this.config.trackDisk
        ? this.collectDiskMetrics()
        : this.getDefaultDiskMetrics(),
      this.config.trackNetwork
        ? this.collectNetworkMetrics()
        : this.getDefaultNetworkMetrics(),
      this.config.trackProcess
        ? this.collectProcessMetrics()
        : this.getDefaultProcessMetrics(),
    ]);

    return {
      timestamp,
      cpu,
      memory,
      disk,
      network,
      process,
    };
  }

  private async collectCPUMetrics(): Promise<SystemMetrics['cpu']> {
    try {
      const cores = navigator.hardwareConcurrency || 4;

      // Simulate realistic CPU usage (in a real implementation, you'd use actual system metrics)
      const baseUsage = Math.random() * 30; // Base usage 0-30%
      const spike = Math.random() > 0.8 ? Math.random() * 40 : 0; // Occasional spikes
      const usagePercent = Math.min(baseUsage + spike, 100);

      // CPU load (simplified - in a real implementation, you'd use os.loadavg())
      const load = Math.random() * 2 + 0.5; // Realistic load 0.5-2.5

      return {
        usage: Math.round(usagePercent * 100) / 100,
        load: Math.round(load * 100) / 100,
        cores,
        temperature: undefined, // Would require hardware monitoring
        frequency: undefined, // Would require hardware monitoring
      };
    } catch (error) {
      // Failed to collect CPU metrics, using defaults
      return this.getDefaultCPUMetrics();
    }
  }

  private async collectMemoryMetrics(): Promise<SystemMetrics['memory']> {
    try {
      const memUsage = process.memoryUsage();

      return {
        total: memUsage.rss + memUsage.external + memUsage.arrayBuffers,
        used: memUsage.heapUsed + memUsage.external + memUsage.arrayBuffers,
        free: memUsage.rss - memUsage.heapUsed,
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers,
      };
    } catch (error) {
      // Failed to collect memory metrics, using defaults
      return this.getDefaultMemoryMetrics();
    }
  }

  private async collectDiskMetrics(): Promise<SystemMetrics['disk']> {
    try {
      // Simulate realistic disk usage
      const total = 100 * 1024 * 1024 * 1024; // 100GB
      const baseUsed = 60 * 1024 * 1024 * 1024; // Base usage 60GB
      const variation = Math.random() * 10 * 1024 * 1024 * 1024; // ±5GB variation
      const used = Math.min(baseUsed + variation, total);
      const free = total - used;

      return {
        total,
        used,
        free,
        ioRead: Math.floor(Math.random() * 1000000),
        ioWrite: Math.floor(Math.random() * 1000000),
        readLatency: Math.random() * 10,
        writeLatency: Math.random() * 20,
      };
    } catch (error) {
      // Failed to collect disk metrics, using defaults
      return this.getDefaultDiskMetrics();
    }
  }

  private async collectNetworkMetrics(): Promise<SystemMetrics['network']> {
    try {
      // Simulate realistic network metrics
      const baseBytesIn = 500000000; // 500MB base
      const baseBytesOut = 200000000; // 200MB base
      const variation = Math.random() * 0.5; // ±25% variation

      return {
        bytesIn: Math.floor(baseBytesIn * (1 + variation)),
        bytesOut: Math.floor(baseBytesOut * (1 + variation)),
        connections: Math.floor(Math.random() * 500) + 100, // 100-600 connections
        latency: Math.random() * 50 + 10, // 10-60ms latency
        packetLoss: Math.random() * 0.05, // 0-5% packet loss
        bandwidth: Math.floor(Math.random() * 500000000) + 100000000, // 100MB-600MB
      };
    } catch (error) {
      // Failed to collect network metrics, using defaults
      return this.getDefaultNetworkMetrics();
    }
  }

  private async collectProcessMetrics(): Promise<SystemMetrics['process']> {
    try {
      // Simulate realistic process metrics
      const baseCpuUsage = Math.random() * 15; // Base usage 0-15%
      const spike = Math.random() > 0.7 ? Math.random() * 25 : 0; // Occasional spikes
      const cpuUsage = Math.min(baseCpuUsage + spike, 100);

      return {
        pid: process.pid,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage().heapUsed,
        cpuUsage: Math.round(cpuUsage * 100) / 100,
        threadCount: 1, // Node.js is single-threaded, but could track worker threads
      };
    } catch (error) {
      // Failed to collect process metrics, using defaults
      return this.getDefaultProcessMetrics();
    }
  }

  private getDefaultCPUMetrics(): SystemMetrics['cpu'] {
    return {
      usage: 0,
      load: 0,
      cores: navigator.hardwareConcurrency || 1,
      temperature: undefined,
      frequency: undefined,
    };
  }

  private getDefaultMemoryMetrics(): SystemMetrics['memory'] {
    return {
      total: 0,
      used: 0,
      free: 0,
      heapUsed: 0,
      heapTotal: 0,
      external: 0,
      arrayBuffers: 0,
    };
  }

  private getDefaultDiskMetrics(): SystemMetrics['disk'] {
    return {
      total: 0,
      used: 0,
      free: 0,
      ioRead: 0,
      ioWrite: 0,
      readLatency: 0,
      writeLatency: 0,
    };
  }

  private getDefaultNetworkMetrics(): SystemMetrics['network'] {
    return {
      bytesIn: 0,
      bytesOut: 0,
      connections: 0,
      latency: 0,
      packetLoss: 0,
      bandwidth: 0,
    };
  }

  private getDefaultProcessMetrics(): SystemMetrics['process'] {
    return {
      pid: process.pid,
      uptime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      threadCount: 1,
    };
  }

  // Method to get configuration
  public getConfig(): SystemMetricsConfig {
    return { ...this.config };
  }

  // Method to update configuration
  public updateConfig(updates: Partial<SystemMetricsConfig>): void {
    Object.assign(this.config, updates);
  }

  // Method to get metrics summary
  public getMetricsSummary(): Record<string, unknown> {
    if (!this.lastCollection) {
      return { status: 'No metrics collected yet' };
    }

    return {
      timestamp: this.lastCollection.timestamp,
      cpu: {
        usage: `${this.lastCollection.cpu.usage}%`,
        load: this.lastCollection.cpu.load.toFixed(2),
        cores: this.lastCollection.cpu.cores,
      },
      memory: {
        total: this.formatBytes(this.lastCollection.memory.total),
        used: this.formatBytes(this.lastCollection.memory.used),
        free: this.formatBytes(this.lastCollection.memory.free),
        heapUsed: this.formatBytes(this.lastCollection.memory.heapUsed),
      },
      disk: {
        total: this.formatBytes(this.lastCollection.disk.total),
        used: this.formatBytes(this.lastCollection.disk.used),
        free: this.formatBytes(this.lastCollection.disk.free),
        ioRead: this.formatBytes(this.lastCollection.disk.ioRead),
        ioWrite: this.formatBytes(this.lastCollection.disk.ioWrite),
      },
      network: {
        bytesIn: this.formatBytes(this.lastCollection.network.bytesIn),
        bytesOut: this.formatBytes(this.lastCollection.network.bytesOut),
        connections: this.lastCollection.network.connections,
        latency: `${this.lastCollection.network.latency.toFixed(2)}ms`,
      },
      process: {
        pid: this.lastCollection.process.pid,
        uptime: `${this.lastCollection.process.uptime.toFixed(2)}s`,
        memoryUsage: this.formatBytes(this.lastCollection.process.memoryUsage),
        cpuUsage: `${this.lastCollection.process.cpuUsage}%`,
      },
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  // Method to check if metrics are healthy
  public checkMetricsHealth(): { healthy: boolean; issues: string[] } {
    if (!this.lastCollection) {
      return { healthy: false, issues: ['No metrics available'] };
    }

    const issues: string[] = [];

    // CPU health checks
    if (this.lastCollection.cpu.usage > 90) {
      issues.push('CPU usage is very high (>90%)');
    }
    if (this.lastCollection.cpu.load > 3) {
      issues.push('System load is very high (>3)');
    }

    // Memory health checks
    const memoryUsagePercent =
      (this.lastCollection.memory.used / this.lastCollection.memory.total) *
      100;
    if (memoryUsagePercent > 90) {
      issues.push('Memory usage is very high (>90%)');
    }

    // Disk health checks
    const diskUsagePercent =
      (this.lastCollection.disk.used / this.lastCollection.disk.total) * 100;
    if (diskUsagePercent > 90) {
      issues.push('Disk usage is very high (>90%)');
    }

    // Network health checks
    if (this.lastCollection.network.packetLoss > 0.05) {
      issues.push('Network packet loss is high (>5%)');
    }
    if (this.lastCollection.network.latency > 100) {
      issues.push('Network latency is high (>100ms)');
    }

    return {
      healthy: issues.length === 0,
      issues,
    };
  }

  // Method to get trending data
  public getTrendingData(): Record<string, unknown> {
    // This would typically compare current metrics with historical data
    // For now, return a simple structure
    return {
      cpuTrend: 'stable',
      memoryTrend: 'stable',
      diskTrend: 'stable',
      networkTrend: 'stable',
      lastUpdated: this.lastCollection?.timestamp || 'Never',
    };
  }
}
