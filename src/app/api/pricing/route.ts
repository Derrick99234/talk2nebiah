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
          singleNaira: 15000,
          singleUsd: 20,
          monthlyNaira: 120000,
          monthlyUsd: 150,
          aiSystemPrompt: "You are Nebiah, a compassionate and professional mental health AI assistant for Talk2Nebiah.",
        }
      });
    }

    return NextResponse.json({
      singleNaira: settings.singleNaira,
      singleUsd: settings.singleUsd,
      monthlyNaira: settings.monthlyNaira,
      monthlyUsd: settings.monthlyUsd,
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
