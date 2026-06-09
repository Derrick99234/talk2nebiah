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
      pricing: {
        singleNaira: settings.singleNaira,
        singleUsd: settings.singleUsd,
        monthlyNaira: settings.monthlyNaira,
        monthlyUsd: settings.monthlyUsd
      },
      aiBehavior: {
        prompt: settings.aiSystemPrompt,
        tone: 'compassionate',
        safetyThreshold: 'high',
        crisisEscalation: true
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pricing, aiBehavior } = body;

    const updatedSettings = await prisma.globalSettings.upsert({
      where: { id: 'current' },
      update: {
        singleNaira: pricing?.singleNaira,
        singleUsd: pricing?.singleUsd,
        monthlyNaira: pricing?.monthlyNaira,
        monthlyUsd: pricing?.monthlyUsd,
        aiSystemPrompt: aiBehavior?.prompt,
      },
      create: {
        id: 'current',
        singleNaira: pricing?.singleNaira || 15000,
        singleUsd: pricing?.singleUsd || 20,
        monthlyNaira: pricing?.monthlyNaira || 120000,
        monthlyUsd: pricing?.monthlyUsd || 150,
        aiSystemPrompt: aiBehavior?.prompt || "You are Nebiah, a compassionate and professional mental health AI assistant.",
      }
    });

    return NextResponse.json({ status: 'success', settings: updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
