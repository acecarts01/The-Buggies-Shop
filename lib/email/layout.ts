// Bulletproof HTML email primitives.
//
// Every <table> and <td> is emitted with BOTH a bgcolor attribute and a
// background-color style: Outlook and Apple Mail paint an unstyled nested
// table opaque white regardless of its parent, which turns a dark template
// into white boxes on a phone. All CSS is inline; the <style> block only
// carries the color-scheme hint, a mobile media query and the badge glow
// (which degrades to a static badge where keyframes are unsupported).
import { CONTACT, ABN_INFO, SITE } from '@/src/config/site';

export const E = {
  navy: '#0B1F3A',
  navyDeep: '#071527',
  navySoft: '#12294A',
  gold: '#B8973F',
  goldLight: '#D9C27A',
  white: '#FFFFFF',
  bone: '#F7F6F2',
  line: '#E3E6EC',
  ink: '#1A1F2B',
  muted: '#6B7280',
  mutedOnNavy: '#A9B4C6',
  success: '#1E7A46',
  successSoft: '#E4F4EA',
};

export const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
export const SERIF = "Georgia, 'Times New Roman', serif";

export function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** A table with bgcolor + background-color always set. */
export function table(bg: string, inner: string, extra = '', width = '100%'): string {
  return `<table role="presentation" width="${width}" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="width:${width === '100%' ? '100%' : width + 'px'};border-collapse:collapse;background-color:${bg};${extra}">${inner}</table>`;
}

/** A cell with bgcolor + background-color always set. */
export function td(bg: string, style: string, inner: string, attrs = ''): string {
  return `<td bgcolor="${bg}" ${attrs} style="background-color:${bg};${style}">${inner}</td>`;
}

export function row(bg: string, style: string, inner: string, attrs = ''): string {
  return `<tr>${td(bg, style, inner, attrs)}</tr>`;
}

export function spacer(bg: string, h: number): string {
  return `<tr>${td(bg, `height:${h}px;line-height:${h}px;font-size:0;`, '&nbsp;')}</tr>`;
}

export function button(href: string, label: string, opts: { bg?: string; color?: string; full?: boolean } = {}): string {
  const bg = opts.bg ?? E.gold;
  const color = opts.color ?? E.navyDeep;
  return table(
    bg,
    `<tr>${td(
      bg,
      `border-radius:8px;text-align:center;`,
      `<a href="${esc(href)}" style="display:${opts.full ? 'block' : 'inline-block'};padding:14px 26px;font-family:${FONT};font-size:15px;font-weight:700;color:${color};text-decoration:none;border-radius:8px;letter-spacing:0.2px;">${label}</a>`
    )}</tr>`,
    'border-radius:8px;',
    opts.full ? '100%' : 'auto'
  ).replace('width:autopx', 'width:auto');
}

/** Label / value pair row on a light card. */
export function kv(label: string, value: string, opts: { mono?: boolean; strong?: boolean } = {}): string {
  return `<tr>
    ${td(E.white, `padding:9px 0;border-bottom:1px solid ${E.line};font-family:${FONT};font-size:12px;color:${E.muted};text-transform:uppercase;letter-spacing:0.6px;vertical-align:top;width:38%;`, label)}
    ${td(E.white, `padding:9px 0;border-bottom:1px solid ${E.line};font-family:${opts.mono ? "'Courier New', Courier, monospace" : FONT};font-size:${opts.mono ? 13 : 14}px;color:${E.ink};font-weight:${opts.strong ? 700 : 400};vertical-align:top;text-align:right;word-break:break-all;`, value)}
  </tr>`;
}

export interface ShellOpts {
  title: string;
  preheader: string;
  /** Inner rows of the 600px container. */
  body: string;
  /** Text under the logo in the header band. */
  headerNote?: string;
  siteUrl: string;
  logoUrl: string;
  footerNote?: string;
}

export function emailShell(o: ShellOpts): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-AU">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title>${esc(o.title)}</title>
<style type="text/css">
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table { border-collapse:collapse; mso-table-lspace:0; mso-table-rspace:0; }
  img { border:0; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; }
  @keyframes be-glow { 0%,100% { box-shadow:0 0 0 0 rgba(184,151,63,0.45); } 50% { box-shadow:0 0 0 8px rgba(184,151,63,0); } }
  .be-badge { animation: be-glow 2.2s ease-out infinite; }
  @media only screen and (max-width: 620px) {
    .be-container { width:100% !important; }
    .be-pad { padding-left:18px !important; padding-right:18px !important; }
    .be-stack { display:block !important; width:100% !important; }
    .be-h1 { font-size:24px !important; line-height:30px !important; }
  }
</style>
</head>
<body bgcolor="${E.navyDeep}" style="margin:0;padding:0;background-color:${E.navyDeep};">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;color:${E.navyDeep};">${esc(o.preheader)}${'&#847;&zwnj;&nbsp;'.repeat(20)}</div>
${table(
  E.navyDeep,
  `<tr>${td(
    E.navyDeep,
    'padding:28px 12px;',
    `<!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="${E.navyDeep}" style="background-color:${E.navyDeep};"><tr><td bgcolor="${E.navyDeep}" style="background-color:${E.navyDeep};"><![endif]-->
    ${table(
      E.navy,
      `${row(
        E.navy,
        `padding:26px 28px 18px 28px;text-align:center;`,
        `<a href="${esc(o.siteUrl)}" style="text-decoration:none;"><img src="${esc(o.logoUrl)}" width="132" alt="The Buggies Express" style="display:inline-block;width:132px;height:auto;" /></a>
         ${o.headerNote ? `<div style="font-family:${FONT};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${E.gold};padding-top:12px;">${o.headerNote}</div>` : ''}`,
        'class="be-pad"'
      )}
      ${o.body}
      ${row(
        E.navyDeep,
        `padding:22px 28px 26px 28px;text-align:center;font-family:${FONT};font-size:11px;line-height:17px;color:${E.mutedOnNavy};`,
        `${esc(ABN_INFO.companyName)} · ABN ${esc(ABN_INFO.abn)} · ${esc(ABN_INFO.locality)}<br />
         <a href="${esc(o.siteUrl)}" style="color:${E.goldLight};text-decoration:none;">${esc(SITE.domain.replace(/^www\./, ''))}</a> · <a href="mailto:${CONTACT.email}" style="color:${E.goldLight};text-decoration:none;">${CONTACT.email}</a> · ${esc(CONTACT.phoneDisplay)}
         ${o.footerNote ? `<br /><span style="color:${E.mutedOnNavy};">${o.footerNote}</span>` : ''}`,
        'class="be-pad"'
      )}`,
      'border-radius:14px;overflow:hidden;',
      '600'
    ).replace('width="600"', 'width="600" align="center" class="be-container"').replace('width:600px', 'width:600px;max-width:600px;margin:0 auto')}
    <!--[if mso]></td></tr></table><![endif]-->`,
    'align="center"'
  )}</tr>`
)}
</body>
</html>`;
}

/** Glowing status badge (animated where keyframes work, static elsewhere). */
export function statusBadge(text: string, opts: { bg?: string; color?: string } = {}): string {
  const bg = opts.bg ?? E.gold;
  const color = opts.color ?? E.navyDeep;
  return `<span class="be-badge" style="display:inline-block;padding:7px 14px;border-radius:999px;background-color:${bg};color:${color};font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;">
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${color};margin-right:8px;vertical-align:middle;"></span>${esc(text)}</span>`;
}
