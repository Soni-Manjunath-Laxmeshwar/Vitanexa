import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const where: any = { isActive: true }
  if (search) where.OR = [{ name: { contains: search } }, { genericName: { contains: search } }]

  const medicines = await prisma.medicine.findMany({
    where,
    take: 20,
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(medicines)
}
