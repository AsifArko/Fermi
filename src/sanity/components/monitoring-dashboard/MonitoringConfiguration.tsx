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
  Switch,
  TextInput,
  Select,
  TextArea,
} from '@sanity/ui';
import {
  Settings,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Activity,
  Target,
  Brain,
} from 'lucide-react';

interface MonitoringConfig {
  enabled: boolean;
  sampleRate: number;
  retentionDays: number;
  privacyMode: boolean;
  geolocationEnabled: boolean;
  performanceTracking: boolean;
  errorTracking: boolean;
  userAnalytics: boolean;
  realTimeUpdates: boolean;
  alerting: boolean;
  dataExport: boolean;
  webSocket: {
    heartbeatInterval: number;
    maxConnections: number;
    connectionTimeout: number;
    enableCompression: boolean;
  };
  ml: {
    enabled: boolean;
    models: string[];
    confidenceThreshold: number;
    updateInterval: number;
    trainingDataRetention: number;
  };
  thresholds: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    responseTime: number;
    errorRate: number;
  };
  notifications: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
    emailRecipients: string[];
    slackWebhook: string;
    webhookUrl: string;
  };
}

interface MonitoringConfigurationProps {
  // Props for future customization
}

export function MonitoringConfiguration(_props: MonitoringConfigurationProps) {
  const [config, setConfig] = useState<MonitoringConfig>(getDefaultConfig());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'general' | 'features' | 'thresholds' | 'notifications' | 'advanced'
  >('general');

  useEffect(() => {
    fetchConfiguration();
  }, []);

  const fetchConfiguration = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/monitoring/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getConfig' }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch configuration');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setConfig(data.data);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/monitoring/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'configure',
          config: config,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      const data = await response.json();
      if (data.success) {
        setSuccess('Configuration saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(data.message || 'Failed to save configuration');
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (updates: Partial<MonitoringConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateWebSocketConfig = (
    updates: Partial<MonitoringConfig['webSocket']>
  ) => {
    setConfig(prev => ({
      ...prev,
      webSocket: { ...prev.webSocket, ...updates },
    }));
  };

  const updateMLConfig = (updates: Partial<MonitoringConfig['ml']>) => {
    setConfig(prev => ({
      ...prev,
      ml: { ...prev.ml, ...updates },
    }));
  };

  const updateThresholds = (
    updates: Partial<MonitoringConfig['thresholds']>
  ) => {
    setConfig(prev => ({
      ...prev,
      thresholds: { ...prev.thresholds, ...updates },
    }));
  };

  const updateNotifications = (
    updates: Partial<MonitoringConfig['notifications']>
  ) => {
    setConfig(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates },
    }));
  };

  const resetToDefaults = () => {
    setConfig(getDefaultConfig());
  };

  const testConfiguration = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/monitoring/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      });

      if (!response.ok) {
        throw new Error('Configuration test failed');
      }

      const data = await response.json();
      if (data.success) {
        setSuccess('Configuration test passed! All systems operational.');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(data.message || 'Configuration test failed');
      }
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Configuration test failed'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ConfigurationSkeleton />;
  }

  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        {/* Header */}
        <Card padding={4} radius={3} shadow={1} tone='primary'>
          <Flex align='center' justify='space-between'>
            <Stack space={3}>
              <Text size={3} weight='bold'>
                Monitoring Configuration
              </Text>
              <Text size={1} muted>
                Configure monitoring settings, thresholds, and notification
                preferences
              </Text>
              <Flex gap={3} align='center'>
                <Badge tone={config.enabled ? 'positive' : 'caution'}>
                  {config.enabled ? 'Monitoring Active' : 'Monitoring Disabled'}
                </Badge>
                <Badge tone='primary'>{config.sampleRate}% Sample Rate</Badge>
                <Badge tone='primary'>
                  {config.retentionDays} Days Retention
                </Badge>
              </Flex>
            </Stack>
            <Flex gap={2}>
              <Button
                mode='ghost'
                icon={RefreshCw}
                text='Refresh'
                onClick={fetchConfiguration}
                disabled={loading}
              />
              <Button
                mode='ghost'
                icon={Activity}
                text='Test Config'
                onClick={testConfiguration}
                disabled={loading}
              />
            </Flex>
          </Flex>
        </Card>

        {/* Error/Success Messages */}
        {error && (
          <Card padding={4} radius={3} shadow={1} tone='critical'>
            <Flex align='center' gap={2}>
              <AlertTriangle size={20} />
              <Text size={2} weight='semibold'>
                {error}
              </Text>
            </Flex>
          </Card>
        )}

        {success && (
          <Card padding={4} radius={3} shadow={1} tone='positive'>
            <Flex align='center' gap={2}>
              <CheckCircle size={20} />
              <Text size={2} weight='semibold'>
                {success}
              </Text>
            </Flex>
          </Card>
        )}

        {/* Configuration Tabs */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            {/* Tab Navigation */}
            <Flex gap={2} style={{ borderBottom: '1px solid #e5e7eb' }}>
              {[
                { id: 'general', label: 'General', icon: Settings },
                { id: 'features', label: 'Features', icon: Activity },
                { id: 'thresholds', label: 'Thresholds', icon: Target },
                {
                  id: 'notifications',
                  label: 'Notifications',
                  icon: AlertTriangle,
                },
                { id: 'advanced', label: 'Advanced', icon: Brain },
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  mode={activeTab === id ? 'default' : 'ghost'}
                  icon={Icon}
                  text={label}
                  onClick={() => setActiveTab(id as any)}
                  tone={activeTab === id ? 'primary' : 'default'}
                />
              ))}
            </Flex>

            {/* Tab Content */}
            <Box>
              {activeTab === 'general' && (
                <GeneralSettings config={config} updateConfig={updateConfig} />
              )}
              {activeTab === 'features' && (
                <FeatureSettings config={config} updateConfig={updateConfig} />
              )}
              {activeTab === 'thresholds' && (
                <ThresholdSettings
                  config={config}
                  updateThresholds={updateThresholds}
                />
              )}
              {activeTab === 'notifications' && (
                <NotificationSettings
                  config={config}
                  updateNotifications={updateNotifications}
                />
              )}
              {activeTab === 'advanced' && (
                <AdvancedSettings
                  config={config}
                  updateWebSocketConfig={updateWebSocketConfig}
                  updateMLConfig={updateMLConfig}
                />
              )}
            </Box>
          </Stack>
        </Card>

        {/* Action Buttons */}
        <Card padding={4} radius={3} shadow={1}>
          <Flex align='center' justify='space-between'>
            <Flex gap={2}>
              <Button
                mode='ghost'
                icon={RefreshCw}
                text='Reset to Defaults'
                onClick={resetToDefaults}
                tone='caution'
              />
              <Button
                mode='ghost'
                icon={Activity}
                text='Test Configuration'
                onClick={testConfiguration}
                disabled={loading}
              />
            </Flex>
            <Flex gap={2}>
              <Button
                mode='ghost'
                icon={RefreshCw}
                text='Cancel'
                onClick={fetchConfiguration}
                disabled={saving}
              />
              <Button
                mode='default'
                icon={Save}
                text='Save Configuration'
                onClick={saveConfiguration}
                disabled={saving}
                tone='primary'
              />
            </Flex>
          </Flex>
        </Card>
      </Stack>
    </Box>
  );
}

