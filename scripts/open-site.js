import { exec } from 'node:child_process';

const url = 'https://ciis-system.vercel.app/';

const command =
  process.platform === 'darwin'
    ? `open "${url}"`
    : process.platform === 'win32'
    ? `start "" "${url}"`
    : `xdg-open "${url}"`;

console.log(`🚀 Opening CIIS School System: ${url}`);
exec(command, (err) => {
  if (err) {
    console.error('Failed to open browser:', err.message);
  }
});
