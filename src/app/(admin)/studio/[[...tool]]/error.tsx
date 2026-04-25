'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging
    console.error('Sanity Studio Error:', error);
  }, [error]);

  const handleReset = () => {
    // Clear any problematic URL state and reset
    if (typeof window !== 'undefined') {
      // Navigate to the base studio path to avoid nested URL issues
      window.location.href = '/studio';
    }
    reset();
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
            <AlertTriangle className='h-6 w-6 text-red-600' />
          </div>
          <CardTitle className='text-xl text-gray-900'>Studio Error</CardTitle>
          <CardDescription className='text-gray-600'>
            Something went wrong with the Sanity Studio. This often happens with
            complex nested URLs.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-sm text-gray-500 bg-gray-50 p-3 rounded-md'>
            <strong>Error:</strong> {error.message || 'Unknown error occurred'}
          </div>

          <div className='flex flex-col space-y-2'>
            <Button onClick={handleReset} className='w-full' variant='default'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Reset Studio
            </Button>

            <Button onClick={handleGoHome} className='w-full' variant='outline'>
              <Home className='mr-2 h-4 w-4' />
              Go to Homepage
            </Button>
          </div>

          <div className='text-xs text-gray-400 text-center'>
            If the problem persists, try clearing your browser cache or contact
            support.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