// General Settings Component
interface GeneralSettingsProps {
  config: MonitoringConfig;
  updateConfig: (updates: Partial<MonitoringConfig>) => void;
}

function GeneralSettings({ config, updateConfig }: GeneralSettingsProps) {
  return (
    <Stack space={4}>
      <Text size={2} weight='semibold'>
        General Settings
      </Text>

      <Grid columns={[1, 2]} gap={4}>
        <Stack space={3}>
          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Enable Monitoring
            </Text>
            <Switch
              checked={config.enabled}
              onChange={e => updateConfig({ enabled: e.currentTarget.checked })}
            />
          </Flex>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Sample Rate (%)
            </Text>
            <TextInput
              type='number'
              min='1'
              max='100'
              value={config.sampleRate}
              onChange={e =>
                updateConfig({
                  sampleRate: parseInt(e.currentTarget.value) || 100,
                })
              }
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Data Retention (Days)
            </Text>
            <TextInput
              type='number'
              min='1'
              max='365'
              value={config.retentionDays}
              onChange={e =>
                updateConfig({
                  retentionDays: parseInt(e.currentTarget.value) || 30,
                })
              }
            />
          </Stack>
        </Stack>

        <Stack space={3}>
          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Privacy Mode
            </Text>
            <Switch
              checked={config.privacyMode}
              onChange={e =>
                updateConfig({ privacyMode: e.currentTarget.checked })
              }
            />
          </Flex>

          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Geolocation Tracking
            </Text>
            <Switch
              checked={config.geolocationEnabled}
              onChange={e =>
                updateConfig({ geolocationEnabled: e.currentTarget.checked })
              }
            />
          </Flex>

          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Real-time Updates
            </Text>
            <Switch
              checked={config.realTimeUpdates}
              onChange={e =>
                updateConfig({ realTimeUpdates: e.currentTarget.checked })
              }
            />
          </Flex>
        </Stack>
      </Grid>
    </Stack>
  );
}

