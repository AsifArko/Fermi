'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ChevronDown,
  Download,
  FileText,
  FileSpreadsheet,
  File,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type LessonFile = {
  _key: string;
  asset: {
    _id: string;
    _type: string;
    originalFilename: string | null;
    url: string | null;
    mimeType: string | null;
    size: number | null;
  } | null;
  title: string | null;
  description: string | null;
};

interface LessonFilesProps {
  files?: LessonFile[];
}

export function LessonFiles({ files }: LessonFilesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!files || files.length === 0) {
    return null;
  }

  const getFileIcon = (filename: string | null) => {
    if (!filename) return <File className="h-3.5 w-3.5" />;
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-3.5 w-3.5" />;
      case 'csv':
        return <FileSpreadsheet className="h-3.5 w-3.5" />;
      case 'txt':
        return <File className="h-3.5 w-3.5" />;
      default:
        return <File className="h-3.5 w-3.5" />;
    }
  };

  const getFileType = (filename: string | null) => {
    if (!filename) return 'FILE';
    const extension = filename.split('.').pop()?.toUpperCase();
    return extension || 'FILE';
  };

  const handleDownload = async (file: LessonFile) => {
    if (!file.asset || !file.title) {
      console.error('File asset or title is missing');
      return;
    }

    try {
      // Use the asset ID directly since we now have the expanded asset
      const assetId = file.asset._id;

      console.log('Downloading file:', {
        title: file.title,
        assetId: assetId,
        originalFilename: file.asset.originalFilename,
        url: file.asset.url,
      });

      // If we have a direct URL from Sanity, use it
      if (file.asset.url) {
        window.open(file.asset.url, '_blank');
        return;
      }

      // Otherwise, use our server-side API route
      const downloadUrl = `/api/files/${assetId}`;

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-muted/30">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between p-0 h-auto font-normal text-left"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-medium">
            Lesson Resources ({files.length})
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </Button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          {files.map(file => (
            <div
              key={file._key}
              className="flex items-center justify-between p-2.5 bg-background rounded-md border border-border/50"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="text-primary">{getFileIcon(file.title)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium truncate">
                      {file.title || 'Untitled File'}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded text-[10px]">
                      {getFileType(file.title)}
                    </span>
                  </div>
                  {file.description && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 cursor-default">
                          {file.description}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-xs text-xs leading-relaxed bg-primary/90 backdrop-blur-sm text-center"
                        sideOffset={5}
                      >
                        <p className="whitespace-pre-wrap text-left">
                          {file.description}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(file)}
                className="ml-2 shrink-0 h-7 w-7 p-0"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
