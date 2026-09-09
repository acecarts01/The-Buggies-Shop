'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Phone, 
  CheckCircle2, 
  Zap, 
  ExternalLink,
  MessageSquare,
  Award,
  Layers,
  Compass,
  Gauge
} from 'lucide-react';
import { 
  StaggeredHeading, 
  FadeUpText, 
  RotatingWords, 
  AnimatedCounter, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedBadge 
} from '@/src/components/AnimatedText';
import { ABN_INFO, CONTACT, PRODUCTS } from '@/src/config/site';
import SmartImage from '@/src/components/SmartImage';

interface AtlasLandingPageProps {
  onAddToCart?: () => void;
}

export default function AtlasLandingPage({ onAddToCart }: AtlasLandingPageProps) {
  const atlasProduct = PRODUCTS.find((p) => p.slug === 'atlas-4-passenger-lifted-lithium-buggy');
  const [quoteSent, setQuoteSent] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    postcode: '',
    deliveryPreference: 'Door-to-Door Enclosed Transport',
    timeframe: 'Immediate Dispatch (Current Stock)',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSent(true);

    // Send quote request directly to Yatala Zoho sales desk
    fetch('/api/contact/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        formType: 'quote',
        name: quoteForm.name,
        phone: quoteForm.phone,
        postcode: quoteForm.postcode,
        buggyModel: 'Atlas 4-Passenger Lifted Lithium Buggy ($20,900 AUD)',
        subject: 'Tax Invoice & Freight Schedule: Atlas 4-Passenger Lifted Lithium Buggy',
        message: `Atlas 4-Passenger Lifted Lithium Quotation Request\nDelivery Preference: ${quoteForm.deliveryPreference}\nTimeframe: ${quoteForm.timeframe}`,
      }),
    }).catch(() => {});

    const text = encodeURIComponent(
      `Hello The Buggies Express team,
I would like to request an official Tax Invoice Quotation & Freight Schedule for the Atlas 4-Passenger Lifted Lithium Buggy ($20,900 AUD).

Name: ${quoteForm.name}
Phone: ${quoteForm.phone}
Postcode: ${quoteForm.postcode}
Delivery Preference: ${quoteForm.deliveryPreference}
Timeframe: ${quoteForm.timeframe}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/61480804189?text=${text}`, '_blank');
    }, 1200);
  };

  return (
    <article className="w-full bg-[#F7F6F2] text-[#121417]" id="atlas-flagship-landing">
      {/* Hero Section */}
      <div className="relative border-b border-[#E7E5E4] bg-gradient-to-b from-[#F7EFEA] via-[#F7F6F2] to-white py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatedBadge className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C86D51]/20 text-xs font-bold text-[#C86D51] shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#C86D51]" />
              <span>Australian Tour Flagship • Luxury 4-Passenger Edition</span>
            </AnimatedBadge>

            {/* Exactly One H1 as mandated by WebForge SEO standards with Staggered Word Entrance */}
            <StaggeredHeading
              tag="h1"
              text="Atlas 4-Passenger Lifted Lithium Buggy"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#121417] tracking-tight leading-tight"
            />

            <FadeUpText delay={0.15} className="text-lg sm:text-xl text-[#C86D51] font-serif font-medium leading-snug flex flex-wrap items-center gap-1.5">
              <span>Engineered for</span>
              <RotatingWords
                words={[
                  'Rugged Australian Acreage',
                  'Private Country Clubs',
                  'Coastal Golf Communities',
                  'Sprawling Equestrian Estates',
                ]}
              />
            </FadeUpText>

            <FadeUpText delay={0.25} className="text-sm sm:text-base text-[#78716C] leading-relaxed max-w-2xl">
              Constructed without compromise for discerning property owners, rural estate managers, and private golf communities across Queensland, New South Wales, and Victoria. High-output lithium architecture, 3-inch factory suspension clearance, and marine-grade diamond seating come standard.
            </FadeUpText>

            {/* Pricing & GST Badge */}
            <FadeUpText delay={0.3} className="p-4 rounded-xl bg-white border border-[#E7E5E4] flex flex-wrap items-baseline gap-3 shadow-sm surface-card">
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#121417] tracking-tight">
                $20,900 AUD
              </span>
              <span className="text-xs text-[#78716C]">
                GST Included • Australian Tax Invoice Provided
              </span>
              <div className="w-full text-xs text-[#121417] pt-1 flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#B45A40] hover:-translate-y-px duration-200 transition-all"></span>
                <span>In-Stock at Yatala QLD Depot • Enclosed Transport Available Australia-Wide</span>
              </div>
            </FadeUpText>

            {/* CTAs */}
            <FadeUpText delay={0.4} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="#quote-form-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B45A40] hover:bg-[#9A4C36] text-white text-sm font-extrabold rounded-lg transition-all shadow-xs active:scale-95 hover:-translate-y-px duration-200"
                id="atlas-hero-quote-cta"
              >
                <Zap className="w-4 h-4" />
                <span>Request Tax Quote &amp; Freight Schedule</span>
              </a>

              <a
                href={`tel:${CONTACT.phone}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-[#E7E5E4] bg-white text-[#121417] text-sm font-bold rounded-lg hover:bg-[#F7F6F2] hover:border-[#D6D3D1] transition-colors shadow-xs surface-card"
              >
                <Phone className="w-4 h-4 text-[#C86D51]" />
                <span>Call Specialist: 0480 804 189</span>
              </a>
            </FadeUpText>

            {/* ABN Trust Verification Stamp */}
            <FadeUpText delay={0.45} className="pt-2 flex items-center gap-2 text-xs text-[#78716C]">
              <ShieldCheck className="w-4 h-4 text-[#5E8C6A]" />
              <span>Official Australian Entity:</span>
              <a
                href={ABN_INFO.officialAbrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#C86D51] font-bold text-[#121417] inline-flex items-center gap-1"
              >
                {ABN_INFO.companyName} (ABN {ABN_INFO.abn})
                <ExternalLink className="w-3 h-3" />
              </a>
            </FadeUpText>
          </div>

          {/* Hero Visual Card / Engineering Brief with Elevation */}
          <FadeUpText delay={0.2} duration={0.6} className="lg:col-span-5 bg-white border border-[#E7E5E4] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs relative transition-all duration-300 hover:shadow-sm surface-card">
            {/* Flagship product imagery — white 4:3 frame, matches the
                catalog card treatment. */}
            <div className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden border border-[#E7E5E4]">
              <SmartImage
                src={atlasProduct?.images?.[0] || ''}
                alt="Atlas 4-Passenger Lifted Lithium Buggy"
                fill
                priority
                className="object-contain p-3"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="border-b border-[#E7E5E4] pb-4">
              <div className="text-xs uppercase font-extrabold tracking-wider text-[#C86D51]">
                Factory Build Specifications
              </div>
              <div className="text-lg font-serif font-bold text-[#121417] mt-1">
                Precision Equipment Summary
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#C86D51] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#121417]">5.0 kW AC High-Torque Motor</div>
                  <div className="text-[#78716C] mt-0.5">
                    Brushless, regenerative braking system with silent hill climbing power up to 30% gradients.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gauge className="w-5 h-5 text-[#C86D51] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#121417]">Automotive-Grade Lithium Power</div>
                  <div className="text-[#78716C] mt-0.5">
                    Integrated BMS, rapid 3.5-hour recharge cycle, and zero maintenance acid-free operation.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#C86D51] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#121417]">3-Inch Heavy-Duty Lift Kit &amp; 23&quot; AT Tyres</div>
                  <div className="text-[#78716C] mt-0.5">
                    Generous ground clearance across paddock creek-beds, gravel driveways, and undulated turf.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-[#C86D51] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#121417]">4-Passenger Fold-Down Rear Cargo Bed</div>
                  <div className="text-[#78716C] mt-0.5">
                    Flips instantly from 4 luxury bolstered passenger seats to an insulated composite flat cargo deck.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F7EFEA] border border-[#E8D2C6] rounded-lg text-xs space-y-1">
              <div className="font-bold text-[#A85640]">Yatala Depot Warranty Standard:</div>
              <div className="text-[#121417]">
                Backed by our dedicated Yatala QLD engineering center with guaranteed parts inventory and on-site field technicians.
              </div>
            </div>
          </FadeUpText>
        </div>
      </div>

      {/* 5 Engineering Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <FadeUpText className="text-xs uppercase font-extrabold tracking-wider text-[#C86D51]">
            Built For Australian Living
          </FadeUpText>
          
          <StaggeredHeading
            tag="h2"
            text="Five Reasons the Atlas Outclasses Traditional Fleet Carts"
            className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#121417] tracking-tight"
          />

          <FadeUpText delay={0.1} className="text-xs sm:text-sm text-[#78716C]">
            Standard golf club carts were designed for flat resort fairways. The Atlas was engineered from the ground up for the demands of Australian private properties.
          </FadeUpText>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <StaggerItem className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-3 shadow-xs hover:border-[#C86D51]/50 transition-all surface-card">
            <div className="w-10 h-10 rounded-lg bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center text-[#C86D51]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#121417]">
              1. Commercial-Grade Lithium Performance
            </h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Forget heavy lead-acid batteries that corrode terminals and fail within 24 months. The Atlas features an advanced lithium battery pack delivering consistent power from 100% down to 1% charge. Enjoy up to 80 km of real-world cruising on a single 3.5-hour standard 240V Australian wall outlet charge.
            </p>
          </StaggerItem>

          {/* Pillar 2 */}
          <StaggerItem className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-3 shadow-xs hover:border-[#C86D51]/50 transition-all surface-card">
            <div className="w-10 h-10 rounded-lg bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center text-[#C86D51]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#121417]">
              2. True 3-Inch Ground Clearance
            </h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Equipped with independent double-A-arm front suspension and 23-inch rugged all-terrain tyres mounted on 14-inch custom aluminium rims. Traverses washed-out rural driveways, paddock ruts, and steep homestead approaches without bottoming out or scuffing undercarriage components.
            </p>
          </StaggerItem>

          {/* Pillar 3 */}
          <StaggerItem className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-3 shadow-xs hover:border-[#C86D51]/50 transition-all surface-card">
            <div className="w-10 h-10 rounded-lg bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center text-[#C86D51]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#121417]">
              3. Bespoke Diamond-Stitched Marine Seating
            </h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Treated with UV-inhibiting agents engineered to withstand Queensland sun and coastal humidity without cracking or fading. Contoured bolster cushions keep passengers secure across uneven ground, while integrated rear fold-down armrests and cup holders ensure resort-level comfort.
            </p>
          </StaggerItem>

          {/* Pillar 4 */}
          <StaggerItem className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-3 shadow-xs hover:border-[#C86D51]/50 transition-all surface-card">
            <div className="w-10 h-10 rounded-lg bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center text-[#C86D51]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#121417]">
              4. Electronic Auto-Park &amp; 4-Wheel Hydraulic Disc Brakes
            </h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Unlike cable drum brakes that slip on wet slopes, the Atlas utilizes hydraulic disc brakes on all four wheels. When you bring the buggy to a stop on any gradient, the electronic motor brake engages automatically—no manual parking brake levers to forget.
            </p>
          </StaggerItem>

          {/* Pillar 5 */}
          <StaggerItem className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-3 shadow-xs hover:border-[#C86D51]/50 transition-all surface-card">
            <div className="w-10 h-10 rounded-lg bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center text-[#C86D51]">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#121417]">
              5. Yatala QLD Engineering &amp; Enclosed VIP Delivery
            </h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Every Atlas is pre-delivery inspected, dyno-tested, and road-calibrated inside our Yatala engineering depot. Delivered straight to your property on an enclosed specialist car trailer so your buggy arrives spotless and ready to drive immediately.
            </p>
          </StaggerItem>

          {/* Crypto Incentive Pillar */}
          <StaggerItem className="bg-white border-2 border-[#C86D51] rounded-xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center text-[#C86D51]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#C86D51]">
              Exclusive 10% Crypto Incentive
            </h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Settle your vehicle order via Bitcoin (BTC) or USDT to receive an instant 10% discount on the vehicle purchase price—saving <strong className="text-[#121417]">$2,090 AUD</strong>. Instant settlement, no bank clearing delays, and zero merchant surcharges.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Comprehensive Technical Specification Table */}
      <section className="py-12 bg-white border-y border-[#E7E5E4] px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#121417] tracking-tight">
              Atlas 4-Passenger Technical Data Sheet
            </h2>
            <p className="text-xs text-[#78716C]">
              Full factory specifications verified by Golf Buggies Express PTY LTD.
            </p>
          </div>

          <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-sm surface-card">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F6F2] text-[#121417] uppercase tracking-wider font-extrabold border-b border-[#E7E5E4]">
                <tr>
                  <th className="p-3 sm:p-4">Component</th>
                  <th className="p-3 sm:p-4">Factory Specification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4] text-[#121417]">
                <tr className="hover:bg-[#F7F6F2]">
                  <td className="p-3 sm:p-4 font-bold text-[#121417]">Electric Motor</td>
                  <td className="p-3 sm:p-4 text-[#78716C]">5.0 kW AC High-Torque Brushless Induction Motor</td>
                </tr>
                <tr className="hover:bg-[#F7F6F2]">
                  <td className="p-3 sm:p-4 font-bold text-[#121417]">Battery Bank</td>
                  <td className="p-3 sm:p-4 text-[#78716C]">Deep-Cycle Lithium Iron Phosphate (LiFePO4) 48V / 72V Architecture</td>
                </tr>
                <tr className="hover:bg-[#F7F6F2]">
                  <td className="p-3 sm:p-4 font-bold text-[#121417]">Estimated Range</td>
                  <td className="p-3 sm:p-4 text-[#78716C]">70 – 85 Kilometres per single charge (terrain dependent)</td>
                </tr>
                <tr className="hover:bg-[#F7F6F2]">
                  <td className="p-3 sm:p-4 font-bold text-[#121417]">Charging Duration</td>
                  <td className="p-3 sm:p-4 text-[#78716C]">3.5 – 4.5 Hours with on-board smart delta-Q intelligent charger</td>
                </tr>
                <tr className="hover:bg-[#F7F6F2]">
                  <td className="p-3 sm:p-4 font-bold text-[#121417]">Chassis &amp; Suspension</td>
                  <td className="p-3 sm:p-4 text-[#78716C]">Electro-coated rustproof aluminium frame with 3-inch factory lift</td>
                </tr>
                <tr className="hover:bg-[#F7F6F2]">
                  <td className="p-3 sm:p-4 font-bold text-[#121417]">Braking Architecture</td>
                  <td className="p-3 sm:p-4 text-[#78716C]">Four-wheel hydraulic discs with electromagnetic automatic parking hold</td>
                </tr>
                <tr className="hover:bg-[#F7F6F2]">
                  <td className="p-3 sm:p-4 font-bold text-[#121417]">Wheels &amp; Tyres</td>
                  <td className="p-3 sm:p-4 text-[#78716C]">14-inch Machined Alloy Wheels on 23x10-14 All-Terrain Radial Tyres</td>
                </tr>
                <tr className="hover:bg-[#F7F6F2]">
                  <td className="p-3 sm:p-4 font-bold text-[#121417]">Lighting System</td>
                  <td className="p-3 sm:p-4 text-[#78716C]">Automotive LED High/Low Beam, Daytime Running Lights, Horn, Indicators</td>
                </tr>
                <tr className="hover:bg-[#F7F6F2]">
                  <td className="p-3 sm:p-4 font-bold text-[#121417]">Cockpit Instrumentation</td>
                  <td className="p-3 sm:p-4 text-[#78716C]">9-inch HD Digital Display with Speedometer, Battery State-of-Charge, Odometer</td>
                </tr>
                <tr className="hover:bg-[#F7F6F2]">
                  <td className="p-3 sm:p-4 font-bold text-[#121417]">Warranty Coverage</td>
                  <td className="p-3 sm:p-4 text-[#C86D51] font-bold">5-Year Lithium Battery Warranty • 3-Year Factory Chassis Warranty</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Official Tax Quote & Express Freight Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto" id="quote-form-section">
        <div className="bg-white border-2 border-[#C86D51] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7EFEA] border border-[#E8D2C6] text-xs font-extrabold text-[#C86D51]">
              <Zap className="w-3.5 h-3.5" />
              <span>Official Australian Tax Quotation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#121417] tracking-tight">
              Request Tax Invoice &amp; Freight Schedule
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] max-w-xl mx-auto leading-relaxed">
              Receive a formal itemized tax invoice including verified enclosed transport rates directly to your property or nearest regional depot across Australia.
            </p>
          </div>

          {quoteSent ? (
            <div className="bg-[#F7F6F2] border border-[#E7E5E4] p-8 rounded-xl text-center space-y-3 surface-card">
              <div className="w-12 h-12 rounded-full bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center mx-auto text-[#C86D51]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#121417]">
                Quotation Request Prepared
              </h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto">
                Opening WhatsApp now with our Yatala dispatch desk to finalize freight calculations for postcode <strong className="text-[#C86D51]">{quoteForm.postcode}</strong>.
              </p>
              <div className="pt-2 text-xs text-[#121417]">
                Immediate assistance? Call Yatala Operations: <strong>0480 804 189</strong>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#121417] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    placeholder="e.g. Lachlan Sterling"
                    className="w-full bg-[#F7F6F2] border border-[#E7E5E4] rounded-lg p-3 text-[#121417] placeholder-[#78716C]/50 focus:outline-none focus:border-[#C86D51] focus:bg-white surface-card"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#121417] mb-1">Phone Number (Mobile)</label>
                  <input
                    type="tel"
                    required
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    placeholder="04XX XXX XXX"
                    className="w-full bg-[#F7F6F2] border border-[#E7E5E4] rounded-lg p-3 text-[#121417] placeholder-[#78716C]/50 focus:outline-none focus:border-[#C86D51] focus:bg-white surface-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#121417] mb-1">Delivery Destination Postcode</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.postcode}
                    onChange={(e) => setQuoteForm({ ...quoteForm, postcode: e.target.value })}
                    placeholder="e.g. 4207, 2480, 3630"
                    className="w-full bg-[#F7F6F2] border border-[#E7E5E4] rounded-lg p-3 text-[#121417] placeholder-[#78716C]/50 focus:outline-none focus:border-[#C86D51] focus:bg-white surface-card"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#121417] mb-1">Freight Method (Delivery Only)</label>
                  <select
                    value={quoteForm.deliveryPreference}
                    onChange={(e) => setQuoteForm({ ...quoteForm, deliveryPreference: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-[#E7E5E4] rounded-lg p-3 text-[#121417] focus:outline-none focus:border-[#C86D51] focus:bg-white surface-card"
                  >
                    <option value="Door-to-Door Enclosed Transport">Door-to-Door Enclosed Transport (Australia-Wide Direct)</option>
                    <option value="Regional Transport Depot">Regional Freight Depot Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#121417] mb-1">Delivery Timeframe</label>
                  <select
                    value={quoteForm.timeframe}
                    onChange={(e) => setQuoteForm({ ...quoteForm, timeframe: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-[#E7E5E4] rounded-lg p-3 text-[#121417] focus:outline-none focus:border-[#C86D51] focus:bg-white surface-card"
                  >
                    <option value="Immediate Dispatch (Current Stock)">Immediate Dispatch (Current Stock)</option>
                    <option value="Within 30 Days">Within 30 Days</option>
                    <option value="Planning Ahead (60+ Days)">Planning Ahead (60+ Days)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#B45A40] hover:bg-[#9A4C36] text-white font-extrabold text-sm rounded-lg transition-all shadow-xs mt-3 flex items-center justify-center gap-2 hover:-translate-y-px duration-200"
                id="atlas-submit-quote-form"
              >
                <Zap className="w-4 h-4" />
                <span>Submit Formal Quote &amp; Freight Schedule Request</span>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-[11px] text-[#78716C]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5E8C6A]" />
                  Includes official ABN Tax Invoice
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#C86D51]" />
                  Enclosed transport options
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8C6A]" />
                  Direct Yatala QLD engineering center
                </span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Direct Buy / Cart Options */}
      <section className="py-10 bg-white border-t border-[#E7E5E4] px-4 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h3 className="text-lg font-serif font-bold text-[#121417]">
            Ready for Immediate Acquisition?
          </h3>
          <p className="text-xs text-[#78716C]">
            Secure an in-stock Atlas from our current Yatala shipment. Settle via PayID, direct bank transfer, or crypto (BTC/USDT 10% discount).
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onAddToCart}
              className="w-full sm:w-auto px-6 py-3 bg-[#F7F6F2] hover:bg-[#F7EFEA] text-[#121417] hover:text-[#C86D51] text-xs font-bold rounded-lg border border-[#E7E5E4] hover:border-[#E8D2C6] transition-all surface-card"
            >
              Add to Order Manifest ($20,900 AUD)
            </button>
            <a
              href={`https://wa.me/61480804189?text=${encodeURIComponent(
                'Hello The Buggies Express, I would like to purchase the Atlas 4-Passenger Lifted Lithium Buggy ($20,900 AUD). Please issue a formal tax invoice.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-[#25D366] text-white text-xs font-extrabold rounded-lg hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Purchase</span>
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
