import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { generateAuthToken } from '@/lib/token';
import { sendAuthTokenEmail } from '@/lib/email';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (!signature) {
      return new NextResponse('No signature', { status: 401 });
    }

    // Verify signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const data = event.data;
      const { reference, amount, customer, metadata } = data;
      const email = customer.email;
      const planName = metadata?.plan_name || 'One Session';
      const currency = data.currency;

      // 1. Find or create user
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: customer.first_name ? `${customer.first_name} ${customer.last_name || ''}`.trim() : null,
          },
        });
      }

      // 2. Log payment
      await prisma.payment.upsert({
        where: { paystackReference: reference },
        update: {
          status: 'SUCCESSFUL',
          amount: amount / 100, // Paystack is in kobo/cents
        },
        create: {
          paystackReference: reference,
          userId: user.id,
          amount: amount / 100,
          currency: currency,
          status: 'SUCCESSFUL',
          planName: planName,
          geoCountry: data.authorization?.country_code || 'Unknown',
        },
      });

      // 3. Generate Auth Token
      const authToken = await generateAuthToken(user.id);

      await sendAuthTokenEmail(email, authToken.token);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
