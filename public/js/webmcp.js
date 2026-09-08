(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;
  navigator.modelContext.provideContext({
    tools: [
      {
        name: "search_products",
        description: "Search The Buggies Express golf buggies and parts by query, category, or price in AUD",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            category: { type: "string" },
            max_price: { type: "number" }
          }
        },
        execute: async ({ query, category, max_price }) => {
          const params = new URLSearchParams();
          if (query) params.set('q', query);
          if (category) params.set('category', category);
          if (max_price) params.set('max_price', max_price);
          const res = await fetch(`/api/search?${params}`);
          return res.json();
        }
      },
      {
        name: "browse_category",
        description: "Browse specific golf buggy category or full shop",
        inputSchema: {
          type: "object",
          properties: { category: { type: "string" } }
        },
        execute: async ({ category }) => {
          const url = category ? `/shop/${category}/` : `/shop/`;
          window.location.href = url;
          return { url };
        }
      },
      {
        name: "order_via_whatsapp",
        description: "Initiate a WhatsApp order draft with item details and Australian delivery address",
        inputSchema: {
          type: "object",
          properties: { message: { type: "string" } }
        },
        execute: async ({ message }) => {
          const text = message ? encodeURIComponent(message) : encodeURIComponent('Hello The Buggies Express, I would like to enquire about a golf buggy order.');
          const url = `https://wa.me/61480408189?text=${text}`;
          window.open(url, '_blank');
          return { url };
        }
      },
      {
        name: "order_now",
        description: "Navigate to the buggies catalog and direct ordering for immediate dispatch",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = '/shop/';
          return { url: '/shop/' };
        }
      }
    ]
  });
})();
