import fs from 'node:fs'; import path from 'node:path';
import { parse } from 'csv-parse/sync'; import XLSX from 'xlsx';
const ROOT = 'C:/VERCEL PROJECTS/Buggy Carts';
export const norm = (s) => String(s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
const num = (v) => { const n = parseFloat(String(v).replace(/,/g, '')); return Number.isFinite(n) ? n : null; };
export function loadAll() {
  const rows = []; const perSource = {};
  const dir = path.join(ROOT, 'Keyword Export');
  for (const f of fs.readdirSync(dir).filter((x) => /\.csv$/i.test(x))) {
    const recs = parse(fs.readFileSync(path.join(dir, f)), { columns: true, bom: true, skip_empty_lines: true, relax_column_count: true });
    perSource['csv:' + f] = recs.length;
    for (const r of recs) rows.push({ kw: norm(r['Keyword']), intent: String(r['Intent'] ?? '').trim(), rel: num(r['Relevance']), vol: num(r['Volume']), kd: num(r['Keyword Difficulty']), cpc: num(r['CPC (USD)']), src: 'csv' });
  }
  const wb = XLSX.readFile(path.join(ROOT, 'golf-buggy-keywords-AU.xlsx'));
  const sheet = (n) => XLSX.utils.sheet_to_json(wb.Sheets[n], { defval: '' });
  const t200 = sheet('Top 200 Scored'); perSource['xlsx:Top 200 Scored'] = t200.length;
  for (const r of t200) rows.push({ kw: norm(r['Keyword']), intent: String(r['Intent']).trim(), rel: num(r['Relevance']), vol: num(r['Volume/mo']), kd: num(r['KD']), cpc: num(r['CPC (USD)']), src: 'xlsx-top200', track: r['Track'] });
  const ck = sheet('City Keywords'); perSource['xlsx:City Keywords'] = ck.length;
  for (const r of ck) rows.push({ kw: norm(r['Keyword']), intent: String(r['Intent']).trim(), rel: null, vol: num(r['Volume/mo']), kd: num(r['KD']), cpc: num(r['CPC (USD)']), src: 'xlsx-city', track: r['Track'], city: r['City page'] });
  const t14 = sheet('Top 14 Picks').filter((r) => r['Keyword'] && typeof r['#'] === 'number'); perSource['xlsx:Top 14 Picks'] = t14.length;
  for (const r of t14) rows.push({ kw: norm(r['Keyword']), intent: String(r['Intent']).trim(), rel: null, vol: num(r['Vol/mo']), kd: num(r['KD']), cpc: num(r['CPC (USD)']), src: 'xlsx-top14' });
  return { rows: rows.filter((r) => r.kw), perSource, empty: rows.filter((r) => !r.kw).length };
}
