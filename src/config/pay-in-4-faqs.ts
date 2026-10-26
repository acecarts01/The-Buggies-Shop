// FAQ for /pay-in-4/. Every answer is 40-65 words and states only terms already
// in SHOP.financeIn4 (threshold, 0% interest, fortnightly or monthly). Numbers
// are interpolated, never typed, so they follow the config.
import { SHOP } from '@/src/config/site';
import { PAY_IN_4, fmtAud } from '@/lib/pay-in-4';

const min = fmtAud(PAY_IN_4.min);

export const PAY_IN_4_FAQS = [
  {
    q: 'Which orders can I pay in 4?',
    a: `Pay in 4 is available on orders over ${min} AUD including GST. The total is what counts, so a buggy plus accessories qualifies together. Below ${min} you can pay by PayID, bank transfer or crypto, and crypto takes ${SHOP.cryptoDiscount}% off the vehicle price. The calculator on this page shows instantly whether your order qualifies.`,
  },
  {
    q: 'Is there interest on Pay in 4?',
    a: `No. Pay in 4 carries ${SHOP.financeIn4.interestRate} interest. Your order total is split into 4 equal payments, with any spare cents added to the first one, so the four payments add up exactly to your total. The calculator shows each amount and its due date before you commit to anything.`,
  },
  {
    q: 'How often are the payments taken?',
    a: `You choose fortnightly or monthly. The first payment is due today. Fortnightly means the next three follow every 14 days, so the plan finishes in 6 weeks. Monthly means one payment a month, finishing in 3 months. Switch between the two in the calculator to compare the dates side by side.`,
  },
  {
    q: 'Does the plan include freight?',
    a: `Freight is quoted separately against your delivery postcode, so it is not in the vehicle price. Once we quote it, add the figure to the calculator's freight box to see the full amount split into 4. Your tax invoice then shows the plan against the complete order total.`,
  },
  {
    q: 'How do I start a Pay in 4 order?',
    a: `Add an eligible buggy to your cart and choose Finance in 4, or enter your numbers in the calculator and tap Set up this plan on WhatsApp. We issue your tax invoice with the plan, quote freight to your postcode, and confirm your order when you send your first payment receipt on WhatsApp.`,
  },
  {
    q: 'Can I combine Pay in 4 with the crypto discount?',
    a: `No. Pay in 4 and crypto are separate payment methods and an order uses one of them. Crypto takes ${SHOP.cryptoDiscount}% off the vehicle price when you pay in full. Pay in 4 spreads the full price over 4 payments at ${SHOP.financeIn4.interestRate} interest. The ${SHOP.accessoryBundleDiscount}% accessory bundle discount applies with either.`,
  },
];
