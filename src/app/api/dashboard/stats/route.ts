import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalPatients = await prisma.user.count({
      where: { whatsappNumber: { not: null } },
    });
    
    const activeSessions = await prisma.session.count({
      where: { status: 'ONGOING' },
    });
    
    const resolvedSessions = await prisma.session.count({
      where: { status: 'RESOLVED' },
    });

    const revenue = await prisma.payment.groupBy({
      by: ['currency'],
      where: { status: 'SUCCESSFUL' },
      _sum: {
        amount: true,
      },
    });

    const stats = {
      totalPatients,
      activeSessions,
      resolvedSessions,
      revenue: revenue.reduce((acc: Record<string, number>, curr) => {
        acc[curr.currency] = curr._sum.amount || 0;
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
