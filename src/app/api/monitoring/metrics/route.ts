import { MonitoringService } from '@/lib/monitoring/monitoringService';

export async function GET() {
  try {
    const monitoring = MonitoringService.getInstance();
    const metrics = monitoring.getMetrics();

    return new Response(metrics, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return new Response(
      `# HELP monitoring_error Error retrieving metrics\n# TYPE monitoring_error counter\nmonitoring_error 1`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
  }
}
