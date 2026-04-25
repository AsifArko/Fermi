import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { ClientAnalytics } from '@/components/analytics/ClientAnalytics';

export default function AnalyticsPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Analytics Dashboard
        </h1>
        <p className='text-gray-600 mt-2'>
          Monitor your application&apos;s performance and user behavior in
          real-time
        </p>
      </div>

      <AnalyticsDashboard />
      <ClientAnalytics />
    </div>
  );
}
