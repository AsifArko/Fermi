'use client';
import { useEffect, useState } from 'react';
import NotebookViewer from './NotebookViewer';

interface cellOutputType {
  name?: string;
  data?: { [key: string]: unknown };
  metadata?: { [key: string]: unknown };
  output_type?: string;
  text?: string[];
  execution_count?: number;
  traceback?: string[];
}

interface cellType {
  cell_type?: string;
  execution_count?: number;
  metadata: {
    scrolled?: boolean;
    collapsed?: boolean;
    jupyter?: {
      source_hidden?: boolean;
      outputs_hidden?: boolean;
    };
    [key: string]: unknown;
  };
  outputs?: cellOutputType[];
  source?: string[];
}

export default function NotebookPreview({ url }: { url: string }) {
  const [notebook, setNotebook] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch notebook');
        return res.json();
      })
      .then(setNotebook)
      .catch(err => setError(err.message));
  }, [url]);

  if (!url) return null;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!notebook) return <div>Loading notebook...</div>;
  if (typeof notebook !== 'object' || !('cells' in notebook)) {
    return <div>Invalid notebook data</div>;
  }
  return <NotebookViewer notebook={notebook as { cells: cellType[] }} />;
}
