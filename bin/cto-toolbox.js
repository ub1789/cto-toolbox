#!/usr/bin/env node
import { fileURLToPath } from 'url';
import path from 'path';
import { createRequire } from 'module';

// This is a shim to run the compiled TS code
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

async function main() {
  try {
    // In production, we'd run from dist/cli.js
    // For this local setup, we'll use a dynamic import of the compiled file
    const cliPath = path.join(__dirname, '../dist/cli.js');
    await import(cliPath);
  } catch (e) {
    console.error('Error: The toolbox is not compiled. Please run `npm run build` first.');
    process.exit(1);
  }
}

main();
