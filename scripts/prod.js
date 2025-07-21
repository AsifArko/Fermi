// scripts/prod.js
const { spawn, execSync } = require('child_process');

execSync('rm -rf .next');

const nextStart = spawn('next', ['start'], { stdio: 'inherit', shell: true });

// Start Jupyter notebook server
const jupyter = spawn(
  'jupyter',
  [
    'notebook',
    '--notebook-dir=./notebooks',
    '--ip=0.0.0.0',
    '--port=8888',
    '--no-browser',
    '--NotebookApp.token=fermi',
  ],
  { stdio: 'inherit', shell: true }
);

// Graceful shutdown
const cleanup = () => {
  console.log('\nGracefully shutting down...');
  nextStart.kill('SIGINT');
  jupyter.kill('SIGINT');
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
