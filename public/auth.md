# Auth.md

## Site: The Buggies Express — Australian Golf Buggy & Cart Specialists
Operating Entity: GOLF BUGGIES EXPRESS PTY LTD (ABN 28 668 598 758 / ACN 668 598 758)
Location: Yatala QLD 4207, Australia

## Agent Registration
No authentication required. All catalog resources, pricing in AUD, product specifications, and agent discovery endpoints are publicly accessible.

## Public Resources
| Resource | URL |
|---|---|
| Full Catalog | https://www.golfbuggiesexpress.com.au/shop/ |
| Atlas 4-Passenger Landing | https://www.golfbuggiesexpress.com.au/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/ |
| About & ABN Verification | https://www.golfbuggiesexpress.com.au/about/ |
| FAQ | https://www.golfbuggiesexpress.com.au/faq/ |
| Contact & Demo Request | https://www.golfbuggiesexpress.com.au/contact/ |
| Products API | https://www.golfbuggiesexpress.com.au/api/products |
| Categories API | https://www.golfbuggiesexpress.com.au/api/categories |
| Search API | https://www.golfbuggiesexpress.com.au/api/search |
| MCP Server | https://www.golfbuggiesexpress.com.au/api/mcp |

## Authentication

```json
{
  "agent_auth": {
    "register_uri": null,
    "identity_types_supported": ["none"],
    "credential_types_supported": ["none"],
    "notes": "No authentication required. All product catalog resources, specifications, and prices are public."
  }
}
```

## Ordering
Human-in-the-loop required. Agents may browse products, query inventory, filter terrain suitability, and prepare order drafts. Orders are finalized by a human buyer via WhatsApp draft or the secure online checkout form.
