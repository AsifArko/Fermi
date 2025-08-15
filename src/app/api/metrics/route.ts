import { NextResponse } from 'next/server';

export async function GET() {
  const metrics = [
    `# HELP http_requests_total Total number of HTTP requests`,
    `# TYPE http_requests_total counter`,
    `http_requests_total{method="GET",endpoint="/api/metrics"} 1`,
    ``,
    `# HELP http_request_duration_seconds Duration of HTTP requests in seconds`,
    `# TYPE http_request_duration_seconds histogram`,
    `http_request_duration_seconds_bucket{le="0.1"} 0`,
    `http_request_duration_seconds_bucket{le="0.5"} 0`,
    `http_request_duration_seconds_bucket{le="1.0"} 0`,
    `http_request_duration_seconds_bucket{le="2.0"} 0`,
    `http_request_duration_seconds_bucket{le="5.0"} 0`,
    `http_request_duration_seconds_bucket{le="+Inf"} 0`,
    `http_request_duration_seconds_sum 0`,
    `http_request_duration_seconds_count 0`,
    ``,
    `# HELP nodejs_heap_size_total_bytes Process heap size from Node.js in bytes`,
    `# TYPE nodejs_heap_size_total_bytes gauge`,
    `nodejs_heap_size_total_bytes ${process.memoryUsage().heapTotal}`,
    ``,
    `# HELP nodejs_heap_size_used_bytes Process heap size used from Node.js in bytes`,
    `# TYPE nodejs_heap_size_used_bytes gauge`,
    `nodejs_heap_size_used_bytes ${process.memoryUsage().heapUsed}`,
    ``,
    `# HELP nodejs_process_cpu_usage_total Total user and CPU time spent in seconds`,
    `# TYPE nodejs_process_cpu_usage_total counter`,
    `nodejs_process_cpu_usage_total ${process.cpuUsage().user / 1000000}`,
    ``,
    `# HELP nodejs_process_start_time_seconds Start time of the process since unix epoch in seconds`,
    `# TYPE nodejs_process_start_time_seconds gauge`,
    `nodejs_process_start_time_seconds ${process.uptime()}`,
  ].join('\n');

  return new NextResponse(metrics, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
