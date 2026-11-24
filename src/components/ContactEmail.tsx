import React from 'react';
import { CONTACT } from '@/src/config/site';

/**
 * The sales address as visible text. CONTACT.email is HTML-entity-encoded
 * (&#64;) to keep it out of naive scrapers, so it must be injected as HTML:
 * as a React text child the ampersand is escaped and the page prints the
 * literal "sales&#64;golfbuggiesexpress.com.au". The value is a constant from
 * site.ts, never user input. Links must use CONTACT.emailRaw for the href.
 */
export default function ContactEmail() {
  return <span dangerouslySetInnerHTML={{ __html: CONTACT.email }} />;
}
