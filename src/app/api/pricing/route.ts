import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.globalSettings.findUnique({
      where: { id: 'current' }
    });

    if (!settings) {
      settings = await prisma.globalSettings.create({
        data: {
          id: 'current',
          singleNaira: 20000,
          singleUsd: 20,
          aiSystemPrompt: "You are Nebiah, a compassionate and professional mental health AI assistant for Talk2Nebiah.",
        }
      });
    }

    return NextResponse.json({
      singleNaira: settings.singleNaira,
      singleUsd: settings.singleUsd,
      paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || null,
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
