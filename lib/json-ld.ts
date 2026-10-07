import { CONTACT } from '@/src/config/site';

// Safe serialisation for <script type="application/ld+json">.
//
// A JSON-LD block is raw text inside a <script> element, so any closing script
// tag in the data (a question or answer typed with markup, a product name, a
// post excerpt) would end the block early and let the rest run as HTML. Writing
// the characters <, > and & as unicode escapes is valid JSON that every parser
// decodes back to the original text. The JavaScript line and paragraph
// separators are escaped too because they break string literals in older
// parsers.
//
// The contact email is written with an escaped "@" so the raw HTML never
// carries a harvestable address while the parsed value is unchanged.
//
// This module imports only the shared site config, so client components such
// as FaqSection can use it (lib/schema.ts pulls in server-only product
// details and must not be imported from a client component).

const BACKSLASH = String.fromCharCode(92);
const escape = (code: number) => BACKSLASH + 'u' + code.toString(16).padStart(4, '0');

const UNSAFE: Record<string, string> = {
  [String.fromCharCode(0x3c)]: escape(0x3c),
  [String.fromCharCode(0x3e)]: escape(0x3e),
  [String.fromCharCode(0x26)]: escape(0x26),
  [String.fromCharCode(0x2028)]: escape(0x2028),
  [String.fromCharCode(0x2029)]: escape(0x2029),
};
const UNSAFE_RE = new RegExp('[' + Object.keys(UNSAFE).join('') + ']', 'g');

export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(UNSAFE_RE, (c) => UNSAFE[c])
    .split(CONTACT.emailRaw)
    .join(CONTACT.emailRaw.replace('@', escape(0x40)));
}
