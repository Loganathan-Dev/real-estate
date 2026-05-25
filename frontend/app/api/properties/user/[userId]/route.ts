import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const properties = await prisma.property.findMany({
      where: { userId: params.userId },
      include: { images: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}