// Feature Settings Component
interface FeatureSettingsProps {
  config: MonitoringConfig;
  updateConfig: (updates: Partial<MonitoringConfig>) => void;
}

function FeatureSettings({ config, updateConfig }: FeatureSettingsProps) {
  return (
    <Stack space={4}>
      <Text size={2} weight='semibold'>
        Feature Toggles
      </Text>

      <Grid columns={[1, 2]} gap={4}>
        <Stack space={3}>
          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Performance Tracking
            </Text>
            <Switch
              checked={config.performanceTracking}
              onChange={e =>
                updateConfig({ performanceTracking: e.currentTarget.checked })
              }
            />
          </Flex>

          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Error Tracking
            </Text>
            <Switch
              checked={config.errorTracking}
              onChange={e =>
                updateConfig({ errorTracking: e.currentTarget.checked })
              }
            />
          </Flex>

          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              User Analytics
            </Text>
            <Switch
              checked={config.userAnalytics}
              onChange={e =>
                updateConfig({ userAnalytics: e.currentTarget.checked })
              }
            />
          </Flex>
        </Stack>

        <Stack space={3}>
          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              System Alerting
            </Text>
            <Switch
              checked={config.alerting}
              onChange={e =>
                updateConfig({ alerting: e.currentTarget.checked })
              }
            />
          </Flex>

          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Data Export
            </Text>
            <Switch
              checked={config.dataExport}
              onChange={e =>
                updateConfig({ dataExport: e.currentTarget.checked })
              }
            />
          </Flex>

          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Machine Learning
            </Text>
            <Switch
              checked={config.ml.enabled}
              onChange={e =>
                updateConfig({
                  ml: { ...config.ml, enabled: e.currentTarget.checked },
                })
              }
            />
          </Flex>
        </Stack>
      </Grid>
    </Stack>
  );
}

// Threshold Settings Component
interface ThresholdSettingsProps {
  config: MonitoringConfig;
  updateThresholds: (updates: Partial<MonitoringConfig['thresholds']>) => void;
}

function ThresholdSettings({
  config,
  updateThresholds,
}: ThresholdSettingsProps) {
  return (
    <Stack space={4}>
      <Text size={2} weight='semibold'>
        Alert Thresholds
      </Text>

      <Grid columns={[1, 2]} gap={4}>
        <Stack space={3}>
          <Stack space={2}>
            <Text size={1} weight='semibold'>
              CPU Usage (%)
            </Text>
            <TextInput
              type='number'
              min='50'
              max='100'
              value={config.thresholds.cpu}
              onChange={e =>
                updateThresholds({ cpu: parseInt(e.currentTarget.value) || 80 })
              }
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Memory Usage (%)
            </Text>
            <TextInput
              type='number'
              min='50'
              max='100'
              value={config.thresholds.memory}
              onChange={e =>
                updateThresholds({
                  memory: parseInt(e.currentTarget.value) || 80,
                })
              }
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Disk Usage (%)
            </Text>
            <TextInput
              type='number'
              min='50'
              max='100'
              value={config.thresholds.disk}
              onChange={e =>
                updateThresholds({
                  disk: parseInt(e.currentTarget.value) || 85,
                })
              }
            />
          </Stack>
        </Stack>

        <Stack space={3}>
          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Network Latency (ms)
            </Text>
            <TextInput
              type='number'
              min='100'
              max='10000'
              value={config.thresholds.responseTime}
              onChange={e =>
                updateThresholds({
                  responseTime: parseInt(e.currentTarget.value) || 1000,
                })
              }
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Error Rate (%)
            </Text>
            <TextInput
              type='number'
              min='0'
              max='100'
              step='0.1'
              value={config.thresholds.errorRate}
              onChange={e =>
                updateThresholds({
                  errorRate: parseFloat(e.currentTarget.value) || 5.0,
                })
              }
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Network Utilization (%)
            </Text>
            <TextInput
              type='number'
              min='50'
              max='100'
              value={config.thresholds.network}
              onChange={e =>
                updateThresholds({
                  network: parseInt(e.currentTarget.value) || 80,
                })
              }
            />
          </Stack>
        </Stack>
      </Grid>
    </Stack>
  );
}

