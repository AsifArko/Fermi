'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Stack,
  Button,
  Box,
  Flex,
  Grid,
  Badge,
  Select,
} from '@sanity/ui';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Info,
  RefreshCw,
  User,
  XCircle,
} from 'lucide-react';

// Define types locally since the import path is incorrect
interface SystemAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
  source: string;
  metadata?: Record<string, unknown>;
}

type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';
type AlertCategory =
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

export function AlertsDashboard() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredAlerts, setFilteredAlerts] = useState<SystemAlert[]>([]);
  const [filters, setFilters] = useState({
    severity: 'all' as AlertSeverity | 'all',
    category: 'all' as AlertCategory | 'all',
    status: 'all' as 'all' | 'active' | 'acknowledged' | 'resolved',
    timeRange: '24h' as '1h' | '24h' | '7d' | '30d',
  });

  useEffect(() => {
    fetchAlerts();
  }, [filters.timeRange]);

  useEffect(() => {
    applyFilters();
  }, [alerts, filters]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/monitoring/enhanced?type=alerts&range=${filters.timeRange}&granularity=1h`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const data = await response.json();
      setAlerts(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...alerts];

    if (filters.severity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(alert => alert.category === filters.category);
    }

    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'active':
          filtered = filtered.filter(
            alert => !alert.acknowledged && !alert.resolved
          );
          break;
        case 'acknowledged':
          filtered = filtered.filter(
            alert => alert.acknowledged && !alert.resolved
          );
          break;
        case 'resolved':
          filtered = filtered.filter(alert => alert.resolved);
          break;
      }
    }

    setFilteredAlerts(filtered);
  };

  const refreshData = () => {
    fetchAlerts();
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      // In a real implementation, this would call an API to acknowledge the alert
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? {
                ...alert,
                acknowledged: true,
                acknowledgedAt: new Date(),
                acknowledgedBy: 'current_user',
              }
            : alert
        )
      );
    } catch (error) {
      // Failed to acknowledge alert
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      // In a real implementation, this would call an API to resolve the alert
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? { ...alert, resolved: true, resolvedAt: new Date() }
            : alert
        )
      );
    } catch (error) {
      // Failed to resolve alert
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <XCircle size={16} />;
      case 'error':
        return <XCircle size={16} />;
      case 'warning':
        return <AlertTriangle size={16} />;
      case 'info':
        return <Info size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getSeverityTone = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'critical';
      case 'error':
        return 'critical';
      case 'warning':
        return 'caution';
      case 'info':
        return 'primary';
      default:
        return 'primary';
    }
  };

  const getStatusBadge = (alert: SystemAlert) => {
    if (alert.resolved) {
      return <Badge tone='positive'>Resolved</Badge>;
    }
    if (alert.acknowledged) {
      return <Badge tone='caution'>Acknowledged</Badge>;
    }
    return <Badge tone='critical'>Active</Badge>;
  };

  if (loading) {
    return <AlertsDashboardSkeleton />;
  }

  if (error) {
    return (
      <Card padding={6} radius={3} shadow={1} tone='critical'>
        <Stack space={4}>
          <Box style={{ textAlign: 'center' }}>
            <XCircle size={48} />
          </Box>
          <Text size={3} weight='bold' align='center'>
            Failed to Load Alerts
          </Text>
          <Text size={2} muted align='center'>
            {error}
          </Text>
          <Box style={{ textAlign: 'center' }}>
            <Button
              mode='ghost'
              icon={RefreshCw}
              text='Retry'
              onClick={refreshData}
            />
          </Box>
        </Stack>
      </Card>
    );
  }

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(
    alert => alert.severity === 'critical'
  );
  const warningAlerts = activeAlerts.filter(
    alert => alert.severity === 'warning'
  );

  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        {/* Header */}
        <Card padding={4} radius={3} shadow={1} tone='primary'>
          <Flex align='center' justify='space-between'>
            <Stack space={3}>
              <Text size={3} weight='bold'>
                System Alerts & Notifications
              </Text>
              <Text size={1} muted>
                Monitor and manage system alerts in real-time
              </Text>
              <Flex gap={3} align='center'>
                <Badge tone='critical'>{criticalAlerts.length} Critical</Badge>
                <Badge tone='caution'>{warningAlerts.length} Warnings</Badge>
                <Badge tone='primary'>{activeAlerts.length} Active</Badge>
              </Flex>
            </Stack>
            <Flex gap={2}>
              <Button
                mode='ghost'
                icon={RefreshCw}
                text='Refresh'
                onClick={refreshData}
                disabled={loading}
              />
            </Flex>
          </Flex>
        </Card>

        {/* Filters */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            <Flex align='center' gap={2}>
              <Filter size={20} />
              <Text size={2} weight='semibold'>
                Filters
              </Text>
            </Flex>
            <Grid columns={[1, 2, 4]} gap={3}>
              <Select
                value={filters.severity}
                onChange={event =>
                  setFilters(prev => ({
                    ...prev,
                    severity: event.currentTarget.value as
                      | AlertSeverity
                      | 'all',
                  }))
                }
              >
                <option value='all'>All Severities</option>
                <option value='critical'>Critical</option>
                <option value='error'>Error</option>
                <option value='warning'>Warning</option>
                <option value='info'>Info</option>
              </Select>

              <Select
                value={filters.category}
                onChange={event =>
                  setFilters(prev => ({
                    ...prev,
                    category: event.currentTarget.value as
                      | AlertCategory
                      | 'all',
                  }))
                }
              >
                <option value='all'>All Categories</option>
                <option value='system'>System</option>
                <option value='performance'>Performance</option>
                <option value='security'>Security</option>
                <option value='user_experience'>User Experience</option>
                <option value='business'>Business</option>
                <option value='infrastructure'>Infrastructure</option>
                <option value='application'>Application</option>
                <option value='database'>Database</option>
                <option value='network'>Network</option>
                <option value='storage'>Storage</option>
              </Select>

              <Select
                value={filters.status}
                onChange={event =>
                  setFilters(prev => ({
                    ...prev,
                    status: event.currentTarget.value as
                      | 'all'
                      | 'active'
                      | 'acknowledged'
                      | 'resolved',
                  }))
                }
              >
                <option value='all'>All Statuses</option>
                <option value='active'>Active</option>
                <option value='acknowledged'>Acknowledged</option>
                <option value='resolved'>Resolved</option>
              </Select>

              <Select
                value={filters.timeRange}
                onChange={event =>
                  setFilters(prev => ({
                    ...prev,
                    timeRange: event.currentTarget.value as
                      | '1h'
                      | '24h'
                      | '7d'
                      | '30d',
                  }))
                }
              >
                <option value='1h'>Last Hour</option>
                <option value='24h'>Last 24 Hours</option>
                <option value='7d'>Last 7 Days</option>
                <option value='30d'>Last 30 Days</option>
              </Select>
            </Grid>
          </Stack>
        </Card>

        {/* Alerts List */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            <Flex align='center' justify='space-between'>
              <Flex align='center' gap={2}>
                <Bell size={20} />
                <Text size={2} weight='semibold'>
                  Alerts ({filteredAlerts.length})
                </Text>
              </Flex>
              <Text size={1} muted>
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </Text>
            </Flex>

            {filteredAlerts.length === 0 ? (
              <Box padding={6} style={{ textAlign: 'center' }}>
                <CheckCircle
                  size={48}
                  style={{ color: '#10b981', margin: '0 auto 1rem' }}
                />
                <Text size={2} weight='semibold'>
                  No alerts found
                </Text>
                <Text size={1} muted>
                  All systems are running smoothly
                </Text>
              </Box>
            ) : (
              <Stack space={3}>
                {filteredAlerts.map(alert => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={acknowledgeAlert}
                    onResolve={resolveAlert}
                    getSeverityIcon={getSeverityIcon}
                    getSeverityTone={getSeverityTone}
                    getStatusBadge={getStatusBadge}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Alert Statistics */}
        <Grid columns={[1, 2, 4]} gap={3}>
          <StatCard
            title='Total Alerts'
            value={alerts.length}
            icon={Bell}
            tone='primary'
          />
          <StatCard
            title='Active Alerts'
            value={activeAlerts.length}
            icon={AlertTriangle}
            tone='caution'
          />
          <StatCard
            title='Critical Alerts'
            value={criticalAlerts.length}
            icon={XCircle}
            tone='critical'
          />
          <StatCard
            title='Resolved Alerts'
            value={alerts.filter(alert => alert.resolved).length}
            icon={CheckCircle}
            tone='positive'
          />
        </Grid>
      </Stack>
    </Box>
  );
}

// Alert Card Component
interface AlertCardProps {
  alert: SystemAlert;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  getSeverityIcon: (severity: AlertSeverity) => React.ReactNode;
  getSeverityTone: (
    severity: AlertSeverity
  ) => 'positive' | 'caution' | 'critical' | 'primary';
  getStatusBadge: (alert: SystemAlert) => React.ReactNode;
}

function AlertCard({
  alert,
  onAcknowledge,
  onResolve,
  getSeverityIcon,
  getSeverityTone,
  getStatusBadge,
}: AlertCardProps) {
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card
      padding={4}
      radius={3}
      shadow={1}
      tone={getSeverityTone(alert.severity)}
    >
      <Stack space={3}>
        <Flex align='center' justify='space-between'>
          <Flex align='center' gap={2}>
            {getSeverityIcon(alert.severity)}
            <Text size={2} weight='semibold'>
              {alert.title}
            </Text>
          </Flex>
          <Flex gap={2} align='center'>
            {getStatusBadge(alert)}
            <Badge tone='primary' size={1}>
              {alert.category}
            </Badge>
          </Flex>
        </Flex>

        <Text size={1}>{alert.message}</Text>

        <Flex align='center' justify='space-between'>
          <Flex align='center' gap={3}>
            <Flex align='center' gap={1}>
              <Clock size={14} />
              <Text size={1} muted>
                {formatTimestamp(alert.timestamp)}
              </Text>
            </Flex>
            {alert.acknowledged && (
              <Flex align='center' gap={1}>
                <User size={14} />
                <Text size={1} muted>
                  {alert.acknowledgedBy}
                </Text>
              </Flex>
            )}
          </Flex>

          <Flex gap={2}>
            {!alert.acknowledged && (
              <Button
                mode='ghost'
                size={1}
                icon={Eye}
                text='Acknowledge'
                onClick={() => onAcknowledge(alert.id)}
              />
            )}
            {!alert.resolved && (
              <Button
                mode='ghost'
                size={1}
                icon={CheckCircle}
                text='Resolve'
                onClick={() => onResolve(alert.id)}
              />
            )}
          </Flex>
        </Flex>

        {alert.metadata && Object.keys(alert.metadata).length > 0 && (
          <Box
            padding={3}
            style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '0.5rem' }}
          >
            <Text size={1} weight='semibold' style={{ marginBottom: '0.5rem' }}>
              Additional Information:
            </Text>
            <Text size={1} muted>
              {JSON.stringify(alert.metadata, null, 2)}
            </Text>
          </Box>
        )}
      </Stack>
    </Card>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'positive' | 'caution' | 'critical' | 'primary';
}

function StatCard({ title, value, icon: Icon, tone }: StatCardProps) {
  return (
    <Card padding={3} radius={3} shadow={1} tone={tone}>
      <Stack space={2}>
        <Flex align='center' gap={2}>
          <Icon className='w-4 h-4' />
          <Text size={1} weight='semibold'>
            {title}
          </Text>
        </Flex>
        <Text size={3} weight='bold'>
          {value.toLocaleString()}
        </Text>
      </Stack>
    </Card>
  );
}

// Dashboard Skeleton Component
function AlertsDashboardSkeleton() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
          <div className='flex gap-3'>
            {[...Array(3)].map((_, i) => (
              <div
                key={`stat-${i}`}
                className='h-6 bg-gray-200 rounded w-20'
              ></div>
            ))}
          </div>
        </Card>

        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-1/4 mb-4'></div>
          <div className='grid grid-cols-4 gap-3'>
            {[...Array(4)].map((_, i) => (
              <div
                key={`metric-${i}`}
                className='h-10 bg-gray-200 rounded'
              ></div>
            ))}
          </div>
        </Card>

        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-1/3 mb-4'></div>
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <div
                key={`alert-${i}`}
                className='h-24 bg-gray-200 rounded'
              ></div>
            ))}
          </div>
        </Card>

        <div className='grid grid-cols-4 gap-3'>
          {[...Array(4)].map((_, i) => (
            <div
              key={`summary-${i}`}
              className='h-20 bg-gray-200 rounded'
            ></div>
          ))}
        </div>
      </Stack>
    </Box>
  );
}

export default AlertsDashboard;
