import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let cachedTransporter: Transporter | null = null;

function createTransporter(host: string, port: number, secure: boolean, user: string, pass: string): Transporter {
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export function getZohoTransporter(preferredHost?: string): Transporter | null {
  const user = process.env.SMTP_USER || process.env.ZOHO_USER || 'sales@golfbuggiesexpress.com.au';
  const pass = process.env.SMTP_PASS || process.env.ZOHO_PASSWORD;

  if (!pass) {
    console.warn('[Zoho Mail] SMTP password (SMTP_PASS / ZOHO_PASSWORD) is not set. Email delivery will be skipped.');
    return null;
  }

  const host = preferredHost || process.env.SMTP_HOST || process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com';
  const port = parseInt(process.env.SMTP_PORT || process.env.ZOHO_SMTP_PORT || '465', 10);
  const secure = (process.env.SMTP_SECURE || process.env.ZOHO_SECURE) !== 'false'; // true for port 465

  if (!preferredHost && cachedTransporter) {
    return cachedTransporter;
  }

  const transporter = createTransporter(host, port, secure, user, pass);

  if (!preferredHost) {
    cachedTransporter = transporter;
  }

  return transporter;
}

export interface SendInquiryParams {
  formType?: 'contact' | 'wholesale' | 'order' | 'quote' | 'tradein';
  name: string;
  email?: string;
  phone?: string;
  state?: string;
  postcode?: string;
  subject?: string;
  buggyModel?: string;
  message?: string;
  // Wholesale specific
  organization?: string;
  fleetType?: string;
  quantity?: string;
  // Order specific
  items?: Array<{ name: string; quantity: number; price?: number; id?: string }>;
  total?: number;
  paymentOption?: string;
}

export async function sendEmailThroughZoho(params: SendInquiryParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transporter = getZohoTransporter();
  const zohoUser = process.env.SMTP_USER || process.env.ZOHO_USER || 'sales@golfbuggiesexpress.com.au';
  const receiverEmail = process.env.CONTACT_RECEIVER || zohoUser;
  const fromName = process.env.SMTP_FROM_NAME || process.env.ZOHO_FROM_NAME || 'The Buggies Express';

  if (!transporter) {
    return {
      success: false,
      error: 'Zoho Mail SMTP is not configured. Please set SMTP_PASS (or ZOHO_PASSWORD) in your Vercel Environment Variables.',
    };
  }

  const titleMap: Record<string, string> = {
    contact: 'New General Enquiry — Yatala Depot',
    wholesale: 'Commercial Fleet / Wholesale Tender Request',
    order: 'NEW ORDER',
    quote: 'Custom Buggy Specification & Pricing Request',
    tradein: 'Trade-in Valuation Enquiry',
  };

  const formType = params.formType || 'contact';
  const heading = titleMap[formType] || 'New Website Inquiry';

  // The subject MUST be "NEW ORDER" when an order is placed
  const isOrderPlacement =
    formType === 'order' ||
    params.subject === 'NEW ORDER' ||
    (params.subject && params.subject.trim().toUpperCase() === 'NEW ORDER');

  const emailSubject = isOrderPlacement
    ? 'NEW ORDER'
    : `[${formType.toUpperCase()}] ${params.subject || heading} from ${params.name}`;

  // Build HTML table for items if present
  let itemsHtml = '';
  if (params.items && params.items.length > 0) {
    itemsHtml = `
      <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
        <h3 style="color: #0f172a; margin-bottom: 8px; font-size: 15px;">Requested Equipment / Items</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background: #f1f5f9; text-align: left;">
              <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Item Name</th>
              <th style="padding: 8px 10px; border: 1px solid #cbd5e1; width: 60px; text-align: center;">Qty</th>
              ${params.items.some(i => i.price) ? '<th style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: right;">Est. Price</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${params.items.map(item => `
              <tr>
                <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${item.name}</td>
                <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${item.quantity}</td>
                ${item.price ? `<td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: right;">$${item.price.toLocaleString()} AUD</td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${params.total ? `<p style="text-align: right; font-weight: bold; font-size: 15px; color: #1d4ed8; margin-top: 10px;">Total: $${params.total.toLocaleString()} AUD</p>` : ''}
      </div>
    `;
  }

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: #101935; color: #ffffff; padding: 24px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #fbbf24; }
          .header p { margin: 4px 0 0; font-size: 12px; color: #94a3b8; }
          .content { padding: 30px; }
          .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 15px; }
          .details-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .details-table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: top; }
          .details-table td.label { font-weight: 600; color: #64748b; width: 140px; }
          .details-table td.value { color: #0f172a; }
          .message-box { background: #f8fafc; border-left: 4px solid #38bdf8; padding: 15px 20px; border-radius: 0 6px 6px 0; margin-top: 20px; font-size: 14px; line-height: 1.6; color: #334155; }
          .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>The Buggies Express</h1>
            <p>Yatala QLD Industrial Depot · ABN 28 668 598 758</p>
          </div>
          <div class="content">
            <span class="badge">${formType.toUpperCase()} SUBMISSION</span>
            <h2 style="margin: 0 0 15px; font-size: 18px; color: #0f172a;">${heading}</h2>

            <table class="details-table">
              <tr>
                <td class="label">Customer Name:</td>
                <td class="value"><strong>${params.name}</strong></td>
              </tr>
              ${params.email ? `
              <tr>
                <td class="label">Email:</td>
                <td class="value"><a href="mailto:${params.email}" style="color: #2563eb; text-decoration: none;">${params.email}</a></td>
              </tr>` : ''}
              ${params.phone ? `
              <tr>
                <td class="label">Phone:</td>
                <td class="value"><a href="tel:${params.phone.replace(/[^0-9+]/g, '')}" style="color: #2563eb; text-decoration: none;"><strong>${params.phone}</strong></a></td>
              </tr>` : ''}
              ${params.organization ? `
              <tr>
                <td class="label">Organisation:</td>
                <td class="value">${params.organization}</td>
              </tr>` : ''}
              ${params.fleetType ? `
              <tr>
                <td class="label">Fleet Category:</td>
                <td class="value">${params.fleetType}</td>
              </tr>` : ''}
              ${params.quantity ? `
              <tr>
                <td class="label">Quantity / Scope:</td>
                <td class="value">${params.quantity} units</td>
              </tr>` : ''}
              ${params.buggyModel ? `
              <tr>
                <td class="label">Model of Interest:</td>
                <td class="value">${params.buggyModel}</td>
              </tr>` : ''}
              ${params.state ? `
              <tr>
                <td class="label">State / Territory:</td>
                <td class="value">${params.state}</td>
              </tr>` : ''}
              ${params.postcode ? `
              <tr>
                <td class="label">Postcode:</td>
                <td class="value">${params.postcode}</td>
              </tr>` : ''}
              ${params.paymentOption ? `
              <tr>
                <td class="label">Payment Preference:</td>
                <td class="value">${params.paymentOption}</td>
              </tr>` : ''}
            </table>

            ${itemsHtml}

            ${params.message ? `
              <div style="margin-top: 20px;">
                <strong style="color: #0f172a; font-size: 13px;">Customer Message / Technical Requirements:</strong>
                <div class="message-box">${params.message.replace(/\n/g, '<br/>')}</div>
              </div>
            ` : ''}

            <div style="margin-top: 25px; padding: 12px; background: #eff6ff; border-radius: 6px; font-size: 12px; color: #1e40af; text-align: center;">
              Reply directly to this email to respond to <strong>${params.name}</strong>${params.email ? ` (${params.email})` : ''}.
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 5px;"><strong>The Buggies Express</strong> · Yatala QLD 4207 Australia</p>
            <p style="margin: 0;">Phone: 0480 408 189 · Email: ${zohoUser} · ACN: 668 598 758</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textLines = [
    `=== ${heading.toUpperCase()} ===`,
    `Customer Name: ${params.name}`,
    params.email ? `Email: ${params.email}` : '',
    params.phone ? `Phone: ${params.phone}` : '',
    params.organization ? `Organisation: ${params.organization}` : '',
    params.fleetType ? `Fleet Type: ${params.fleetType}` : '',
    params.quantity ? `Quantity: ${params.quantity}` : '',
    params.buggyModel ? `Buggy Model: ${params.buggyModel}` : '',
    params.state ? `State: ${params.state}` : '',
    params.postcode ? `Postcode: ${params.postcode}` : '',
    params.paymentOption ? `Payment Option: ${params.paymentOption}` : '',
    '',
    params.message ? `Message:\n${params.message}\n` : '',
    params.items && params.items.length > 0
      ? `Items:\n` + params.items.map(i => `- ${i.name} (Qty: ${i.quantity})${i.price ? ` - $${i.price} AUD` : ''}`).join('\n')
      : '',
    params.total ? `Total: $${params.total} AUD` : '',
    '',
    `Dispatched via The Buggies Express Zoho Mail Integration (sales@golfbuggiesexpress.com.au)`,
  ].filter(Boolean).join('\n');

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${zohoUser}>`,
      to: receiverEmail,
      replyTo: params.email || zohoUser,
      subject: emailSubject,
      text: textLines,
      html: htmlBody,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.warn('[Zoho Mail] Primary attempt failed:', err?.message);

    // If host was smtppro.zoho.com and gave 554/Access Restricted, retry on smtp.zoho.com
    const currentHost = process.env.SMTP_HOST || process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com';
    if (currentHost.includes('smtppro.zoho.com')) {
      try {
        console.log('[Zoho Mail] Retrying on standard smtp.zoho.com endpoint...');
        const fallbackTransporter = getZohoTransporter('smtp.zoho.com');
        if (fallbackTransporter) {
          const fallbackInfo = await fallbackTransporter.sendMail({
            from: `"${fromName}" <${zohoUser}>`,
            to: receiverEmail,
            replyTo: params.email || zohoUser,
            subject: emailSubject,
            text: textLines,
            html: htmlBody,
          });
          return {
            success: true,
            messageId: fallbackInfo.messageId,
          };
        }
      } catch (retryErr: any) {
        console.error('[Zoho Mail] Fallback retry also failed:', retryErr);
      }
    }

    return {
      success: false,
      error: err?.message || 'Failed to dispatch email via Zoho SMTP',
    };
  }
}