// Notification Settings Component
interface NotificationSettingsProps {
  config: MonitoringConfig;
  updateNotifications: (
    updates: Partial<MonitoringConfig['notifications']>
  ) => void;
}

function NotificationSettings({
  config,
  updateNotifications,
}: NotificationSettingsProps) {
  return (
    <Stack space={4}>
      <Text size={2} weight='semibold'>
        Notification Settings
      </Text>

      <Grid columns={[1, 2]} gap={4}>
        <Stack space={3}>
          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Email Notifications
            </Text>
            <Switch
              checked={config.notifications.email}
              onChange={e =>
                updateNotifications({ email: e.currentTarget.checked })
              }
            />
          </Flex>

          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Slack Notifications
            </Text>
            <Switch
              checked={config.notifications.slack}
              onChange={e =>
                updateNotifications({ slack: e.currentTarget.checked })
              }
            />
          </Flex>

          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Webhook Notifications
            </Text>
            <Switch
              checked={config.notifications.webhook}
              onChange={e =>
                updateNotifications({ webhook: e.currentTarget.checked })
              }
            />
          </Flex>
        </Stack>

        <Stack space={3}>
          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Email Recipients
            </Text>
            <TextArea
              value={config.notifications.emailRecipients.join(', ')}
              onChange={e =>
                updateNotifications({
                  emailRecipients: e.currentTarget.value
                    .split(',')
                    .map(email => email.trim())
                    .filter(Boolean),
                })
              }
              placeholder='email1@example.com, email2@example.com'
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Slack Webhook URL
            </Text>
            <TextInput
              type='url'
              value={config.notifications.slackWebhook}
              onChange={e =>
                updateNotifications({ slackWebhook: e.currentTarget.value })
              }
              placeholder='https://hooks.slack.com/services/...'
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Custom Webhook URL
            </Text>
            <TextInput
              type='url'
              value={config.notifications.webhookUrl}
              onChange={e =>
                updateNotifications({ webhookUrl: e.currentTarget.value })
              }
              placeholder='https://your-webhook-endpoint.com'
            />
          </Stack>
        </Stack>
      </Grid>
    </Stack>
  );
}

// Advanced Settings Component
interface AdvancedSettingsProps {
  config: MonitoringConfig;
  updateWebSocketConfig: (
    updates: Partial<MonitoringConfig['webSocket']>
  ) => void;
  updateMLConfig: (updates: Partial<MonitoringConfig['ml']>) => void;
}

