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
          weeklyNaira: 59000,
          weeklyUsd: 49.3,
          monthlyNaira: 120000,
          monthlyUsd: 100,
          aiSystemPrompt: "You are Nebiah, a compassionate and professional mental health AI assistant for Talk2Nebiah.",
        }
      });
    }

    return NextResponse.json({
      pricing: {
        singleNaira: settings.singleNaira,
        singleUsd: settings.singleUsd,
        weeklyNaira: settings.weeklyNaira,
        weeklyUsd: settings.weeklyUsd,
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

    const updateData: Record<string, unknown> = {};
    if (pricing) {
      if (pricing.singleNaira !== undefined) updateData.singleNaira = pricing.singleNaira;
      if (pricing.singleUsd !== undefined) updateData.singleUsd = pricing.singleUsd;
      if (pricing.weeklyNaira !== undefined) updateData.weeklyNaira = pricing.weeklyNaira;
      if (pricing.weeklyUsd !== undefined) updateData.weeklyUsd = pricing.weeklyUsd;
      if (pricing.monthlyNaira !== undefined) updateData.monthlyNaira = pricing.monthlyNaira;
      if (pricing.monthlyUsd !== undefined) updateData.monthlyUsd = pricing.monthlyUsd;
    }
    if (aiBehavior?.prompt !== undefined) updateData.aiSystemPrompt = aiBehavior.prompt;

    const updatedSettings = await prisma.globalSettings.upsert({
      where: { id: 'current' },
      update: updateData,
      create: {
        id: 'current',
        singleNaira: pricing?.singleNaira || 20000,
        singleUsd: pricing?.singleUsd || 20,
        weeklyNaira: pricing?.weeklyNaira || 59000,
        weeklyUsd: pricing?.weeklyUsd || 49.3,
        monthlyNaira: pricing?.monthlyNaira || 120000,
        monthlyUsd: pricing?.monthlyUsd || 100,
        aiSystemPrompt: aiBehavior?.prompt || "You are Nebiah, a compassionate and professional mental health AI assistant.",
      }
    });

    return NextResponse.json({ status: 'success', settings: updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
