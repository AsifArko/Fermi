import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, BookOpen } from 'lucide-react';

export default function StudioLoading() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
            <BookOpen className='h-6 w-6 text-blue-600' />
          </div>
          <CardTitle className='text-xl text-gray-900'>
            Loading Studio
          </CardTitle>
          <CardDescription className='text-gray-600'>
            Sanity Studio is initializing...
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <div className='flex items-center justify-center space-x-2'>
            <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
            <span className='text-sm text-gray-600'>
              Preparing content management tools
            </span>
          </div>

          <div className='mt-4 text-xs text-gray-400'>
            This may take a few moments on first load
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
