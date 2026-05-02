import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const browserDir = path.join(root, 'dist', 'luxe-storefront', 'browser');

const src = fs.existsSync(path.join(browserDir, 'index.html'))
  ? path.join(browserDir, 'index.html')
  : path.join(browserDir, 'index.csr.html');

fs.copyFileSync(src, path.join(browserDir, '404.html'));
console.log('✓  Copied', path.basename(src), '→ 404.html');
