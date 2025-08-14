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
    <div className='max-h-[600px] w-full overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
      <div className='w-full min-w-0 [&_.jp-Notebook]:text-xs sm:[&_.jp-Notebook]:text-sm [&_.jp-InputArea]:text-xs sm:[&_.jp-InputArea]:text-sm [&_.jp-OutputArea]:text-xs sm:[&_.jp-OutputArea]:text-sm [&_.jp-RenderedHTMLCommon]:text-xs sm:[&_.jp-RenderedHTMLCommon]:text-sm [&_.jp-RenderedText]:text-xs sm:[&_.jp-RenderedText]:text-sm [&_.jp-InputPrompt]:text-xs sm:[&_.jp-InputPrompt]:text-sm [&_.jp-OutputPrompt]:text-xs sm:[&_.jp-OutputPrompt]:text-sm [&_.jp-Cell-inputWrapper]:p-2 sm:[&_.jp-Cell-inputWrapper]:p-3 [&_.jp-Cell-outputWrapper]:p-2 sm:[&_.jp-Cell-outputWrapper]:p-3 [&_.jp-RenderedHTMLCommon]:leading-relaxed [&_.jp-RenderedText]:leading-relaxed [&_.jp-InputArea-editor]:text-xs sm:[&_.jp-InputArea-editor]:text-sm [&_.jp-OutputArea-output]:text-xs sm:[&_.jp-OutputArea-output]:text-sm [&_.jp-InputPrompt]:min-w-[3rem] sm:[&_.jp-InputPrompt]:min-w-[4rem] [&_.jp-InputPrompt]:text-right [&_.jp-InputPrompt]:pr-2 [&_.jp-InputPrompt]:text-gray-500 [&_.jp-OutputPrompt]:min-w-[3rem] sm:[&_.jp-OutputPrompt]:min-w-[4rem] [&_.jp-OutputPrompt]:text-right [&_.jp-OutputPrompt]:pr-2 [&_.jp-OutputPrompt]:text-gray-500 [&_.jp-Cell]:border-b [&_.jp-Cell]:border-gray-100 [&_.jp-Cell]:dark:border-gray-800 [&_.jp-Cell]:last:border-b-0 [&_.jp-InputArea]:bg-gray-50 [&_.jp-InputArea]:dark:bg-gray-800/50 [&_.jp-OutputArea]:bg-white [&_.jp-OutputArea]:dark:bg-gray-900 [&_.jp-RenderedHTMLCommon]:prose [&_.jp-RenderedHTMLCommon]:prose-sm [&_.jp-RenderedHTMLCommon]:max-w-none [&_.jp-RenderedHTMLCommon]:prose-headings:text-gray-900 [&_.jp-RenderedHTMLCommon]:dark:prose-headings:text-gray-100 [&_.jp-RenderedHTMLCommon]:prose-p:text-gray-700 [&_.jp-RenderedHTMLCommon]:dark:prose-p:text-gray-300 [&_.jp-RenderedText]:font-mono [&_.jp-RenderedText]:text-gray-800 [&_.jp-RenderedText]:dark:text-gray-200 [&_.jp-InputArea-editor]:font-mono [&_.jp-InputArea-editor]:bg-transparent [&_.jp-InputArea-editor]:border-0 [&_.jp-InputArea-editor]:focus:outline-none [&_.jp-InputArea-editor]:focus:ring-0 [&_.jp-OutputArea-output]:font-mono [&_.jp-OutputArea-output]:text-gray-800 [&_.jp-OutputArea-output]:dark:text-gray-200'>
        <JupyterViewer rawIpynb={notebook} showLineNumbers={false} />
      </div>
    </div>
  );
}
