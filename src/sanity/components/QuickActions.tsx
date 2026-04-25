'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Users,
  FileText,
  Plus,
  Eye,
  AlertTriangle,
  Clock,
  Monitor,
  RefreshCw,
} from 'lucide-react';

// Analytics Overview Component
const AnalyticsOverview: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalPageViews: 0,
    errorRate: 0,
    systemHealth: { cpu: 0, memory: 0, disk: 0 },
    recentErrors: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch data from monitoring APIs
        const [pageViews, systemMetrics, errorLogs, userEvents] =
          await Promise.all([
            fetch('/api/monitoring/page-views').then(res => res.json()),
            fetch('/api/monitoring/system-metrics').then(res => res.json()),
            fetch('/api/monitoring/error-logs').then(res => res.json()),
            fetch('/api/monitoring/user-events').then(res => res.json()),
          ]);

        const latestSystemMetrics = systemMetrics.data?.[0] || {};
        const recentErrors =
          errorLogs.data?.filter((error: any) => {
            const errorDate = new Date(error.timestamp || error.createdAt);
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return errorDate > oneHourAgo;
          }).length || 0;

        setAnalyticsData({
          totalPageViews: pageViews.data?.length || 0,
          errorRate:
            recentErrors > 0
              ? Math.round((recentErrors / (pageViews.data?.length || 1)) * 100)
              : 0,
          systemHealth: {
            cpu: latestSystemMetrics.cpuUsage || 0,
            memory: latestSystemMetrics.memoryUsage || 0,
            disk: latestSystemMetrics.diskUsage || 0,
          },
          recentErrors,
          activeUsers:
            userEvents.data?.filter((event: any) => {
              const eventDate = new Date(event.timestamp || event.createdAt);
              const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
              return eventDate > fiveMinutesAgo;
            }).length || 0,
        });

        setLastUpdated(new Date());
      } catch (error) {
        // Don't set any fallback data - keep default values
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSystemHealthStatus = (cpu: number, memory: number, disk: number) => {
    const avg = (cpu + memory + disk) / 3;
    if (avg < 30)
      return {
        status: 'Excellent',
        color: 'bg-green-50',
        textColor: 'text-green-700',
      };
    if (avg < 60)
      return {
        status: 'Good',
        color: 'bg-blue-50',
        textColor: 'text-blue-700',
      };
    if (avg < 80)
      return {
        status: 'Fair',
        color: 'bg-yellow-50',
        textColor: 'text-yellow-700',
      };
    return { status: 'Poor', color: 'bg-red-50', textColor: 'text-red-700' };
  };

  const healthStatus = getSystemHealthStatus(
    analyticsData.systemHealth.cpu,
    analyticsData.systemHealth.memory,
    analyticsData.systemHealth.disk
  );

  if (loading) {
    return (
      <div className='mb-8'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>
          Analytics & System Overview
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <Card key={i} className='bg-gray-50'>
              <CardContent className='p-4'>
                <div className='animate-pulse'>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                  <div className='h-8 bg-gray-200 rounded w-1/2'></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-700'>
          Analytics & System Overview
        </h3>
        <div className='flex items-center space-x-2 text-xs text-gray-500'>
          <Clock className='h-3 w-3' />
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <MetricCard
          title='Total Page Views'
          value={analyticsData.totalPageViews.toLocaleString()}
          icon={Eye}
          trend=''
          color='bg-gray-100'
        />
        <MetricCard
          title='Active Users'
          value={analyticsData.activeUsers.toString()}
          icon={Users}
          trend='Live'
          color='bg-blue-50'
        />
        <MetricCard
          title='System Health'
          value={healthStatus.status}
          icon={Monitor}
          trend={`${Math.round(100 - (analyticsData.systemHealth.cpu + analyticsData.systemHealth.memory + analyticsData.systemHealth.disk) / 3)}%`}
          color={healthStatus.color}
          textColor={healthStatus.textColor}
        />
        <MetricCard
          title='Error Rate'
          value={`${analyticsData.errorRate}%`}
          icon={AlertTriangle}
          trend={analyticsData.errorRate < 5 ? 'Low' : 'High'}
          color={analyticsData.errorRate < 5 ? 'bg-green-50' : 'bg-red-50'}
        />
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  color: string;
  textColor?: string;
}> = ({ title, value, icon: Icon, trend, color, textColor }) => (
  <Card className='bg-white border-gray-200 hover:shadow-sm transition-shadow'>
    <CardContent className='p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-600 mb-1'>{title}</p>
          <p className={`text-2xl font-bold ${textColor || 'text-gray-900'}`}>
            {value}
          </p>
          <p className={`text-xs ${textColor || 'text-gray-500'} mt-1`}>
            {trend}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className='h-5 w-5 text-gray-600' />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Action Card Component
const ActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}> = ({ title, description, icon: Icon, onClick }) => (
  <Card className='bg-white border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group'>
    <CardHeader className='pb-3'>
      <div className='flex items-center space-x-3'>
        <div className='p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors'>
          <Icon className='h-5 w-5 text-gray-600' />
        </div>
        <div>
          <CardTitle className='text-lg text-gray-900'>{title}</CardTitle>
          <CardDescription className='text-sm text-gray-600'>
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className='pt-0'>
      <Button
        onClick={onClick}
        className='w-full bg-gray-600 hover:bg-gray-700 text-white border-0'
        variant='default'
      >
        <Plus className='mr-2 h-4 w-4' />
        {title}
      </Button>
    </CardContent>
  </Card>
);

// Main QuickActions Component
export const QuickActions = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleAction = (action: string) => {
    // Use Sanity's built-in navigation for structure pages
    if (typeof window !== 'undefined') {
      switch (action) {
        case 'course':
          window.location.href = '/studio/structure/courses';
          break;
        case 'lesson':
          window.location.href = '/studio/structure/lessons';
          break;
        case 'module':
          window.location.href = '/studio/structure/modules';
          break;
        case 'student':
          window.location.href = '/studio/structure/students';
          break;
        default:
          window.location.href = `/studio/structure/${action}`;
      }
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Force a page reload to refresh all data
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const actions = [
    {
      title: 'Create Course',
      description: 'Add a new course to your platform',
      icon: BookOpen,
      action: 'course',
    },
    {
      title: 'Add Module',
      description: 'Create a new module for your courses',
      icon: FileText,
      action: 'module',
    },
    {
      title: 'Add Lesson',
      description: 'Create a new lesson for your modules',
      icon: FileText,
      action: 'lesson',
    },
    {
      title: 'Manage Students',
      description: 'View and manage student enrollments',
      icon: Users,
      action: 'student',
    },
  ];

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>
              Welcome & Quick Actions
            </h2>
            <p className='text-gray-600'>
              Monitor your platform performance and manage content efficiently
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant='outline'
            className='border-gray-300 text-gray-700 hover:bg-gray-100'
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Analytics Overview Section */}
      <AnalyticsOverview />

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 gap-8'>
        {/* Content Management Section */}
        <div>
          <h3 className='text-lg font-semibold text-gray-700 mb-6'>
            Content Management
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {actions.map((action, index) => (
              <ActionCard
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                onClick={() => handleAction(action.action)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className='mt-12 p-6 bg-white rounded-lg border border-gray-200'>
        <h3 className='font-semibold text-gray-900 mb-3'>💡 Quick Tips</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
          <div>
            <p className='mb-2'>
              • Use these quick actions to avoid complex nested navigation
            </p>
            <p>
              • All content types are also available in the main navigation menu
            </p>
          </div>
          <div>
            <p className='mb-2'>
              • Monitor system health and analytics in real-time
            </p>
            <p>• Track user engagement and platform performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};
