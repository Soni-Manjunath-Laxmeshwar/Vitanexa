import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const where: any = { isActive: true }
  if (category) where.category = category

  const tests = await prisma.labTest.findMany({
    where,
    include: { laboratory: { select: { name: true, city: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(tests)
}
