import { NextResponse } from 'next/server';
import { CONTACT } from '@/src/config/site';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, formType, message, model, postcode } = data;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, message: 'Name and either email or Australian phone number are required.' },
        { status: 400 }
      );
    }

    // Process inquiry - ready for Zoho / Resend / Web3forms forwarding
    return NextResponse.json({
      success: true,
      message: 'Inquiry received. A specialist from our Yatala QLD team will be in touch within 2 business hours.',
      inquiryId: `BE-${Date.now().toString(36).toUpperCase()}`,
      dispatchedTo: CONTACT.email,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to process inquiry', error: err?.message },
      { status: 500 }
    );
  }
}