function AdvancedSettings({
  config,
  updateWebSocketConfig,
  updateMLConfig,
}: AdvancedSettingsProps) {
  return (
    <Stack space={4}>
      <Text size={2} weight='semibold'>
        Advanced Configuration
      </Text>

      <Grid columns={[1, 2]} gap={4}>
        {/* WebSocket Settings */}
        <Stack space={3}>
          <Text size={1} weight='semibold'>
            WebSocket Configuration
          </Text>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Heartbeat Interval (ms)
            </Text>
            <TextInput
              type='number'
              min='1000'
              max='60000'
              value={config.webSocket.heartbeatInterval}
              onChange={e =>
                updateWebSocketConfig({
                  heartbeatInterval: parseInt(e.currentTarget.value) || 30000,
                })
              }
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Max Connections
            </Text>
            <TextInput
              type='number'
              min='1'
              max='10000'
              value={config.webSocket.maxConnections}
              onChange={e =>
                updateWebSocketConfig({
                  maxConnections: parseInt(e.currentTarget.value) || 1000,
                })
              }
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Connection Timeout (ms)
            </Text>
            <TextInput
              type='number'
              min='1000'
              max='60000'
              value={config.webSocket.connectionTimeout}
              onChange={e =>
                updateWebSocketConfig({
                  connectionTimeout: parseInt(e.currentTarget.value) || 10000,
                })
              }
            />
          </Stack>

          <Flex align='center' justify='space-between'>
            <Text size={1} weight='semibold'>
              Enable Compression
            </Text>
            <Switch
              checked={config.webSocket.enableCompression}
              onChange={e =>
                updateWebSocketConfig({
                  enableCompression: e.currentTarget.checked,
                })
              }
            />
          </Flex>
        </Stack>

        {/* ML Settings */}
        <Stack space={3}>
          <Text size={1} weight='semibold'>
            Machine Learning Configuration
          </Text>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Confidence Threshold
            </Text>
            <TextInput
              type='number'
              min='0'
              max='1'
              step='0.1'
              value={config.ml.confidenceThreshold}
              onChange={e =>
                updateMLConfig({
                  confidenceThreshold: parseFloat(e.currentTarget.value) || 0.7,
                })
              }
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Update Interval (ms)
            </Text>
            <TextInput
              type='number'
              min='300000'
              max='86400000'
              value={config.ml.updateInterval}
              onChange={e =>
                updateMLConfig({
                  updateInterval: parseInt(e.currentTarget.value) || 3600000,
                })
              }
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              Training Data Retention (days)
            </Text>
            <TextInput
              type='number'
              min='1'
              max='365'
              value={config.ml.trainingDataRetention}
              onChange={e =>
                updateMLConfig({
                  trainingDataRetention: parseInt(e.currentTarget.value) || 90,
                })
              }
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight='semibold'>
              ML Models
            </Text>
            <Select
              value=''
              onChange={e => {
                const model = e.currentTarget.value;
                if (model && !config.ml.models.includes(model)) {
                  updateMLConfig({ models: [...config.ml.models, model] });
                }
              }}
            >
              <option value=''>Add Model</option>
              <option value='user_behavior'>User Behavior</option>
              <option value='performance_anomaly'>Performance Anomaly</option>
              <option value='conversion_prediction'>
                Conversion Prediction
              </option>
              <option value='fraud_detection'>Fraud Detection</option>
            </Select>
            <Stack space={1}>
              {config.ml.models.map((model, index) => (
                <Flex
                  key={`ml-model-${model}-${index}`}
                  align='center'
                  justify='space-between'
                >
                  <Text size={1}>{model}</Text>
                  <Button
                    mode='ghost'
                    size={1}
                    text='Remove'
                    onClick={() =>
                      updateMLConfig({
                        models: config.ml.models.filter((_, i) => i !== index),
                      })
                    }
                    tone='critical'
                  />
                </Flex>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </Stack>
  );
}

// Configuration Skeleton Component
function ConfigurationSkeleton() {
  return (
    <Box padding={4} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
          <div className='flex gap-3'>
            {[...Array(3)].map((_, i) => (
              <div
                key={`config-skeleton-${i}`}
                className='h-6 bg-gray-200 rounded w-20'
              ></div>
            ))}
          </div>
        </Card>

        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-1/4 mb-4'></div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='h-32 bg-gray-200 rounded'></div>
            <div className='h-32 bg-gray-200 rounded'></div>
          </div>
        </Card>

        <Card padding={4} radius={3} shadow={1} className='animate-pulse'>
          <div className='h-10 bg-gray-200 rounded w-full'></div>
        </Card>
      </Stack>
    </Box>
  );
}

// Utility functions
function getDefaultConfig(): MonitoringConfig {
  return {
    enabled: true,
    sampleRate: 100,
    retentionDays: 30,
    privacyMode: false,
    geolocationEnabled: true,
    performanceTracking: true,
    errorTracking: true,
    userAnalytics: true,
    realTimeUpdates: true,
    alerting: true,
    dataExport: false,
    webSocket: {
      heartbeatInterval: 30000,
      maxConnections: 1000,
      connectionTimeout: 10000,
      enableCompression: true,
    },
    ml: {
      enabled: true,
      models: ['user_behavior', 'performance_anomaly', 'conversion_prediction'],
      confidenceThreshold: 0.7,
      updateInterval: 3600000,
      trainingDataRetention: 90,
    },
    thresholds: {
      cpu: 80,
      memory: 80,
      disk: 85,
      network: 80,
      responseTime: 1000,
      errorRate: 5.0,
    },
    notifications: {
      email: false,
      slack: false,
      webhook: false,
      emailRecipients: [],
      slackWebhook: '',
      webhookUrl: '',
    },
  };
}

export default MonitoringConfiguration;
