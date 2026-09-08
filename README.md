# The Buggies Express — Production E-Commerce Platform

> Australia's Most Complete Golf Buggy Business. Built with WebForge v9.1 for Vercel deployment.
> Operated by **GOLF BUGGIES EXPRESS PTY LTD** (ABN 28 668 598 758, ACN 668 598 758), Yatala QLD 4207.

---

## 🇦🇺 Project Overview

- **Aesthetic Archetype**: "Australian Tour Precision" (Augusta Fairway Green `#0A2E23`, Carbon Slate `#111714`, Brushed Champagne Bronze `#C8A96E`).
- **Fleet Scale**: Complete 61-model inventory across 6 categories (2-Seaters, Luxury 4-Seaters, Lifted 4x4, 6/8-Seater Shuttles, Commercial Utility, Walk-Behind Buggies).
- **Core Conversion Engines**:
  - **High-Ticket ($15,000+ AUD)**: VIP On-Farm Demonstration booking program with regional dispatch.
  - **Direct-Buy (<$10,000 AUD)**: Quick-manifest cart, WhatsApp direct checkout, PayID EFT & 10% Crypto incentive.
  - **Atlas 4-Passenger Lifted Landing Page**: Specialized high-converting showcase for Australia's top-selling acreage buggy.
- **Agent-Ready AI Architecture**:
  - MCP Streamable HTTP server at `/api/mcp`
  - Fully populated `llms.txt`, `auth.md`, `robots.txt`
  - `.well-known` discovery suite (`api-catalog`, `agent-skills`, `server-card.json`, `acp.json`, `ucp`, `oauth-authorization-server`, `openid-configuration`)

---

## 🚀 GitHub & Vercel Deployment Instructions

```bash
# 1. Initialize local git repository
git init
git add .
git commit -m "Initial build — WebForge v9.1 for The Buggies Express"

# 2. Push to GitHub
git branch -M main
git remote add origin https://github.com/[your-username]/golf-buggies-express.git
git push -u origin main

# 3. Deploy on Vercel
# - Go to vercel.com → Add New Project → Import from GitHub
# - Select the repository
# - CRITICAL: Framework Preset MUST be set to "Next.js"
# - Click Deploy
```

---

## 📋 Post-Deploy Checklist

1. **Domain Setup**:
   - Point `golfbuggiesexpress.com.au` in Vercel Dashboard → Settings → Domains.
   - Update `SITE.domain` in `src/config/site.js` if deploying on another custom domain.
2. **Web3Forms Key**:
   - Add your Web3Forms access key to `src/config/site.js` (`FORMS.web3formsKey`).
3. **Google Search Console**:
   - Add your verification token to `SITE.gscVerification`.
   - Submit sitemap at `https://golfbuggiesexpress.com.au/sitemap.xml`.
4. **AI Agent Verification**:
   - Inspect `https://golfbuggiesexpress.com.au/llms.txt` and `/.well-known/mcp/server-card.json`.
