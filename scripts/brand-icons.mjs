#!/usr/bin/env node
// Generates every brand asset from ONE source file.
//
//   public/brand/logo.png        the owner's full logo, transparent background (footer, schema)
//   public/brand/logo-mark.png   optional: the shield alone, transparent (header mark, all icons)
//                                 (falls back to logo.png when absent)
//
// Produces:
//   public/brand/logo-mark-512.png  square mark on the brand tint            (manifest)
//   public/brand/logo-mark-192.png                                            (manifest)
//   app/icon.png                    512x512 square mark                         (browser tab, Google)
//   app/apple-icon.png              180x180 square mark, opaque                 (iOS home screen)
//   app/favicon.ico                 16 / 32 / 48 px PNG frames in one ICO       (legacy + Google SERP)
//   src/config/brand-assets.ts      what exists, so components never 404 a missing file
//
// With no source file present it still (re)builds favicon.ico / icon.png /
// apple-icon.png from the existing app/icon.png so the icon set stays valid,
// and records `logo: null` so the header falls back to the monogram.
//
//   npm run brand

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const BRAND_DIR = path.join(ROOT, 'public', 'brand');
const APP_DIR = path.join(ROOT, 'app');
const TINT = { r: 247, g: 239, b: 234, alpha: 1 }; // SITE.accentTint #F7EFEA
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

function findSource() {
  const p = path.join(BRAND_DIR, 'logo.png');
  return fs.existsSync(p) ? p : null;
}
function findMark() {
  const p = path.join(BRAND_DIR, 'logo-mark.png');
  return fs.existsSync(p) ? p : null;
}

/** Pack PNG buffers into a single .ico (PNG-in-ICO, supported by every current browser and by Google). */
function packIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  const dir = Buffer.alloc(16 * frames.length);
  let offset = 6 + dir.length;
  frames.forEach((f, i) => {
    const o = i * 16;
    dir[o] = f.size >= 256 ? 0 : f.size;
    dir[o + 1] = f.size >= 256 ? 0 : f.size;
    dir[o + 2] = 0;
    dir[o + 3] = 0;
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(f.buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += f.buf.length;
  });
  return Buffer.concat([header, dir, ...frames.map((f) => f.buf)]);
}

/** A square mark: the logo centred on the tint with ~10% padding. */
async function squareMark(input, size, background) {
  const inner = Math.round(size * 0.8);
  const logo = await sharp(input).resize(inner, inner, { fit: 'inside', withoutEnlargement: false }).png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toBuffer();
}

async function main() {
  fs.mkdirSync(BRAND_DIR, { recursive: true });
  const source = findSource();

  let markSource; // buffer used for the square icons
  let logoMeta = null;
  let markMeta = null;

  if (source) {
    const meta = await sharp(source).metadata();
    logoMeta = { path: '/brand/logo.png', width: meta.width, height: meta.height };
    console.log(`logo.png ${meta.width}x${meta.height}`);
    const mark = findMark();
    if (mark) {
      const mm = await sharp(mark).metadata();
      markMeta = { path: '/brand/logo-mark.png', width: mm.width, height: mm.height };
      markSource = fs.readFileSync(mark);
      console.log(`logo-mark.png ${mm.width}x${mm.height} (icons use the shield)`);
    } else {
      markSource = fs.readFileSync(source);
      console.log('no logo-mark.png: icons use the full logo');
    }
  } else {
    console.log('no public/brand/logo.* found - rebuilding the icon set from app/icon.png');
    markSource = fs.readFileSync(path.join(APP_DIR, 'icon.png'));
  }

  // Square icons. When the source is already square-ish, the mark is just the
  // logo on the tint; a wide logo gets letterboxed into the square.
  const icon512 = source ? await squareMark(markSource, 512, TINT) : await sharp(markSource).resize(512, 512).png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toBuffer();
  fs.writeFileSync(path.join(APP_DIR, 'icon.png'), icon512);
  fs.writeFileSync(path.join(BRAND_DIR, 'logo-mark-512.png'), icon512);
  fs.writeFileSync(path.join(BRAND_DIR, 'logo-mark-192.png'), await sharp(icon512).resize(192, 192).png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toBuffer());
  // Apple ignores transparency (shows black), so the touch icon is opaque.
  fs.writeFileSync(
    path.join(APP_DIR, 'apple-icon.png'),
    await sharp(icon512).resize(180, 180).flatten({ background: source ? '#F7EFEA' : '#B45A40' }).png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toBuffer()
  );
  // Google's SERP favicon rule: a multiple of 48px, so 48 is the frame that matters.
  const frames = [];
  for (const size of [16, 32, 48]) {
    frames.push({ size, buf: await sharp(icon512).resize(size, size).png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toBuffer() });
  }
  fs.writeFileSync(path.join(APP_DIR, 'favicon.ico'), packIco(frames));
  console.log('icon.png 512, apple-icon.png 180, favicon.ico 16/32/48, logo-mark 512/192');

  const ts = [
    '// GENERATED by scripts/brand-icons.mjs - do not edit. Run `npm run brand`.',
    '//',
    '// What brand files exist, so the header, footer and schema can reference',
    '// the real logo when it is there and fall back to the monogram when it is',
    '// not, without ever requesting a file that 404s.',
    '',
    'export const BRAND_ASSETS = {',
    `  /** The full logo (wordmark + shield), or null while none has been supplied. */`,
    `  logo: ${logoMeta ? JSON.stringify(logoMeta) : 'null'} as { path: string; width: number; height: number } | null,`,
    `  /** The shield alone, for the header and small placements; null falls back to the logo. */`,
    `  mark: ${markMeta ? JSON.stringify(markMeta) : 'null'} as { path: string; width: number; height: number } | null,`,
    `  /** Square mark, always present (generated from the logo, or the monogram). */`,
    `  mark512: '/brand/logo-mark-512.png',`,
    `  mark192: '/brand/logo-mark-192.png',`,
    `  generatedAt: '${new Date().toISOString().slice(0, 10)}',`,
    '};',
    '',
  ].join('\r\n');
  fs.writeFileSync(path.join(ROOT, 'src', 'config', 'brand-assets.ts'), ts);
  console.log(`brand-assets.ts: logo ${logoMeta ? 'present' : 'null (monogram fallback)'}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
