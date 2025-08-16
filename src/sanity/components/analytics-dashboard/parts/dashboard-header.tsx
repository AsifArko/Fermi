import { RefreshCw } from 'lucide-react';

import React from 'react';

import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  refreshing,
}) => {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-3xl font-bold'>Analytics Dashboard</h1>
        <p className='text-sm text-muted-foreground/70'>
          Monitor your application&apos;s performance, user behavior, and system
          health
        </p>
      </div>
      <Button
        onClick={onRefresh}
        disabled={refreshing}
        className='flex items-center justify-center'
      >
        <RefreshCw
          className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
        />
        Refresh
      </Button>
    </div>
  );
};

export default DashboardHeader;
