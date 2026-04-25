import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  change?: string;
}

const MetricCard: React.FC<MetricCardProps> = React.memo(
  ({ title, value, description, icon, change }) => (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{change || description}</p>
      </CardContent>
    </Card>
  )
);

MetricCard.displayName = 'MetricCard';

export default MetricCard;
