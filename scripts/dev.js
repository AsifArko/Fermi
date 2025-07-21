// scripts/dev.js
const { spawn, execSync } = require('child_process');

execSync('rm -rf .next');

// Start Next.js dev server
const nextDev = spawn('next', ['dev'], { stdio: 'inherit', shell: true });

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
  nextDev.kill('SIGINT');
  jupyter.kill('SIGINT');
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
