import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const specialties = await prisma.specialty.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(specialties)
}
