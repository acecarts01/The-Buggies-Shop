// SERVER-ONLY. Inbound link map: which page carries a keyword-anchored link to which product.
//
// Each of the 40 products added in October 2026 has six inbound links, one per
// keyword (its primary and five secondary terms, all transactional or commercial),
// each from a different page. The anchor text is the target's own keyword; a
// page never links its own keywords to itself. Source keys: cat:<category slug>,
// brand:<brand slug>, blog:<post slug>, product:<product slug>.
// Built from docs/keyword-research/new-products/link-plan.csv.
import { PRODUCTS, CATEGORIES } from './site';

export interface BuyerLink {
  href: string;
  anchor: string;
  name: string;
  price: string;
  intent: 'T' | 'C';
}

const MAP: Record<string, { t: string; a: string; i: 'T' | 'C' }[]> = {
  "blog:clicgear-rovic-push-buggies-guide": [
    { t: "clicgear-model-4-5-buggy-black", a: "clicgear 4.5 black for sale", i: "T" },
    { t: "clicgear-model-4-0-buggy-silver", a: "clicgear 4.0 for sale", i: "T" },
    { t: "rovic-rv1s-swivel-2-0-buggy-light-blue", a: "rovic rv1s swivel golf buggy", i: "T" },
    { t: "clicgear-soft-seat-cover", a: "golf buggy seat covers australia", i: "C" },
    { t: "clicgear-model-4-0-buggy-matte-white", a: "clicgear 4.0 price", i: "T" },
    { t: "clicgear-model-4-0-buggy-soft-pink", a: "3 wheel electric golf buggy", i: "C" },
    { t: "clicgear-model-4-0-buggy-teal", a: "push golf trolley sale", i: "T" },
    { t: "rovic-rv1c-compact-2-0-buggy-silver-black", a: "rovic compact", i: "T" },
    { t: "rovic-rv1c-1s-seat", a: "rovic golf buggy seat", i: "T" },
  ],
  "blog:clicgear-vs-mgi-push-buggy-comparison-australia": [
    { t: "clicgear-model-4-5-buggy-black", a: "clicgear 4.5 black price australia", i: "T" },
    { t: "clicgear-model-4-0-buggy-silver", a: "buy clicgear 4.0", i: "T" },
    { t: "rovic-rv1s-swivel-2-0-buggy-light-blue", a: "rovic rv1s swivel", i: "T" },
    { t: "clicgear-soft-seat-cover", a: "golf buggy seat cover padded", i: "C" },
    { t: "clicgear-model-4-0-buggy-matte-white", a: "clicgear 4.0 best price", i: "C" },
    { t: "clicgear-model-4-0-buggy-soft-pink", a: "3 wheel golf trolly", i: "C" },
    { t: "clicgear-model-4-0-buggy-teal", a: "3 wheel golf caddy", i: "C" },
    { t: "rovic-rv1c-compact-2-0-buggy-silver-black", a: "rovic golf buggy rv1c", i: "T" },
    { t: "rovic-rv1c-1s-seat", a: "buy rovic rv1c rv1s seat", i: "T" },
  ],
  "blog:golf-cart-with-remote-control-australia-guide": [
    { t: "mgi-zip-navigator", a: "best remote control golf buggy australia", i: "C" },
    { t: "mgi-ai-500-electric-buggy", a: "mgi ai 500 price", i: "T" },
    { t: "mgi-ai-navigator-halo", a: "mgi navigator halo price details", i: "T" },
    { t: "mgi-halo-eye", a: "mgi halo eye for sale", i: "T" },
  ],
  "blog:golf-push-cart-vs-electric-trolley-australia": [
    { t: "clicgear-model-4-5-buggy-black", a: "best price clicgear 4.5 black", i: "T" },
    { t: "clicgear-model-4-0-buggy-silver", a: "clicgear 4 wheel", i: "T" },
    { t: "rovic-rv1s-swivel-2-0-buggy-light-blue", a: "rovic swivel golf buggy", i: "C" },
    { t: "clicgear-model-4-0-buggy-matte-white", a: "clicgear 4 vs 8", i: "C" },
    { t: "clicgear-model-4-0-buggy-soft-pink", a: "3 wheel push golf trolley", i: "C" },
    { t: "mgi-e-boost-black", a: "buy mgi e-boost black", i: "T" },
    { t: "clicgear-model-4-0-buggy-teal", a: "3 wheel golf trolley sale", i: "T" },
    { t: "rovic-rv1c-compact-2-0-buggy-silver-black", a: "rv1c golf trolley", i: "T" },
    { t: "mgi-e-boost-navy", a: "mgi e-boost navy for sale", i: "T" },
    { t: "mgi-e-boost-white", a: "mgi e-boost white for sale", i: "T" },
  ],
  "blog:mgi-ai-navigator-gps-explained": [
    { t: "mgi-ai-500-electric-buggy", a: "mgi ai 500 gps", i: "T" },
    { t: "mgi-ai-navigator-halo", a: "mgi golf ai navigator halo price", i: "T" },
    { t: "mgi-halo-eye", a: "buy mgi halo eye", i: "T" },
  ],
  "blog:mgi-battery-charger-guide": [
    { t: "mgi-lithium-24v-250wh-battery", a: "mgi batteries", i: "T" },
    { t: "mgi-lithium-24v-smart-charger-ai-and-zip-series", a: "mgi battery charger replacement", i: "C" },
    { t: "mgi-2024-zip-24v-250wh-lithium-battery", a: "mgi zip navigator battery charging", i: "T" },
    { t: "mgi-lithium-12v-299wh-battery", a: "12v golf trolley battery", i: "C" },
    { t: "mgi-e-series-charger", a: "mgi golf buggy battery charger", i: "T" },
    { t: "mgi-fireproof-charging-box", a: "buy mgi fireproof charging box", i: "T" },
    { t: "mgi-lithium-24v-13ah-battery", a: "mgi lithium 24v 13ah battery for sale", i: "T" },
    { t: "mgi-2024-zip-24v-299wh-lithium-battery", a: "mgi 2024 zip 24v 299wh lithium battery for sale", i: "T" },
  ],
  "blog:mgi-buggy-accessories-guide": [
    { t: "mgi-accessories-bag", a: "golf trolley accessories", i: "C" },
    { t: "mgi-phone-holder", a: "golf trolley iphone holder", i: "C" },
    { t: "mgi-rain-cover", a: "buy mgi rain cover", i: "T" },
    { t: "mgi-drink-bottle-holder", a: "golf trolley cup holder", i: "C" },
    { t: "mgi-seat", a: "electric golf buggy with seat", i: "C" },
    { t: "clicgear-soft-seat-cover", a: "golf buggy seat covers dry", i: "C" },
    { t: "mgi-rear-wheels", a: "golf buggy mag wheels", i: "C" },
    { t: "mgi-cooler-bag", a: "buy mgi cooler bag", i: "T" },
    { t: "rovic-rv1c-1s-seat", a: "rovic rv1c rv1s seat for sale", i: "T" },
    { t: "mgi-zip-series-gps-holder", a: "golf buggy gps holder", i: "C" },
    { t: "mgi-umbrella-holder", a: "buy mgi umbrella holder", i: "T" },
    { t: "mgi-umbrella-holder-extender", a: "buy mgi umbrella holder extender", i: "T" },
  ],
  "blog:mgi-golf-buggies-australia-guide": [
    { t: "mgi-accessories-bag", a: "electric golf trolley accessories", i: "C" },
    { t: "mgi-lithium-24v-250wh-battery", a: "mgi battery box", i: "T" },
    { t: "mgi-phone-holder", a: "buy mgi phone holder", i: "T" },
    { t: "mgi-zip-x3", a: "mgi zip x3 lithium electric golf caddie", i: "C" },
    { t: "mgi-ai-500-electric-buggy", a: "mgi ai 500 vs ai navigator", i: "T" },
    { t: "mgi-rain-cover", a: "mgi rain cover for sale", i: "T" },
    { t: "mgi-lithium-24v-smart-charger-ai-and-zip-series", a: "electric golf trolley battery charger", i: "C" },
    { t: "mgi-drink-bottle-holder", a: "golf trolley drinks holder", i: "C" },
    { t: "mgi-seat", a: "single seat golf buggies", i: "C" },
    { t: "mgi-ai-navigator-halo", a: "buy mgi ai navigator halo", i: "T" },
    { t: "mgi-rear-wheels", a: "mgi wheel replacement", i: "T" },
    { t: "mgi-e-boost-black", a: "mgi e-boost black for sale", i: "T" },
  ],
  "blog:mgi-parts-wheels-warranty-guide": [
    { t: "mgi-accessories-bag", a: "golf push buggy accessories", i: "C" },
    { t: "mgi-lithium-24v-250wh-battery", a: "battery powered golf buggy", i: "C" },
    { t: "mgi-phone-holder", a: "mgi phone holder for sale", i: "T" },
    { t: "mgi-rain-cover", a: "mgi rain cover price australia", i: "T" },
    { t: "mgi-lithium-24v-smart-charger-ai-and-zip-series", a: "golf buggy battery charger", i: "C" },
    { t: "mgi-drink-bottle-holder", a: "universal golf trolley drinks holder", i: "C" },
    { t: "mgi-seat", a: "single seat golf buggy for sale", i: "T" },
    { t: "mgi-rear-wheels", a: "golf buggy wheels for sale", i: "T" },
    { t: "mgi-e-boost-black", a: "mgi e-boost black price australia", i: "T" },
    { t: "mgi-2024-zip-24v-250wh-lithium-battery", a: "mgi zip navigator battery replacement", i: "C" },
    { t: "mgi-lithium-12v-299wh-battery", a: "12v 20ah golf trolley battery", i: "C" },
    { t: "mgi-e-series-charger", a: "mgi lithium 24v 380wh battery charger", i: "T" },
  ],
  "blog:mgi-remote-pairing-guide": [
    { t: "mgi-zip-navigator", a: "mgi navigator golf buggy", i: "T" },
  ],
  "blog:mgi-zip-navigator-setup-guide": [
    { t: "mgi-zip-navigator", a: "zip navigator", i: "C" },
  ],
  "blog:mgi-zip-navigator-troubleshooting": [
    { t: "mgi-zip-navigator", a: "electric golf buggy with remote australia", i: "C" },
    { t: "mgi-zip-x3", a: "mgi zip x3 lithium electric golf caddy", i: "C" },
  ],
  "blog:mgi-zip-x-series-explained": [
    { t: "mgi-zip-x3", a: "mgi x3 golf buggy price", i: "T" },
  ],
  "brand:clicgear": [
    { t: "clicgear-model-4-5-buggy-black", a: "buy clicgear 4.5 black", i: "T" },
    { t: "clicgear-model-4-0-buggy-silver", a: "clicgear 4.0 best price australia", i: "C" },
    { t: "clicgear-soft-seat-cover", a: "clicgear 4.0 seat", i: "C" },
    { t: "clicgear-model-4-0-buggy-matte-white", a: "clicgear model 4 buggy", i: "T" },
    { t: "clicgear-model-4-0-buggy-soft-pink", a: "electric golf push buggy", i: "C" },
    { t: "clicgear-model-4-0-buggy-teal", a: "3 wheel golf buggy for sale", i: "T" },
  ],
  "brand:mgi": [
    { t: "mgi-accessories-bag", a: "mgi golf buggy accessories", i: "T" },
    { t: "mgi-lithium-24v-250wh-battery", a: "mgi battery replacement", i: "T" },
    { t: "mgi-phone-holder", a: "best phone holder for golf trolley", i: "C" },
    { t: "mgi-zip-navigator", a: "mgi zip navigator remote control", i: "C" },
    { t: "mgi-zip-x3", a: "mgi zip x1 vs x3", i: "C" },
    { t: "mgi-ai-500-electric-buggy", a: "mgi ai series", i: "T" },
    { t: "mgi-rain-cover", a: "rain cover for golf buggy top", i: "C" },
    { t: "mgi-lithium-24v-smart-charger-ai-and-zip-series", a: "mgi charger", i: "C" },
    { t: "mgi-drink-bottle-holder", a: "golf trolley bottle holder", i: "C" },
    { t: "mgi-seat", a: "push golf buggy with seat", i: "C" },
  ],
  "brand:rovic": [
    { t: "rovic-rv1s-swivel-2-0-buggy-light-blue", a: "rv1s rovic", i: "C" },
    { t: "rovic-rv1c-compact-2-0-buggy-silver-black", a: "rv1c rovic", i: "C" },
    { t: "rovic-rv1c-1s-seat", a: "rovic seat", i: "C" },
  ],
  "cat:accessories-spare-parts": [
    { t: "mgi-accessories-bag", a: "mgi accessories", i: "C" },
    { t: "mgi-phone-holder", a: "golf buggy phone holder", i: "T" },
    { t: "mgi-rain-cover", a: "mgi rain cover", i: "C" },
    { t: "mgi-drink-bottle-holder", a: "golf buggy drink holder", i: "T" },
    { t: "mgi-seat", a: "mgi seat", i: "T" },
    { t: "clicgear-soft-seat-cover", a: "clicgear seat", i: "C" },
    { t: "mgi-rear-wheels", a: "golf trolley wheels", i: "C" },
    { t: "mgi-cooler-bag", a: "mgi zip navigator cooler bag", i: "T" },
  ],
  "cat:batteries-chargers": [
    { t: "mgi-lithium-24v-250wh-battery", a: "mgi battery", i: "T" },
    { t: "mgi-lithium-24v-smart-charger-ai-and-zip-series", a: "mgi battery charger", i: "C" },
    { t: "mgi-2024-zip-24v-250wh-lithium-battery", a: "mgi zip navigator at battery", i: "T" },
    { t: "mgi-lithium-12v-299wh-battery", a: "12 volt golf buggy batteries", i: "C" },
    { t: "mgi-e-series-charger", a: "mgi 24v lithium battery charger", i: "T" },
    { t: "mgi-fireproof-charging-box", a: "mgi charging box", i: "C" },
    { t: "mgi-lithium-24v-13ah-battery", a: "buy mgi lithium 24v 13ah battery", i: "T" },
    { t: "mgi-2024-zip-24v-299wh-lithium-battery", a: "buy mgi 2024 zip 24v 299wh lithium battery", i: "T" },
  ],
  "cat:push-golf-buggies": [
    { t: "clicgear-model-4-5-buggy-black", a: "clicgear 4.5", i: "T" },
    { t: "clicgear-model-4-0-buggy-silver", a: "push buggy", i: "C" },
    { t: "rovic-rv1s-swivel-2-0-buggy-light-blue", a: "rovic rv1s 2.0", i: "T" },
    { t: "clicgear-model-4-0-buggy-matte-white", a: "clicgear model 4.0", i: "T" },
    { t: "clicgear-model-4-0-buggy-soft-pink", a: "golf three wheel trolley", i: "C" },
    { t: "clicgear-model-4-0-buggy-teal", a: "three wheel electric golf buggy", i: "C" },
    { t: "rovic-rv1c-compact-2-0-buggy-silver-black", a: "rovic rv1c compact", i: "C" },
  ],
  "cat:walk-behind-buggies": [
    { t: "mgi-zip-navigator", a: "mgi zip", i: "T" },
    { t: "mgi-zip-x3", a: "mgi zip x3", i: "T" },
    { t: "mgi-ai-500-electric-buggy", a: "mgi ai 500", i: "T" },
    { t: "mgi-ai-navigator-halo", a: "mgi navigator halo", i: "T" },
    { t: "mgi-e-boost-black", a: "mgi e boost golf buggy", i: "T" },
    { t: "mgi-e-boost-navy", a: "buy mgi e-boost navy", i: "T" },
    { t: "mgi-e-boost-white", a: "buy mgi e-boost white", i: "T" },
  ],
  "product:clicgear-model-4-0-buggy-matte-white": [
    { t: "clicgear-model-4-0-buggy-silver", a: "clicgear 4.0 australia", i: "C" },
  ],
  "product:clicgear-model-4-0-buggy-silver": [
    { t: "clicgear-model-4-5-buggy-black", a: "clicgear 4.5 black online", i: "T" },
    { t: "clicgear-model-4-0-buggy-matte-white", a: "clicgear 4.0 golf trolley", i: "T" },
    { t: "clicgear-model-4-0-buggy-soft-pink", a: "3 wheel ride on golf buggy", i: "C" },
    { t: "clicgear-model-4-0-buggy-teal", a: "3 wheeler golf trolley", i: "C" },
  ],
  "product:mgi-2024-zip-24v-250wh-lithium-battery": [
    { t: "mgi-lithium-24v-250wh-battery", a: "battery operated golf buggy", i: "C" },
    { t: "mgi-fireproof-charging-box", a: "mgi fireproof charging box online", i: "T" },
    { t: "mgi-lithium-24v-13ah-battery", a: "mgi lithium 24v 13ah battery online", i: "T" },
    { t: "mgi-2024-zip-24v-299wh-lithium-battery", a: "mgi 2024 zip 24v 299wh lithium battery online", i: "T" },
  ],
  "product:mgi-2024-zip-24v-299wh-lithium-battery": [
    { t: "mgi-2024-zip-24v-250wh-lithium-battery", a: "mgi zip battery replacement", i: "T" },
    { t: "mgi-lithium-12v-299wh-battery", a: "12v 26ah golf trolley battery", i: "C" },
    { t: "mgi-lithium-24v-13ah-battery", a: "mgi lithium 24v 13ah battery price australia", i: "T" },
  ],
  "product:mgi-accessories-bag": [
    { t: "mgi-phone-holder", a: "mgi phone holder price australia", i: "T" },
    { t: "mgi-cooler-bag", a: "best price mgi cooler bag", i: "T" },
    { t: "mgi-umbrella-holder", a: "mgi umbrella holder price australia", i: "T" },
    { t: "mgi-telescopic-umbrella", a: "mgi telescopic umbrella price australia", i: "T" },
  ],
  "product:mgi-ai-500-electric-buggy": [
    { t: "mgi-zip-x3", a: "mgi zip x3 motorised lithium golf buggy", i: "C" },
    { t: "mgi-ai-navigator-halo", a: "mgi ai navigator halo price australia", i: "T" },
    { t: "rovic-rv1c-1s-seat", a: "best price rovic rv1c rv1s seat", i: "T" },
    { t: "mgi-e-boost-navy", a: "order mgi e-boost navy", i: "T" },
  ],
  "product:mgi-ai-navigator-halo": [
    { t: "mgi-e-boost-white", a: "order mgi e-boost white", i: "T" },
    { t: "mgi-halo-eye", a: "order mgi halo eye", i: "T" },
  ],
  "product:mgi-cooler-bag": [
    { t: "mgi-telescopic-umbrella", a: "buy mgi telescopic umbrella", i: "T" },
    { t: "mgi-scorecard-holder", a: "order mgi scorecard holder", i: "T" },
    { t: "mgi-wheel-covers", a: "buy mgi wheel covers", i: "T" },
    { t: "mgi-travel-bag", a: "buy mgi travel bag", i: "T" },
  ],
  "product:mgi-drink-bottle-holder": [
    { t: "mgi-zip-series-gps-holder", a: "golf trolley gps holder", i: "C" },
    { t: "mgi-umbrella-holder-extender", a: "best price mgi umbrella holder extender", i: "T" },
    { t: "mgi-multipurpose-hook", a: "mgi multipurpose hook for sale", i: "T" },
    { t: "mgi-scorecard-holder", a: "mgi scorecard holder for sale", i: "T" },
  ],
  "product:mgi-e-boost-black": [
    { t: "mgi-e-boost-navy", a: "mgi e-boost navy price australia", i: "T" },
    { t: "mgi-e-boost-white", a: "mgi e-boost white price australia", i: "T" },
  ],
  "product:mgi-e-boost-navy": [
    { t: "mgi-e-boost-black", a: "best price mgi e-boost black", i: "T" },
    { t: "mgi-e-boost-white", a: "best price mgi e-boost white", i: "T" },
  ],
  "product:mgi-e-boost-white": [
    { t: "mgi-e-boost-black", a: "mgi e-boost black online", i: "T" },
    { t: "mgi-e-boost-navy", a: "best price mgi e-boost navy", i: "T" },
  ],
  "product:mgi-e-series-charger": [
    { t: "mgi-fireproof-charging-box", a: "mgi fireproof charging box price australia", i: "T" },
  ],
  "product:mgi-fireproof-charging-box": [
    { t: "mgi-lithium-24v-smart-charger-ai-and-zip-series", a: "golf battery charger", i: "T" },
    { t: "mgi-e-series-charger", a: "mgi lithium battery charger", i: "T" },
  ],
  "product:mgi-halo-eye": [
    { t: "mgi-travel-bag", a: "order mgi travel bag", i: "T" },
  ],
  "product:mgi-lithium-12v-299wh-battery": [
    { t: "mgi-2024-zip-24v-250wh-lithium-battery", a: "mgi zip x1 2024 lithium battery motorised buggy reviews", i: "C" },
    { t: "mgi-lithium-24v-13ah-battery", a: "best price mgi lithium 24v 13ah battery", i: "T" },
    { t: "mgi-2024-zip-24v-299wh-lithium-battery", a: "mgi 2024 zip 24v 299wh lithium battery price australia", i: "T" },
  ],
  "product:mgi-lithium-24v-13ah-battery": [
    { t: "mgi-lithium-12v-299wh-battery", a: "12v golf buggy mgi lite lithium batteries", i: "C" },
    { t: "mgi-2024-zip-24v-299wh-lithium-battery", a: "best price mgi 2024 zip 24v 299wh lithium battery", i: "T" },
  ],
  "product:mgi-lithium-24v-250wh-battery": [
    { t: "mgi-2024-zip-24v-250wh-lithium-battery", a: "mgi zip navigator remote control battery replacement", i: "T" },
    { t: "mgi-lithium-12v-299wh-battery", a: "golf buggy battery 12v 22 amp hours", i: "C" },
    { t: "mgi-e-series-charger", a: "mgi zip navigator battery charger", i: "T" },
    { t: "mgi-fireproof-charging-box", a: "best price mgi fireproof charging box", i: "T" },
  ],
  "product:mgi-lithium-24v-smart-charger-ai-and-zip-series": [
    { t: "mgi-e-series-charger", a: "mgi zip battery charger", i: "T" },
    { t: "mgi-fireproof-charging-box", a: "mgi fireproof charging box for sale", i: "T" },
    { t: "mgi-lithium-24v-13ah-battery", a: "order mgi lithium 24v 13ah battery", i: "T" },
    { t: "mgi-2024-zip-24v-299wh-lithium-battery", a: "order mgi 2024 zip 24v 299wh lithium battery", i: "T" },
  ],
  "product:mgi-multipurpose-hook": [
    { t: "mgi-zip-series-gps-holder", a: "buy mgi zip series gps holder", i: "T" },
    { t: "mgi-scorecard-holder", a: "best price mgi scorecard holder", i: "T" },
    { t: "mgi-wheel-covers", a: "golf trolley hedgehog wheel covers", i: "C" },
    { t: "mgi-travel-bag", a: "mgi travel bag online", i: "T" },
  ],
  "product:mgi-phone-holder": [
    { t: "mgi-accessories-bag", a: "mgi golf buggy accessories australia", i: "T" },
    { t: "mgi-cooler-bag", a: "mgi cooler bag price australia", i: "T" },
    { t: "mgi-umbrella-holder", a: "mgi umbrella holder for sale", i: "T" },
    { t: "mgi-telescopic-umbrella", a: "mgi telescopic umbrella for sale", i: "T" },
  ],
  "product:mgi-rain-cover": [
    { t: "mgi-seat", a: "single seat golf buggy accessories", i: "C" },
    { t: "mgi-rear-wheels", a: "big wheel golf buggy accessories", i: "C" },
    { t: "mgi-travel-bag", a: "best price mgi travel bag", i: "T" },
    { t: "mgi-halo-eye", a: "mgi halo eye price australia", i: "T" },
  ],
  "product:mgi-rear-wheels": [
    { t: "mgi-wheel-covers", a: "mgi wheel covers price australia", i: "T" },
    { t: "mgi-travel-bag", a: "mgi travel bag for sale", i: "T" },
    { t: "mgi-halo-eye", a: "best price mgi halo eye", i: "T" },
  ],
  "product:mgi-scorecard-holder": [
    { t: "mgi-zip-series-gps-holder", a: "mgi navigator accessories gps holder", i: "C" },
    { t: "mgi-umbrella-holder", a: "best price mgi umbrella holder", i: "T" },
    { t: "mgi-umbrella-holder-extender", a: "mgi umbrella holder extender for sale", i: "T" },
    { t: "mgi-telescopic-umbrella", a: "order mgi telescopic umbrella", i: "T" },
  ],
  "product:mgi-seat": [
    { t: "mgi-rain-cover", a: "best price mgi rain cover", i: "T" },
    { t: "mgi-rear-wheels", a: "mgi buggy wheels", i: "T" },
    { t: "mgi-wheel-covers", a: "best price mgi wheel covers", i: "T" },
    { t: "mgi-travel-bag", a: "mgi travel bag price australia", i: "T" },
  ],
  "product:mgi-telescopic-umbrella": [
    { t: "mgi-cooler-bag", a: "mgi cooler bag for sale", i: "T" },
    { t: "mgi-multipurpose-hook", a: "order mgi multipurpose hook", i: "T" },
    { t: "mgi-scorecard-holder", a: "mgi scorecard holder online", i: "T" },
    { t: "mgi-wheel-covers", a: "golf trolley studded wheel covers", i: "C" },
  ],
  "product:mgi-travel-bag": [
    { t: "mgi-telescopic-umbrella", a: "mgi telescopic umbrella online", i: "T" },
    { t: "mgi-wheel-covers", a: "mgi wheel covers for sale", i: "T" },
    { t: "mgi-halo-eye", a: "mgi halo eye online", i: "T" },
  ],
  "product:mgi-umbrella-holder": [
    { t: "mgi-cooler-bag", a: "mgi cooler bag online", i: "T" },
    { t: "mgi-umbrella-holder-extender", a: "order mgi umbrella holder extender", i: "T" },
    { t: "mgi-telescopic-umbrella", a: "best price mgi telescopic umbrella", i: "T" },
    { t: "mgi-multipurpose-hook", a: "mgi multipurpose hook online", i: "T" },
  ],
  "product:mgi-umbrella-holder-extender": [
    { t: "mgi-zip-series-gps-holder", a: "golf caddy gps holder", i: "C" },
    { t: "mgi-umbrella-holder", a: "mgi umbrella holder online", i: "T" },
    { t: "mgi-multipurpose-hook", a: "best price mgi multipurpose hook", i: "T" },
    { t: "mgi-scorecard-holder", a: "buy mgi scorecard holder", i: "T" },
  ],
  "product:mgi-wheel-covers": [
    { t: "mgi-zip-series-gps-holder", a: "universal gps holder for golf trolley", i: "C" },
    { t: "mgi-umbrella-holder-extender", a: "mgi umbrella holder extender online", i: "T" },
    { t: "mgi-multipurpose-hook", a: "buy mgi multipurpose hook", i: "T" },
    { t: "mgi-scorecard-holder", a: "mgi scorecard holder price australia", i: "T" },
  ],
  "product:mgi-zip-navigator": [
    { t: "mgi-ai-500-electric-buggy", a: "mgi ai buggy", i: "T" },
    { t: "clicgear-soft-seat-cover", a: "buy clicgear soft seat cover", i: "T" },
    { t: "mgi-ai-navigator-halo", a: "mgi ai navigator halo for sale", i: "T" },
    { t: "rovic-rv1c-1s-seat", a: "rovic rv1c rv1s seat price australia", i: "T" },
  ],
  "product:mgi-zip-series-gps-holder": [
    { t: "mgi-drink-bottle-holder", a: "golf trolley wine bottle holder", i: "C" },
    { t: "mgi-umbrella-holder", a: "order mgi umbrella holder", i: "T" },
    { t: "mgi-umbrella-holder-extender", a: "mgi umbrella holder extender price australia", i: "T" },
    { t: "mgi-multipurpose-hook", a: "mgi multipurpose hook price australia", i: "T" },
  ],
  "product:mgi-zip-x3": [
    { t: "mgi-e-boost-navy", a: "mgi e-boost navy online", i: "T" },
    { t: "mgi-e-boost-white", a: "mgi e-boost white online", i: "T" },
  ],
  "product:rovic-rv1c-compact-2-0-buggy-silver-black": [
    { t: "rovic-rv1s-swivel-2-0-buggy-light-blue", a: "rovic 1s", i: "T" },
  ],
  "product:rovic-rv1s-swivel-2-0-buggy-light-blue": [
    { t: "rovic-rv1c-compact-2-0-buggy-silver-black", a: "rovic rv1c 2.0", i: "T" },
  ],
};

export function buyerLinksFor(kind: 'cat' | 'brand' | 'blog' | 'product', slug: string): BuyerLink[] {
  return (MAP[kind + ':' + slug] ?? []).flatMap((l) => {
    const p = PRODUCTS.find((x) => x.slug === l.t);
    if (!p) throw new Error('inbound-links: unknown product slug "' + l.t + '"');
    const cat = CATEGORIES.find((c) => c.rawCategory === p.category);
    if (!cat) throw new Error('inbound-links: no category for "' + p.slug + '"');
    return [{ href: '/shop/' + cat.slug + '/' + p.slug + '/', anchor: l.a, name: p.name, price: p.price_display, intent: l.i }];
  });
}
