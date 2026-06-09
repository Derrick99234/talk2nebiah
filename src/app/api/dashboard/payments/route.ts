import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize')) || 50));
    const skip = (page - 1) * pageSize;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: pageSize,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count(),
    ]);

    const formattedPayments = payments.map(p => ({
      id: p.id,
      patientId: p.userId,
      patientName: p.user.name || p.user.email || 'Unknown',
      planName: p.planName,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      date: p.createdAt.toISOString(),
      geoCountry: p.geoCountry || 'Unknown',
    }));

    return NextResponse.json({
      data: formattedPayments,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
