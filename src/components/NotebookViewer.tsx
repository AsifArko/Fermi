import React from 'react';
import JupyterViewer from 'react-jupyter-notebook';

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

export default function NotebookViewer({
  notebook,
}: {
  notebook: { cells: cellType[] };
}) {
  if (!notebook || typeof notebook !== 'object') {
    return <div>Invalid notebook data</div>;
  }
  return (
    <div className="max-h-[600px] w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="min-w-[600px]">
        <JupyterViewer rawIpynb={notebook} />
      </div>
    </div>
  );
}
