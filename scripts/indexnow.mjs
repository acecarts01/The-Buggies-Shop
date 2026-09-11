#!/usr/bin/env node
// Submits every URL in the live sitemap index to IndexNow (Bing, Yandex,
// Naver, Seznam and Yep share the endpoint; Google does not use it).
//
//   node scripts/indexnow.mjs                 # every URL in the sitemap
//   node scripts/indexnow.mjs /shop/ /faq/    # only these paths
//
// The key file public/<key>.txt must be reachable at https://<host>/<key>.txt;
// SITE.indexNowKey in src/config/site.ts is that key. Run after each deploy
// that changes content. Vercel's deploy hook can call it as a post-deploy step.

const HOST = 'www.golfbuggiesexpress.com.au';
const KEY = 'golfbuggiesexpress-idx-2025';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'buggies-express-indexnow/1.0' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function sitemapUrls() {
  const index = await fetchText(`https://${HOST}/sitemap.xml`);
  const children = index.includes('<sitemapindex') ? locs(index) : [`https://${HOST}/sitemap.xml`];
  const urls = [];
  for (const child of children) urls.push(...locs(await fetchText(child)));
  return [...new Set(urls)];
}

async function main() {
  const args = process.argv.slice(2);
  const urlList = args.length ? args.map((p) => (p.startsWith('http') ? p : `https://${HOST}${p}`)) : await sitemapUrls();

  // Confirm the key file is live before submitting anything.
  const keyRes = await fetch(`https://${HOST}/${KEY}.txt`);
  if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
    throw new Error(`Key file https://${HOST}/${KEY}.txt is missing or does not contain the key`);
  }

  // IndexNow accepts up to 10,000 URLs per request; batch defensively.
  const batches = [];
  for (let i = 0; i < urlList.length; i += 500) batches.push(urlList.slice(i, i + 500));

  for (const batch of batches) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: batch }),
    });
    // 200 = accepted, 202 = accepted (key validation pending). Anything else is a problem.
    console.log(`IndexNow ${res.status} for ${batch.length} URLs`);
    if (res.status !== 200 && res.status !== 202) {
      console.error(await res.text());
      process.exitCode = 1;
    }
  }
  console.log(`Submitted ${urlList.length} URLs.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
