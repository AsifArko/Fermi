import { RefreshCw } from 'lucide-react';

import React from 'react';

import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  lastRefreshTime: Date;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  refreshing,
  lastRefreshTime,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-xl font-bold'>Analytics Dashboard</h1>
        <p className='text-sm text-muted-foreground/70'>
          Monitor your application&apos;s performance, user behavior, and system
          health
        </p>
        {lastRefreshTime && (
          <p className='text-xs text-muted-foreground/50 mt-1'>
            Last updated: {formatTime(lastRefreshTime)}
          </p>
        )}
      </div>
      <Button
        onClick={onRefresh}
        disabled={refreshing}
        className='flex items-center justify-center gap-2 px-4 py-2'
      >
        <RefreshCw
          className={`h-4 w-4 ${refreshing ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-300'}`}
        />
        <span>Refresh</span>
      </Button>
    </div>
  );
};

export default DashboardHeader;
