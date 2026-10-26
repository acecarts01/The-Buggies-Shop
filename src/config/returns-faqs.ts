// FAQ for /returns/. Every answer is 40-65 words. Numbers come from RETURNS
// (site.ts) so the page, the structured data and these answers cannot disagree.
import { RETURNS } from './site';

export const RETURNS_FAQS = [
  {
    q: 'What if my buggy arrives damaged or something is missing?',
    a: `Check it when it is delivered and note any visible damage or shortage on the delivery docket. Then tell us within ${RETURNS.transitReportBusinessDays} business days, with photos, on WhatsApp or by email. We arrange the repair, replacement or refund at our cost, and we deal with the carrier ourselves.`,
  },
  {
    q: 'What if my buggy or part develops a fault?',
    a: `Australian Consumer Law guarantees apply to everything we sell. If a product is faulty or not as described, we repair it, replace it or refund it, and we cover the reasonable cost of getting it back to us. For a major failure you choose a replacement or a refund. Keep your tax invoice as proof of purchase.`,
  },
  {
    q: 'Can I return a golf buggy because I changed my mind?',
    a: `Once a buggy has been dispatched it cannot be returned for change of mind, because each one is inspected, charge-cycled and road tested for you. ${RETURNS.cancelBeforeDispatch ? 'Until it is dispatched you can cancel and we refund everything you have paid.' : 'Talk to us before you order if you are unsure.'} Faults and delivery damage are always covered.`,
  },
  {
    q: 'Can I return parts and accessories if I change my mind?',
    a: `Yes. Unused, unopened parts and accessories in their original packaging can be returned within ${RETURNS.accessoryChangeOfMindDays} days of delivery for a refund of the item price. Message us first so we can confirm the return, and you cover the return freight. Items that are faulty are covered under the guarantees instead, at our cost.`,
  },
  {
    q: 'How do I start a return, refund or warranty claim?',
    a: `Message us on WhatsApp or email the sales desk with your tax invoice number, a short description and a few photos. A person at our Yatala QLD depot replies, tells you the next step and arranges collection or repair where it applies. You deal with one team from your claim to its resolution.`,
  },
  {
    q: 'How do I get my refund?',
    a: `Approved refunds go back to the method you paid with. For bank, PayID or card payments that is the same account. For a crypto payment we refund the Australian dollar value you paid. We confirm the refund in writing, and your Australian Consumer Law rights are never reduced by anything on this page.`,
  },
];
