import { NextResponse } from 'next/server';
import { CONTACT } from '@/src/config/site';
import { sendEmailThroughZoho, SendInquiryParams } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    let body: any = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        body[key] = value.toString();
      });
    } else {
      try {
        body = await request.json();
      } catch {
        // Fallback empty
      }
    }

    const {
      name,
      email,
      phone,
      state,
      postcode,
      subject,
      buggyModel,
      message,
      formType = 'contact',
      organization,
      fleetType,
      quantity,
      items,
      total,
      paymentOption,
    } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, message: 'Customer name and either an email or phone number are required.' },
        { status: 400 }
      );
    }

    const isOrder =
      formType === 'order' ||
      subject === 'NEW ORDER' ||
      (typeof subject === 'string' && subject.trim().toUpperCase() === 'NEW ORDER');

    const emailParams: SendInquiryParams = {
      formType: (isOrder ? 'order' : formType) as any,
      name,
      email,
      phone,
      state,
      postcode,
      subject: isOrder ? 'NEW ORDER' : subject,
      buggyModel,
      message,
      organization,
      fleetType,
      quantity,
      items,
      total: total ? Number(total) : undefined,
      paymentOption,
    };

    // Attempt direct dispatch via Zoho Mail SMTP
    const zohoResult = await sendEmailThroughZoho(emailParams);

    return NextResponse.json({
      success: true,
      message: 'Inquiry successfully transmitted to Yatala Depot.',
      inquiryId: `BE-${Date.now().toString(36).toUpperCase()}`,
      zohoDispatched: zohoResult.success,
      zohoError: zohoResult.error,
      dispatchedTo: CONTACT.emailRaw,
    });
  } catch (err: any) {
    console.error('[API /api/contact] Error processing inquiry:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to process inquiry', error: err?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasPassword = Boolean(process.env.SMTP_PASS || process.env.ZOHO_PASSWORD);
  const smtpUser = process.env.SMTP_USER || process.env.ZOHO_USER || 'sales@golfbuggiesexpress.com.au';
  const smtpHost = process.env.SMTP_HOST || process.env.ZOHO_SMTP_HOST || 'smtppro.zoho.com';
  const smtpPort = process.env.SMTP_PORT || process.env.ZOHO_SMTP_PORT || '465';
  const receiver = process.env.CONTACT_RECEIVER || smtpUser;

  return NextResponse.json({
    status: 'online',
    depot: 'The Buggies Express - Yatala QLD',
    zohoMail: {
      account: smtpUser,
      receiver,
      host: smtpHost,
      port: smtpPort,
      configured: hasPassword,
    },
  });
}
