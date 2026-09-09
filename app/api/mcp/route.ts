import { NextResponse } from 'next/server';
import { PRODUCTS, CATEGORIES, SHOP, SITE, CONTACT, ABN_INFO } from '@/src/config/site';

const TOOLS_SCHEMA = [
  {
    name: 'search_products',
    description: 'Search golf buggies, 4-seaters, utilities, and parts by keyword, category, max_price in AUD, or powertrain',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category: { type: 'string' },
        max_price: { type: 'number' },
        fuel_type: { type: 'string' },
      },
    },
  },
  {
    name: 'get_product',
    description: 'Get full technical specifications, pricing, and warranty details by product ID or slug',
    inputSchema: {
      type: 'object',
      required: ['slug'],
      properties: {
        slug: { type: 'string' },
      },
    },
  },
  {
    name: 'list_categories',
    description: 'List all 8 product categories and available vehicle counts',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_policies',
    description: 'Get shipping terms across regional Australia, warranty backing from Yatala depot, and payment methods',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'create_order_draft',
    description: 'Create prefilled WhatsApp order link and cart summary in AUD. Human completes order; never captures payment directly.',
    inputSchema: {
      type: 'object',
      required: ['items'],
      properties: {
        items: { type: 'array' },
        notes: { type: 'string' },
      },
    },
  },
  {
    name: 'request_demo',
    description: 'Initiate an on-farm or golf course demonstration booking for high-ticket vehicles over $15,000 AUD',
    inputSchema: {
      type: 'object',
      required: ['fullName', 'phone', 'postcode', 'application'],
      properties: {
        fullName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        postcode: { type: 'string' },
        application: { type: 'string' },
        preferredModel: { type: 'string' },
      },
    },
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { method, params, id } = body;

    // JSON-RPC 2.0 Handling
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2025-03-26',
          capabilities: {
            tools: { listChanged: false },
            resources: {},
          },
          serverInfo: {
            name: 'The Buggies Express MCP',
            version: '1.0.0',
          },
        },
      });
    }

    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS_SCHEMA,
        },
      });
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};

      if (toolName === 'search_products') {
        const query = (args.query || '').toLowerCase();
        const maxPrice = args.max_price ? Number(args.max_price) : Infinity;
        const category = (args.category || '').toLowerCase();
        const fuelType = (args.fuel_type || '').toLowerCase();

        const matches = PRODUCTS.filter((p) => {
          const matchQuery =
            !query ||
            p.name.toLowerCase().includes(query) ||
            p.key_specs.toLowerCase().includes(query) ||
            p.id.toLowerCase().includes(query);
          const matchPrice = p.price_aud <= maxPrice;
          const matchCat = !category || p.category.toLowerCase().includes(category);
          const matchFuel = !fuelType || p.fuel_type.toLowerCase().includes(fuelType);
          return matchQuery && matchPrice && matchCat && matchFuel;
        }).map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          fuel_type: p.fuel_type,
          price_aud: p.price_aud,
          price_display: p.price_display,
          key_specs: p.key_specs,
          url: `https://${SITE.domain}/shop/${p.slug}/`,
        }));

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ count: matches.length, products: matches }, null, 2),
              },
            ],
          },
        });
      }

      if (toolName === 'get_product') {
        const slug = (args.slug || '').toLowerCase();
        const product = PRODUCTS.find(
          (p) => p.slug.toLowerCase() === slug || p.id.toLowerCase() === slug
        );

        if (!product) {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: `Product not found for: ${slug}` },
          });
        }

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(product, null, 2),
              },
            ],
          },
        });
      }

      if (toolName === 'list_categories') {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(CATEGORIES, null, 2),
              },
            ],
          },
        });
      }

      if (toolName === 'get_policies') {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    shipping: SHOP.shippingNote,
                    cryptoDiscount: `${SHOP.cryptoDiscount}% on BTC and USDT`,
                    paymentMethods: SHOP.paymentMethods,
                    depot: ABN_INFO.locality,
                    entity: ABN_INFO.companyName,
                    abn: ABN_INFO.abn,
                    contactPhone: CONTACT.phone,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      if (toolName === 'create_order_draft') {
        const items = args.items || [];
        const notes = args.notes || '';
        const itemListText = items
          .map((i: any) => `${i.name || i.id} (Qty: ${i.quantity || 1})`)
          .join(', ');
        const waText = encodeURIComponent(
          `Hello The Buggies Express, I would like to order: ${itemListText}. Notes: ${notes}`
        );

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  status: 'draft_prepared',
                  whatsappUrl: `https://wa.me/61480804189?text=${waText}`,
                  checkoutFormUrl: `https://${SITE.domain}/contact/#order`,
                  items,
                  notes,
                  message: 'Human review required. No payment was charged.',
                }),
              },
            ],
          },
        });
      }

      if (toolName === 'request_demo') {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  status: 'demo_request_logged',
                  contact: args.fullName,
                  phone: args.phone,
                  postcode: args.postcode,
                  application: args.application,
                  message: 'Our Yatala QLD team will coordinate the enclosed freight delivery for your order.',
                }),
              },
            ],
          },
        });
      }

      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Tool '${toolName}' not found` },
      });
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32600, message: 'Invalid Request' },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error', data: err?.message },
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      name: 'The Buggies Express MCP Server',
      endpoint: `https://${SITE.domain}/api/mcp`,
      transport: 'streamable-http',
      supported_methods: ['initialize', 'tools/list', 'tools/call'],
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id',
    },
  });
}
