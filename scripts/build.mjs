import { cp, mkdir, rm } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);

const files = [
  'index.html',
  'styles.css',
  'script.js',
  'robots.txt',
  'sitemap.xml',
  'privacidad.html',
  'terminos.html'
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of files) {
  await cp(new URL(file, root), new URL(file, dist));
}

await cp(new URL('assets/', root), new URL('assets/', dist), { recursive: true });

console.log('Static site generated in dist/.');
