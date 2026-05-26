import { NextResponse } from 'next/server';

export async function GET() {
  const dashboardConfig = {
    pricing: {
      singleNaira: Number(process.env.NEXT_PUBLIC_SINGLE_NAIRA) || 15000,
      singleUsd: Number(process.env.NEXT_PUBLIC_SINGLE_USD) || 20,
      monthlyNaira: Number(process.env.NEXT_PUBLIC_MONTHLY_NAIRA) || 120000,
      monthlyUsd: Number(process.env.NEXT_PUBLIC_MONTHLY_USD) || 150
    },
    aiBehavior: {
      prompt: process.env.NEXT_PUBLIC_AI_SYSTEM_PROMPT || '',
      tone: 'compassionate',
      safetyThreshold: 'high',
      crisisEscalation: true
    },
    whatsappConfig: {
      phoneNumberId: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID || '',
      accessToken: process.env.NEXT_PUBLIC_WHATSAPP_ACCESS_TOKEN || '',
      webhookUrl: process.env.NEXT_PUBLIC_WHATSAPP_WEBHOOK_URL || ''
    }
  };
  return NextResponse.json(dashboardConfig);
}

export async function POST(request: Request) {
  // In a real app, you would save these to a database or KV store.
  // For this implementation, we rely on environment variables for production stability.
  return NextResponse.json({ status: 'error', message: 'Config updates must be performed via environment variables in production' }, { status: 403 });
}
