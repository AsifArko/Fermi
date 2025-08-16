'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestMonitoringPage() {
  useEffect(() => {
    // Simulate some user activity to populate monitoring data
    const simulateActivity = () => {
      // Simulate page views
      const urls = ['/test-monitoring', '/courses', '/about', '/contact'];
      urls.forEach((url, index) => {
        setTimeout(() => {
          // Simulate navigation
          window.history.pushState({}, '', url);
          // Trigger a page view event
          window.dispatchEvent(new PopStateEvent('popstate'));
        }, index * 1000);
      });

      // Simulate user events
      setTimeout(() => {
        // Simulate a click event
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        document.body.dispatchEvent(clickEvent);
      }, 5000);

      // Simulate form submission
      setTimeout(() => {
        const submitEvent = new Event('submit', {
          bubbles: true,
          cancelable: true,
        });
        document.body.dispatchEvent(submitEvent);
      }, 6000);

      // Simulate scroll
      setTimeout(() => {
        const scrollEvent = new Event('scroll', {
          bubbles: true,
          cancelable: true,
        });
        window.dispatchEvent(scrollEvent);
      }, 7000);
    };

    simulateActivity();
  }, []);

  const triggerError = () => {
    // Intentionally trigger an error for testing
    try {
      throw new Error('Test error for monitoring dashboard');
    } catch (error) {
      console.error('Test error:', error);
    }
  };

  const triggerPerformanceEvent = () => {
    // Simulate performance metric
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          console.log('Performance entry:', entry);
        });
      });

      try {
        observer.observe({ entryTypes: ['measure'] });

        // Create a performance measure
        performance.mark('test-start');
        setTimeout(() => {
          performance.mark('test-end');
          performance.measure('test-measure', 'test-start', 'test-end');
        }, 100);
      } catch (error) {
        console.warn('Performance API not fully supported');
      }
    }
  };

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-8'>Monitoring Test Page</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Test Monitoring Events</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-gray-600'>
              This page will automatically trigger various monitoring events to
              populate your dashboard with real data.
            </p>

            <Button onClick={triggerError} variant='destructive'>
              Trigger Test Error
            </Button>

            <Button onClick={triggerPerformanceEvent} variant='secondary'>
              Trigger Performance Event
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What&apos;s Being Monitored</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='text-sm'>
              <p>✅ Page views and navigation</p>
              <p>✅ User interactions (clicks, scrolls)</p>
              <p>✅ Form submissions</p>
              <p>✅ Performance metrics</p>
              <p>✅ Error tracking</p>
              <p>✅ System health metrics</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='mt-8'>
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className='list-decimal list-inside space-y-2 text-sm'>
              <li>Visit this page to trigger initial monitoring events</li>
              <li>Navigate to Sanity Studio → System Monitoring</li>
              <li>Click the &quot;Refresh&quot; button to see real data</li>
              <li>
                Interact with this page (click buttons, scroll) to generate more
                data
              </li>
              <li>Check the dashboard for real-time updates</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
