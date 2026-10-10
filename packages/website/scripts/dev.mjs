// Runs the library in watch mode next to Vite so edits to the library's source
// are rebuilt into `dist` and picked up without restarting the dev server.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const websiteDir = path.resolve(scriptsDir, '..');
const distIndex = path.resolve(websiteDir, '../simplyengineered/dist/index.js');

const children = [];
let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGINT');
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

// 1. Library: build once, then rebuild on change.
children.push(
  spawn('pnpm', ['--filter', 'simplyengineered', 'run', 'dev'], {
    cwd: websiteDir,
    stdio: 'inherit'
  })
);

// 2. Wait for the first build so Vite never resolves an empty package.
async function waitForDist(timeoutMs = 30000) {
  const start = Date.now();
  while (!existsSync(distIndex)) {
    if (Date.now() - start > timeoutMs) return;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}
await waitForDist();

// 3. Site: Vite watches the library's `dist` (see vite.config.ts) and reloads.
children.push(
  spawn('pnpm', ['exec', 'vite', 'dev', ...process.argv.slice(2)], {
    cwd: websiteDir,
    stdio: 'inherit'
  })
);

for (const child of children) {
  child.on('exit', (code) => {
    if (!shuttingDown && code) shutdown(code);
  });
}
