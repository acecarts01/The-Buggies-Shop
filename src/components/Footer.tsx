import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Phone, Mail, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import { ABN_INFO, CONTACT, CATEGORIES, SITE } from '@/src/config/site';

export default function Footer() {
  return (
    <footer className="bg-[#F8F9FA] text-[#1E293B] border-t border-[#E2E8F0]">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-[#E2E8F0] py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#1E293B]">Australian Business Registry Verified</div>
              <div className="text-xs text-[#64748B] mt-0.5">
                ABN 28 668 598 758 / ACN 668 598 758 registered in Yatala QLD under ASIC regulations.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#1E293B]">Nation-Wide Enclosed Freight</div>
              <div className="text-xs text-[#64748B] mt-0.5">
                Direct-to-door delivery across regional QLD, NSW, VIC, SA, WA, and TAS.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#1E293B]">Direct Orders &amp; Fast Dispatch</div>
              <div className="text-xs text-[#64748B] mt-0.5">
                Immediate Australian ABN invoicing, verified freight schedules, and door-to-door nationwide delivery.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#1E293B]">Yatala Warranty & Spares Depot</div>
              <div className="text-xs text-[#64748B] mt-0.5">
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
          <div className="font-serif text-lg font-bold text-[#1E293B]">
            {SITE.name}
          </div>
          <p className="text-[#64748B] leading-relaxed">
            Australia&apos;s most complete golf buggy business — sales, service, warranty, parts, and custom builds, backed by support that doesn&apos;t end at delivery.
          </p>
          <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-[11px] space-y-1 shadow-xs">
            <div className="font-bold text-[#1E293B]">{ABN_INFO.companyName}</div>
            <div className="text-[#64748B]">ACN: {ABN_INFO.acn}</div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[#64748B]">ABN:</span>
              <a
                href={ABN_INFO.officialAbrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] font-bold underline inline-flex items-center gap-1 hover:text-[#1D4ED8]"
                title="Verify on Australian Business Register"
                id="footer-abn-abr-link"
              >
                {ABN_INFO.abn}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-[#64748B]">Locality: {ABN_INFO.locality}</div>
            <div className="text-[#64748B]">Regulator: {ABN_INFO.regulator}</div>
          </div>
        </div>

        {/* Fleet & Categories */}
        <div>
          <div className="font-bold text-sm uppercase tracking-wider text-[#1E293B] mb-3">
            Fleet Categories
          </div>
          <ul className="space-y-2">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/shop/${cat.slug === 'all' ? '' : cat.slug}/`}
                  className="text-[#64748B] hover:text-[#2563EB] transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/"
                className="text-[#2563EB] font-bold hover:underline"
              >
                Atlas 4-Passenger Lifted Edition
              </Link>
            </li>
          </ul>
        </div>

        {/* Client Support & Resources */}
        <div>
          <div className="font-bold text-sm uppercase tracking-wider text-[#1E293B] mb-3">
            Customer Services
          </div>
          <ul className="space-y-2">
            <li>
              <Link href="/about/" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                About Our Yatala Depot
              </Link>
            </li>
            <li>
              <Link href="/shop/" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                Order Now &amp; Nationwide Freight
              </Link>
            </li>
            <li>
              <Link href="/faq/" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                Frequently Asked Questions (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/blog/" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                Golf Buggy Blog &amp; Tech Guides
              </Link>
            </li>
            <li>
              <a
                href={ABN_INFO.officialAbrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#64748B] hover:text-[#2563EB] inline-flex items-center gap-1 transition-colors"
              >
                Verify ABN on ABR Portal
                <ExternalLink className="w-3 h-3 text-[#2563EB]" />
              </a>
            </li>
            <li>
              <a
                href={`https://${SITE.domain}/llms.txt`}
                target="_blank"
                className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
              >
                Agent Discovery (llms.txt)
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Hours */}
        <div className="space-y-3">
          <div className="font-bold text-sm uppercase tracking-wider text-[#1E293B]">
            Yatala Operations Hub
          </div>
          <div className="flex items-start gap-2 text-[#64748B]">
            <MapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <span>{CONTACT.address}</span>
          </div>
          <div className="flex items-center gap-2 text-[#64748B]">
            <Phone className="w-4 h-4 text-[#2563EB] shrink-0" />
            <a href={`tel:${CONTACT.phone}`} className="hover:text-[#2563EB] font-semibold text-[#1E293B]">
              0480 804 189 (Mon - Sat)
            </a>
          </div>
          <div className="flex items-center gap-2 text-[#64748B]">
            <Mail className="w-4 h-4 text-[#2563EB] shrink-0" />
            {/* Entity-encoded email as mandated by WebForge SEO standards */}
            <a href="mailto:sales&#64;golfbuggiesexpress.com.au" className="hover:text-[#2563EB]">
              sales&#64;golfbuggiesexpress.com.au
            </a>
          </div>
          <div className="pt-2 text-[11px] text-[#64748B]">
            Payments: PayID / Osko, Direct Bank EFT, Pay-in-4, and 10% Crypto Discount (BTC/USDT).
          </div>
        </div>
      </div>

      {/* Bottom Legal Copyright */}
      <div className="border-t border-[#E2E8F0] px-4 py-4 text-center text-[11px] text-[#64748B] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {new Date().getFullYear()} GOLF BUGGIES EXPRESS PTY LTD (ABN 28 668 598 758). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#2563EB]">Australian Tour Precision</span>
            <span className="text-[#1E293B] font-semibold">GST Included In All Advertised AUD Prices</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
