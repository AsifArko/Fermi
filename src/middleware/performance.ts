import { NextRequest, NextResponse } from 'next/server';
import { MonitoringService } from '../lib/monitoring/monitoringService';

export function performanceMiddleware(_request: NextRequest) {
  const startTime = Date.now();

  // Record the request
  const response = NextResponse.next();

  // Add response headers for monitoring
  response.headers.set('X-Monitoring-Enabled', 'true');

  // Record the request after response is sent
  response.headers.set('X-Request-Start', startTime.toString());

  return response;
}

// Middleware to record completed requests
export function recordRequest(
  method: string,
  url: string,
  statusCode: number,
  duration: number
) {
  try {
    const monitoringService = MonitoringService.getInstance();
    monitoringService.recordHttpRequest(method, url, statusCode, duration);
  } catch (error) {
    // Silently fail if monitoring is not available
    console.warn('Failed to record request for monitoring:', error);
  }
}
