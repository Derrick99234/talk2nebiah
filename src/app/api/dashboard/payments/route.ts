import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

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

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
