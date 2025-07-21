import React from 'react';

interface JupyterNotebookProps {
  jupyterNotebookUrl?: string;
}

export const JupyterNotebook: React.FC<JupyterNotebookProps> = ({
  jupyterNotebookUrl,
}) => {
  if (!jupyterNotebookUrl) return null;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-normal mb-5 text-primary/96 tracking-tight">
        Jupyter Notebook
      </h2>
      <div
        className="w-full overflow-auto border rounded-lg shadow-lg"
        style={{ resize: 'vertical', height: '450px' }}
      >
        <iframe
          src={jupyterNotebookUrl}
          className="w-full h-full"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};
