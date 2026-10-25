import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const specialty = searchParams.get('specialty')
  const city = searchParams.get('city')
  const onlineOnly = searchParams.get('online') === 'true'
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')

  const where: any = { isVerified: true }
  if (specialty) where.specialties = { some: { specialty: { name: { contains: specialty } } } }
  if (onlineOnly) where.isAvailableOnline = true
  if (search) {
    where.user = {
      name: { contains: search }
    }
  }

  const [doctors, total] = await Promise.all([
    prisma.doctor.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, avatar: true, phone: true } },
        specialties: { include: { specialty: true } },
        hospital: { select: { name: true, city: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { rating: 'desc' },
    }),
    prisma.doctor.count({ where }),
  ])

  return NextResponse.json({ doctors, total, page, pages: Math.ceil(total / limit) })
}
