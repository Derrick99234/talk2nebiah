import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        user: true,
        messages: {
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    const formattedSessions = sessions.map(s => ({
      id: s.id,
      patientId: s.userId,
      patientName: s.user.name || s.user.whatsappNumber || 'Unknown',
      struggleCategory: s.struggleCategory,
      status: s.status,
      feedbackRating: s.feedbackRating,
      notes: s.notes,
      startDate: s.startDate.toISOString(),
      resolvedDate: s.resolvedDate?.toISOString(),
      messages: s.messages.map(m => ({
        id: m.id,
        content: m.content,
        senderType: m.senderType,
        timestamp: m.timestamp.toISOString(),
      })),
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
