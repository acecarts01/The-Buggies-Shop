import { NextResponse } from 'next/server';

// Markdown negotiation for agents. The matcher carries a `has` condition on
// the Accept header, so this function is only invoked for requests that even
// mention text/markdown. Ordinary browser traffic never enters middleware and
// is served straight from the edge cache — previously every page view paid a
// function invocation for a feature only agents use.
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|js).*)',
      has: [{ type: 'header', key: 'accept', value: '.*text/markdown.*' }],
    },
  ],
};

const MARKDOWN_ROUTES = new Set(['/', '/shop/', '/about/', '/faq/', '/wholesale/']);

export default function middleware(request) {
  const accept = request.headers.get('accept') || '';
  if (prefersMarkdownOverHtml(accept)) {
    const url = new URL(request.url);
    if (MARKDOWN_ROUTES.has(url.pathname)) {
      // The negotiated body is llms.txt (markdown), so label it as such:
      // the route itself serves text/plain, which is what a plain /llms.txt
      // fetch should get, but a client that asked for text/markdown should
      // see text/markdown come back.
      return NextResponse.rewrite(new URL('/llms.txt', request.url), {
        headers: { 'content-type': 'text/markdown; charset=utf-8', vary: 'Accept' },
      });
    }
  }
  return NextResponse.next();
}

// Never a substring check: a crawler sending `text/html, text/markdown;q=0.9`
// accepts markdown but prefers HTML, and handing it the stripped extract would
// cost it the JSON-LD and most of the page.
function prefersMarkdownOverHtml(accept) {
  let mdQ = -1;
  let htmlQ = -1;
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().split(';').map((s) => s.trim());
    let q = 1;
    for (const p of params) {
      const m = /^q=([\d.]+)$/.exec(p);
      if (m) q = parseFloat(m[1]);
    }
    if (type === 'text/markdown') mdQ = Math.max(mdQ, q);
    if (type === 'text/html') htmlQ = Math.max(htmlQ, q);
  }
  return mdQ > -1 && mdQ > htmlQ;
}
