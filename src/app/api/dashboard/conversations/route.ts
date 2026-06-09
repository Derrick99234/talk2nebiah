import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface SessionUser {
  id: string;
  name: string | null;
  whatsappNumber: string | null;
}

interface SessionMessage {
  id: string;
  content: string | null;
  senderType: string;
  timestamp: Date;
}

interface SessionWithRelations {
  id: string;
  userId: string;
  struggleCategory: string;
  status: string;
  feedbackRating: number | null;
  notes: string | null;
  startDate: Date;
  resolvedDate: Date | null;
  user: SessionUser;
  messages: SessionMessage[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize')) || 50));
    const skip = (page - 1) * pageSize;

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        skip,
        take: pageSize,
        include: {
          user: true,
          messages: {
            orderBy: { timestamp: 'asc' },
          },
        },
        orderBy: { startDate: 'desc' },
      }),
      prisma.session.count(),
    ]);

    const formattedSessions = sessions.map((s: SessionWithRelations) => ({
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

    return NextResponse.json({
      data: formattedSessions,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
