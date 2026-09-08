import { NextResponse } from 'next/server';
import { SITE, CONTACT } from '@/src/config/site';

export async function GET() {
  return NextResponse.json(
    {
      ucp: '1.0',
      site: `https://${SITE.domain}`,
      services: [
        {
          id: 'catalog-browsing',
          type: 'catalog',
          url: `https://${SITE.domain}/shop/`,
          description: 'Access complete inventory of Australian electric golf buggies and accessories',
        },
        {
          id: 'mcp-server',
          type: 'mcp',
          url: `https://${SITE.domain}/api/mcp`,
          description: 'Model Context Protocol server for automated tool interaction',
        },
        {
          id: 'human-ordering',
          type: 'commerce',
          url: `https://wa.me/61480408189`,
          description: 'Draft orders for human sales specialist confirmation',
        },
        {
          id: 'on-farm-demo',
          type: 'service',
          url: `https://${SITE.domain}/contact/`,
          description: 'Schedule an on-farm demonstration in QLD, NSW, or VIC',
        },
      ],
      contact: {
        email: CONTACT.email,
        phone: CONTACT.phone,
        location: CONTACT.hq,
      },
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}
