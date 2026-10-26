// Browser-safe defaults for the admin quote/invoice builder, shared by the form
// (so it can pre-fill the box) and lib/document.ts (so a blank box falls back to
// the same text). {ref} is replaced with the document reference on the server.
import { CONTACT } from '@/src/config/site';

export const DEFAULT_AFTER_PAYMENT = [
  `Send your payment receipt or a screenshot to us on WhatsApp ${CONTACT.phoneDisplay}, quoting reference {ref}.`,
  'We match the payment and confirm your order in writing.',
  'We quote freight to your delivery postcode and book dispatch from our Yatala QLD depot once the buggy has been inspected, charge-cycled and road tested.',
].join('\n');
