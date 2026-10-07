// npm run links:check - verifies every outbound link in src/config/references.ts
// and that every guide slug it maps exists. Run it before a release.
//
// 200-399 = ok. 403/429 = the site is answering a scripted request with bot
// protection (ACCC, VicRoads, SA Government and others do); open the link in a
// browser to confirm. Anything else (404, 410, 5xx, DNS) is a dead link: fix or
// remove it in references.ts.
import fs from 'node:fs';

const refs = fs.readFileSync(new URL('../src/config/references.ts', import.meta.url), 'utf8');
const posts = fs.readFileSync(new URL('../src/config/posts.ts', import.meta.url), 'utf8');
const urls = [...new Set([...refs.matchAll(/url: '(https?:\/\/[^']+)'/g)].map((m) => m[1]))];
const slugs = new Set([...posts.matchAll(/slug: ['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]));
const mapped = [...refs.matchAll(/^\s{2}'([a-z0-9-]+)': \[/gm)].map((m) => m[1]).filter((s) => s.length > 12);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

let bad = 0;
for (const s of mapped) if (!slugs.has(s) && /-/.test(s) && !/^(qld|nsw|vic|sa|wa|accc|ato|moneysmart|abr|asic|nhvr|wiki|rules|golf|maker)-/.test(s)) { console.log('MISSING GUIDE SLUG', s); bad++; }

const results = await Promise.all(
  urls.map(async (u) => {
    try {
      const r = await fetch(u, { redirect: 'follow', headers: { 'user-agent': UA, accept: 'text/html' }, signal: AbortSignal.timeout(20000) });
      return { u, status: r.status, final: r.url };
    } catch (e) {
      return { u, status: 0, final: String(e.cause?.code ?? e.message) };
    }
  })
);
for (const { u, status, final } of results) {
  const tag = status >= 200 && status < 400 ? 'ok     ' : status === 403 || status === 429 ? 'blocked' : 'DEAD   ';
  if (tag === 'DEAD   ') bad++;
  console.log(`${tag} ${status} ${u}${final !== u ? '  -> ' + final : ''}`);
}
console.log(bad ? `\n${bad} problem(s)` : '\nno dead links (blocked = confirm in a browser)');
process.exit(bad ? 1 : 0);
