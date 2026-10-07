# Links, search and structured data (follow-up work)

## 1. Inbound (internal) links

Contextual links are added by `lib/autolink.ts` from `src/config/autolink-rules.json` (520 anchor-to-page rules).
Rebuild the rules after the keyword map changes: `node docs/keyword-research/tools/make-autolinks.mjs`.

* **Rules**: every primary and supporting keyword with volume, ordered by search volume, money pages first; plus
  natural-prose anchors the map cannot supply (brand names, "walk-behind", "4-seater", "lithium batteries", city
  names, "bitcoin", model short names such as "Zip X5", "FX7", "D5 Ranger").
* **Guard rails** (so it stays editorial): at most 10 links per guide and 3 per paragraph, 3 to 6 on category,
  hub, city and product copy; each destination once per page; never the page itself; first mention only; whole
  words only; no generic two-word phrases, no "near me", review or price noise, no other city's name, no
  competitor anchors, used and second-hand guides not promoted.
* **Where**: guide bodies, product descriptions, category and hub sections, delivery city sections, brand copy.
* **Structural links** (not text matching): a "Popular searches" block in the footer on every page linking each
  money page with its target keyword; "Models related to this guide" on every guide; product pages link up to
  their brand and category; brand pages link down to their categories; category pages link to every model and to
  the brands in the range; related products are the nearest in price.
* **Result** (links in page bodies, average per page, before to after this work): categories 5.8 to 22.3, brands
  12.7 to 14.5, products 6.6 to 10.2, delivery cities 6.0 to 8.2; guide bodies went from 19 contextual links
  to about 150. No orphans, 0 broken internal links.

## 2. Outbound links

Only a short list of sources that pass four rules (`src/config/references.ts`): a primary source (government,
regulator, the maker's own site, a rules body), directly relevant to the page that carries it, checked live, and
deep-linked to the specific page. Editorial links, `rel="noopener noreferrer"`, opening in a new tab.

| Where | Sources |
|---|---|
| Registration guide, every vehicle product page, each delivery city (its own state) | NSW golf buggy vehicle sheet; Queensland golf buggy conditional registration and conditional registration guide; VicRoads non-compliant vehicles; SA restricted miscellaneous vehicle; WA vehicle registration (ABLIS) |
| Warranty, second-hand, insurance, ordering guides | ACCC consumer rights and guarantees, ACCC warranties, MoneySmart insurance, ABR |
| Finance and crypto guides, crypto-payment page | MoneySmart buy-now-pay-later, ATO "What are crypto assets?" |
| Battery guides and battery products | ACCC lithium-ion battery safety, Wikipedia (lithium iron phosphate) |
| Transporting guide | NHVR Load Restraint Guide |
| Etiquette guide | The R&A Rules of Golf |
| Terminology guide | Wikipedia (golf cart) |
| About page | ABN Lookup, ASIC register search |
| Brand pages | The maker's official site: Club Car, E-Z-GO, Yamaha Golf Car, PowaKaddy, MGI, Evolution, Cushman |

`npm run links:check` fetches every one. The ACCC, VicRoads, SA Government and MGI answer scripted requests with
403/429 (bot protection); they were confirmed through search results and open normally in a browser.

**What was deliberately not done.** Link directories, "high-domain-authority" link lists, link exchanges and
guest-post networks were not used. Outbound links to them add no value to a reader and Google's spam policies
treat paid or exchanged links as a violation; the vetted list above is the safe equivalent. Golf Australia was
left out because its site could not be verified. No official site was found for Tara, LVTONG, Robera or Atlas, so
those brand pages carry no maker link.

**Off-site (you do these; they build links *to* the site and I cannot do them for you):** claim or complete
Google Business Profile, Bing Places and Apple Business Connect for the Yatala depot; list the business in
Yellow Pages Australia and True Local; ask Club Car, E-Z-GO, Yamaha and MGI whether they have an Australian
dealer locator that lists you; add every real profile you hold to `BRAND.sameAs` in `src/config/site.ts` and the
schema picks it up.

## 3. FAQ structured data

`FaqSection` now builds the FAQPage JSON-LD from the items it renders: tags stripped from answers, empty and
duplicate questions dropped, nothing emitted when there are no valid entries, and serialised with the shared
`lib/json-ld.ts` (escapes `<`, `>`, `&` and line separators so no answer can close the script tag; tested). It
re-renders with its props, so the schema always matches what is on screen, and a page can pass `schema={false}`
where another FAQPage already exists (Google allows one per page).

## 4. Metadata component

`src/components/SeoHead.tsx` renders title, description, canonical, Open Graph, Twitter tags and JSON-LD into the
head (React 19 hoists them, no effect hooks, so crawlers that do not run scripts still see them). In the root
layout it injects the site-wide Organization + WebSite (with the working search action) graph on every route.
Next's Metadata API keeps owning title, description, canonical and Open Graph on routes that export metadata;
`SeoHead` must not be used for those on the same route or the tags would duplicate.

## 5. Site search

Header search button (also `/` and Ctrl/Cmd+K) opens a keyboard-accessible dialog (ARIA combobox/listbox, arrow
keys, Enter, Esc, focus returned on close). It searches 177 entries (ranges, brands, delivery areas, products,
guides, pages, FAQ answers) from a static index at `/api/search-index` loaded on first open and ranked in the
browser (`lib/site-search.ts`). `/search/?q=` is the full-page version, kept out of Google's index and used as
the WebSite SearchAction target.
