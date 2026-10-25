import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  if (user.role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const where: any = { patientId: patient.id }
  if (type) where.type = type

  const metrics = await prisma.healthMetric.findMany({
    where,
    orderBy: { measuredAt: 'desc' },
    take: 30,
  })
  return NextResponse.json(metrics)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  if (user.role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const metric = await prisma.healthMetric.create({
    data: { patientId: patient.id, ...body },
  })
  return NextResponse.json(metric, { status: 201 })
}
