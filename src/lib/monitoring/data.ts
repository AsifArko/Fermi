import { MonitoringService } from './monitoringService';

// Enhanced monitoring data with real system metrics
export const userData = {
  pageViews: [] as Array<{
    id: string;
    url: string;
    userAgent: string;
    deviceType: string;
    browser: string;
    timestamp: string;
    country?: string;
    referrer?: string;
  }>,
  userEvents: [] as Array<{
    id: string;
    eventType: string;
    eventName: string;
    url: string;
    timestamp: string;
  }>,
  performance: [] as Array<{
    id: string;
    metric: string;
    value: number;
    url: string;
    timestamp: string;
  }>,
  httpRequests: [] as Array<{
    id: string;
    method: string;
    url: string;
    statusCode: number;
    duration: number;
    timestamp: string;
  }>,
  errorLogs: [] as Array<{
    id: string;
    errorType: string;
    severity: string;
    message: string;
    url: string;
    timestamp: string;
    stackTrace?: string;
  }>,
  systemMetrics: {
    cpu: 0,
    memory: 0,
    disk: 0,
    uptime: 0,
    activeConnections: 0,
  },
};

// Update system metrics with real data
export function updateSystemMetrics() {
  const monitoringService = MonitoringService.getInstance();

  // Get real system metrics from the service
  const systemMetrics = monitoringService.getSystemMetrics();

  // Update with real system metrics
  userData.systemMetrics = {
    cpu: systemMetrics.cpu,
    memory: systemMetrics.memory,
    disk: systemMetrics.disk,
    uptime: systemMetrics.uptime,
    activeConnections: systemMetrics.activeConnections,
  };
}

// Add new page view
export function addPageView(
  url: string,
  userAgent: string,
  deviceType: string,
  browser: string
) {
  const pageView = {
    id: `pv_${Date.now()}`,
    url,
    userAgent,
    deviceType,
    browser,
    timestamp: new Date().toISOString(),
    country: 'US', // Default, could be enhanced with IP geolocation
    referrer: 'direct',
  };

  userData.pageViews.push(pageView);

  // Keep only last 1000 page views
  if (userData.pageViews.length > 1000) {
    userData.pageViews = userData.pageViews.slice(-1000);
  }

  // Update system metrics
  updateSystemMetrics();

  return pageView;
}

// Add new user event
export function addUserEvent(
  eventType: string,
  eventName: string,
  url: string
) {
  const userEvent = {
    id: `ue_${Date.now()}`,
    eventType,
    eventName,
    url,
    timestamp: new Date().toISOString(),
  };

  userData.userEvents.push(userEvent);

  // Keep only last 1000 user events
  if (userData.userEvents.length > 1000) {
    userData.userEvents = userData.userEvents.slice(-1000);
  }

  // Update system metrics
  updateSystemMetrics();

  return userEvent;
}

// Add new HTTP request
export function addHttpRequest(
  method: string,
  url: string,
  statusCode: number,
  duration: number
) {
  const httpRequest = {
    id: `req_${Date.now()}`,
    method,
    url,
    statusCode,
    duration,
    timestamp: new Date().toISOString(),
  };

  userData.httpRequests.push(httpRequest);

  // Keep only last 1000 requests
  if (userData.httpRequests.length > 1000) {
    userData.httpRequests = userData.httpRequests.slice(-1000);
  }

  // Update system metrics
  updateSystemMetrics();

  return httpRequest;
}
