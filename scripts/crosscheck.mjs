#!/usr/bin/env node
// Pre-ship crosscheck. Runs AFTER `next build` against the build output and
// exits non-zero on any failure. `npm run build && npm run crosscheck`.
//
//  1. Every prerendered page: one <h1>, valid JSON-LD (no plaintext or
//     entity email inside it, Product has image), og:image + twitter:image,
//     canonical == og:url, title <= 62 (entity-decoded), description 110-160.
//  2. Admin / pay / thank-you pages are noindex; robots.txt blocks them.
//  3. Sitemap children exist in the build.
//  4. Email templates pass scripts/email-lint.ts (bulletproof tables,
//     color-scheme metas, inline CSS, size).
//  5. No secrets in tracked files.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const APP = path.join(ROOT, '.next', 'server', 'app');
const failures = [];
const notes = [];
const fail = (m) => failures.push(m);

if (!fs.existsSync(APP)) {
  console.error('No build output at .next/server/app - run `npm run build` first.');
  process.exit(1);
}

function walk(d, out = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// ---- 1 + 2: pages
const files = walk(APP);
const titles = new Map();
let indexable = 0;
const NOINDEX_ROUTES = [/^\/admin/, /^\/pay/, /^\/thank-you/, /^\/search$/, /_not-found/];
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  const route = f.split(path.sep).join('/').replace(/^.*server\/app/, '').replace(/\.html$/, '') || '/';
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(`${route}: ${h1} <h1>`);
  for (const b of [...s.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])) {
    try {
      JSON.parse(b);
      if (/sales@/.test(b)) fail(`${route}: plaintext email in JSON-LD`);
      if (/&#64;/.test(b)) fail(`${route}: HTML entity inside JSON-LD`);
      if (/"@type":"Product"/.test(b) && !/"image":\[/.test(b)) fail(`${route}: Product without image`);
    } catch {
      fail(`${route}: invalid JSON-LD`);
    }
  }
  const noindex = /<meta name="robots" content="noindex/.test(s);
  const mustBeNoindex = NOINDEX_ROUTES.some((re) => re.test(route));
  if (mustBeNoindex && !noindex) fail(`${route}: must be noindex`);
  if (mustBeNoindex || noindex) continue;
  indexable++;
  if (!/<meta property="og:image"/.test(s)) fail(`${route}: no og:image`);
  if (!/<meta name="twitter:image"/.test(s)) fail(`${route}: no twitter:image`);
  const canon = (s.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  if (!canon) fail(`${route}: no canonical`);
  const ogurl = (s.match(/<meta property="og:url" content="([^"]*)"/) || [])[1];
  if (canon && ogurl && canon !== ogurl) fail(`${route}: og:url != canonical`);
  const t = decode((s.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  if (t.length > 62) fail(`${route}: title ${t.length} chars`);
  if (titles.has(t)) fail(`${route}: duplicate title with ${titles.get(t)}`);
  titles.set(t, route);
  const d = decode((s.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  if (d.length < 110 || d.length > 160) fail(`${route}: description ${d.length} chars`);
}
notes.push(`${files.length} pages checked, ${indexable} indexable`);

// ---- 2b: robots.txt
const robots = fs.readFileSync(path.join(ROOT, 'public', 'robots.txt'), 'utf8');
for (const p of ['/admin/', '/pay/', '/api/admin/', '/api/orders/']) {
  if (!robots.includes(`Disallow: ${p}`)) fail(`robots.txt: missing Disallow: ${p}`);
}
if (!/Sitemap: https:\/\/www\.golfbuggiesexpress\.com\.au\/sitemap\.xml/.test(robots)) fail('robots.txt: sitemap line missing');

// ---- 3: sitemap children
for (const id of [0, 1, 2, 3]) {
  const p = path.join(APP, 'sitemap', `${id}.xml.body`);
  const alt = path.join(APP, 'sitemap', `${id}.xml`);
  if (!fs.existsSync(p) && !fs.existsSync(alt)) fail(`sitemap/${id}.xml not in build output`);
}

// ---- 4: email templates
const lint = spawnSync('bun', ['scripts/email-lint.ts'], { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32' });
if (lint.status !== 0) {
  fail('email lint failed:\n' + (lint.stderr || lint.stdout));
} else {
  notes.push('email templates: ' + (lint.stdout.split('\n').filter((l) => l.includes(' tables,')).length) + ' rendered, all bulletproof');
}

// ---- 5: secrets
const tracked = spawnSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).stdout.split('\n').filter(Boolean);
for (const f of tracked) {
  if (/^\.env/.test(f) && f !== '.env.example') fail(`${f} is tracked`);
  if (/\.(ts|tsx|js|mjs|json)$/.test(f)) {
    const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (/(SMTP_PASS|ORDER_SIGNING_SECRET|ADMIN_PASSPHRASE)\s*[=:]\s*['"][^'"]{8,}/.test(s) && !/process\.env/.test(s.slice(0, 200))) fail(`${f}: looks like a hard-coded secret`);
  }
}

console.log(notes.map((n) => '  ' + n).join('\n'));
if (failures.length) {
  console.error(`\nCROSSCHECK FAILED (${failures.length})`);
  failures.forEach((f) => console.error(' - ' + f));
  process.exit(1);
}
console.log('\ncrosscheck OK');
