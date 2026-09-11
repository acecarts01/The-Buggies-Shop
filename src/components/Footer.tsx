import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Phone, Mail, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import { ABN_INFO, CONTACT, CATEGORIES, SITE } from '@/src/config/site';

export default function Footer() {
  return (
    <footer className="bg-[#F7F6F2] text-[#121417] border-t border-[#E7E5E4]">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-[#E7E5E4] py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#A85640] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#121417]">Australian Business Registry Verified</div>
              <div className="text-xs text-[#6B645E] mt-0.5">
                ABN 28 668 598 758 / ACN 668 598 758 registered in Yatala QLD under ASIC regulations.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#A85640] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#121417]">Nation-Wide Enclosed Freight</div>
              <div className="text-xs text-[#6B645E] mt-0.5">
                Direct-to-door delivery across regional QLD, NSW, VIC, SA, WA, and TAS.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#A85640] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#121417]">Direct Orders &amp; Fast Dispatch</div>
              <div className="text-xs text-[#6B645E] mt-0.5">
                Immediate Australian ABN invoicing, verified freight schedules, and door-to-door nationwide delivery.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#A85640] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#121417]">Yatala Warranty & Spares Depot</div>
              <div className="text-xs text-[#6B645E] mt-0.5">
                Comprehensive Australian parts backup, servicing, and lithium battery conversions.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
        {/* Company & Entity Summary */}
        <div className="space-y-3">
          <div className="font-serif text-lg font-bold text-[#121417]">
            {SITE.name}
          </div>
          <p className="text-[#6B645E] leading-relaxed">
            Australia&apos;s most complete golf buggy business — sales, service, warranty, parts, and custom builds, backed by support that doesn&apos;t end at delivery.
          </p>
          <div className="p-3 bg-white border border-[#E7E5E4] rounded-xl text-[11px] space-y-1 shadow-xs surface-card">
            <div className="font-bold text-[#121417]">{ABN_INFO.companyName}</div>
            <div className="text-[#6B645E]">ACN: {ABN_INFO.acn}</div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[#6B645E]">ABN:</span>
              <a
                href={ABN_INFO.officialAbrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A85640] font-bold underline inline-flex items-center gap-1 hover:text-[#A85640]"
                title="Verify on Australian Business Register"
                id="footer-abn-abr-link"
              >
                {ABN_INFO.abn}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-[#6B645E]">Locality: {ABN_INFO.locality}</div>
            <div className="text-[#6B645E]">Regulator: {ABN_INFO.regulator}</div>
          </div>
        </div>

        {/* Fleet & Categories */}
        <div>
          <div className="font-bold text-sm uppercase tracking-wider text-[#121417] mb-3">
            Fleet Categories
          </div>
          <ul className="space-y-2">
            {/* Every category, not a fixed slice: the footer is the only
                site-wide internal link a category page gets, and a slice
                silently drops whichever categories were added last. */}
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/shop/${cat.slug === 'all' ? '' : cat.slug}/`}
                  className="text-[#6B645E] hover:text-[#A85640] transition-colors"
                >
                  {cat.name}
                  {cat.comingSoon && (
                    <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A85640]">
                      Coming soon
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/"
                className="text-[#A85640] font-bold hover:underline"
              >
                Atlas 4-Passenger Lifted Edition
              </Link>
            </li>
          </ul>
        </div>

        {/* Client Support & Resources */}
        <div>
          <div className="font-bold text-sm uppercase tracking-wider text-[#121417] mb-3">
            Customer Services
          </div>
          <ul className="space-y-2">
            <li>
              <Link href="/about/" className="text-[#6B645E] hover:text-[#A85640] transition-colors">
                About Our Yatala Depot
              </Link>
            </li>
            <li>
              <Link href="/shop/" className="text-[#6B645E] hover:text-[#A85640] transition-colors">
                Order Now &amp; Nationwide Freight
              </Link>
            </li>
            <li>
              <Link href="/delivery/" className="text-[#6B645E] hover:text-[#A85640] transition-colors">
                Delivery: Gold Coast &amp; Australia-Wide
              </Link>
            </li>
            <li>
              <Link href="/faq/" className="text-[#6B645E] hover:text-[#A85640] transition-colors">
                Frequently Asked Questions (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/blog/" className="text-[#6B645E] hover:text-[#A85640] transition-colors">
                Golf Buggy Blog &amp; Tech Guides
              </Link>
            </li>
            <li>
              <a
                href={ABN_INFO.officialAbrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B645E] hover:text-[#A85640] inline-flex items-center gap-1 transition-colors"
              >
                Verify ABN on ABR Portal
                <ExternalLink className="w-3 h-3 text-[#A85640]" />
              </a>
            </li>
            <li>
              <a
                href={`https://${SITE.domain}/llms.txt`}
                target="_blank"
                className="text-[#A85640] hover:text-[#A85640] transition-colors"
              >
                Agent Discovery (llms.txt)
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Hours */}
        <div className="space-y-3">
          <div className="font-bold text-sm uppercase tracking-wider text-[#121417]">
            Yatala Operations Hub
          </div>
          <div className="flex items-start gap-2 text-[#6B645E]">
            <MapPin className="w-4 h-4 text-[#A85640] shrink-0 mt-0.5" />
            <span>{CONTACT.address}</span>
          </div>
          <div className="flex items-center gap-2 text-[#6B645E]">
            <Phone className="w-4 h-4 text-[#A85640] shrink-0" />
            <a href={`tel:${CONTACT.phone}`} className="hover:text-[#A85640] font-semibold text-[#121417]">
              0480 804 189 (Mon - Sat)
            </a>
          </div>
          <div className="flex items-center gap-2 text-[#6B645E]">
            <Mail className="w-4 h-4 text-[#A85640] shrink-0" />
            {/* Entity-encoded email as mandated by WebForge SEO standards */}
            <a href="mailto:sales&#64;golfbuggiesexpress.com.au" className="hover:text-[#A85640]">
              sales&#64;golfbuggiesexpress.com.au
            </a>
          </div>
          <div className="pt-2 text-[11px] text-[#6B645E]">
            Payments: PayID / Osko, Direct Bank EFT, Pay-in-4, and 10% Crypto Discount (BTC/USDT).
          </div>
        </div>
      </div>

      {/* Bottom Legal Copyright */}
      <div className="border-t border-[#E7E5E4] px-4 py-4 text-center text-[11px] text-[#6B645E] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {new Date().getFullYear()} GOLF BUGGIES EXPRESS PTY LTD (ABN 28 668 598 758). All rights reserved.
            <div className="text-[11px] text-[#6B645E] mt-1">
              Product imagery supplied under manufacturer licence.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#A85640]">Australian Tour Precision</span>
            <span className="text-[#121417] font-semibold">GST Included In All Advertised AUD Prices</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
