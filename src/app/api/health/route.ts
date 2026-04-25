import { NextResponse } from 'next/server';

export async function GET() {
  // Mock system metrics - in production this would come from your monitoring service
  const mockMetrics = {
    status: 'healthy' as const,
    uptime: 86400 + 3600 + 1800, // 1 day, 1 hour, 30 minutes
    memory: {
      used: 4.2 * 1024 * 1024 * 1024, // 4.2 GB
      total: 16 * 1024 * 1024 * 1024, // 16 GB
      percentage: 26.25,
    },
    cpu: {
      usage: 23.5,
      cores: 8,
      temperature: 45,
    },
    disk: {
      used: 120 * 1024 * 1024 * 1024, // 120 GB
      total: 500 * 1024 * 1024 * 1024, // 500 GB
      percentage: 24.0,
    },
    network: {
      incoming: 2.5 * 1024 * 1024 * 1024, // 2.5 GB
      outgoing: 1.8 * 1024 * 1024 * 1024, // 1.8 GB
      connections: 156,
    },
    services: [
      {
        name: 'Web Server',
        status: 'running' as const,
        uptime: 86400 + 3600,
        lastCheck: new Date().toISOString(),
      },
      {
        name: 'Database',
        status: 'running' as const,
        uptime: 86400 + 1800,
        lastCheck: new Date().toISOString(),
      },
      {
        name: 'Redis Cache',
        status: 'running' as const,
        uptime: 86400,
        lastCheck: new Date().toISOString(),
      },
      {
        name: 'File Storage',
        status: 'running' as const,
        uptime: 86400 + 7200,
        lastCheck: new Date().toISOString(),
      },
      {
        name: 'Monitoring Service',
        status: 'running' as const,
        uptime: 86400 + 900,
        lastCheck: new Date().toISOString(),
      },
    ],
  };

  return NextResponse.json({
    success: true,
    metrics: mockMetrics,
    timestamp: new Date().toISOString(),
  });
}
