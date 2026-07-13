import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';

const requiredFiles = [
  'index.html',
  'styles.css',
  'script.js',
  'vercel.json',
  'robots.txt',
  'sitemap.xml',
  'assets/telvoice-ai-isotipo.svg',
  'assets/telvoice-ai-logo.svg',
  'assets/favicon.svg',
  'api/contact.js'
];

for (const file of requiredFiles) {
  await access(new URL(`../${file}`, import.meta.url), constants.R_OK);
}

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

const checks = [
  [html.includes('<h1>'), 'index.html must include one h1'],
  [(html.match(/<h1/g) || []).length === 1, 'index.html must include exactly one h1'],
  [html.includes('https://telvoice.ai/'), 'canonical telvoice.ai URL is missing'],
  [html.includes('data-contact-form'), 'contact form is missing'],
  [html.includes('prefers-reduced-motion') || css.includes('prefers-reduced-motion'), 'reduced motion support is missing'],
  [css.includes('@media (max-width: 680px)'), 'mobile styles are missing']
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Telvoice AI validation passed.');
