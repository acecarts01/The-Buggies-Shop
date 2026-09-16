// Transactional send through the existing Zoho SMTP transport (lib/mail.ts).
// Without SMTP_PASS (local dev) nothing is sent: the message is written to
// .email-outbox/ so the exact HTML can be opened in a browser, and the API
// still succeeds so the flow can be clicked through end to end.
import fs from 'node:fs';
import path from 'node:path';
import { getZohoTransporter } from '@/lib/mail';

export interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  bcc?: string;
}

export interface SendResult {
  sent: boolean;
  messageId?: string;
  /** Local dev only: where the message was written instead of sent. */
  outboxFile?: string;
  error?: string;
}

const FROM_USER = () => process.env.SMTP_USER || process.env.ZOHO_USER || 'sales@golfbuggiesexpress.com.au';
const FROM_NAME = () => process.env.SMTP_FROM_NAME || process.env.ZOHO_FROM_NAME || 'The Buggies Express';

export const salesDeskAddress = () => process.env.CONTACT_RECEIVER || FROM_USER();

export async function sendMail(mail: Mail): Promise<SendResult> {
  const transporter = getZohoTransporter();

  if (!transporter) {
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      return { sent: false, error: 'SMTP is not configured' };
    }
    try {
      const dir = path.join(process.cwd(), '.email-outbox');
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `${Date.now()}-${mail.subject.replace(/[^a-z0-9]+/gi, '-').slice(0, 60)}.html`);
      fs.writeFileSync(file, `<!-- to: ${mail.to} | subject: ${mail.subject} -->\n${mail.html}`);
      console.warn(`[mail] SMTP not configured - wrote ${path.relative(process.cwd(), file)} instead of sending to ${mail.to}`);
      return { sent: false, outboxFile: file, error: 'SMTP not configured (dev outbox)' };
    } catch (e) {
      return { sent: false, error: (e as Error).message };
    }
  }

  try {
    const info = await transporter.sendMail({
      from: `"${FROM_NAME()}" <${FROM_USER()}>`,
      to: mail.to,
      bcc: mail.bcc,
      replyTo: mail.replyTo ?? FROM_USER(),
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    return { sent: true, messageId: info.messageId };
  } catch (e) {
    console.error('[mail] send failed:', e);
    return { sent: false, error: (e as Error).message };
  }
}
