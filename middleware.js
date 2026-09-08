import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts|js).*)'],
};

export default function middleware(request) {
  const accept = request.headers.get('accept') || '';
  if (prefersMarkdownOverHtml(accept)) {
    // If agent explicitly prefers markdown over html
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '/shop/' || url.pathname === '/about/' || url.pathname === '/faq/' || url.pathname === '/wholesale/') {
      return NextResponse.rewrite(new URL('/llms.txt', request.url));
    }
  }
  return NextResponse.next();
}

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
