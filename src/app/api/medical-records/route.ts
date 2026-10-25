import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  if (user.role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const records = await prisma.medicalRecord.findMany({
    where: { patientId: patient.id },
    orderBy: { recordDate: 'desc' },
  })
  return NextResponse.json(records)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  if (user.role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const record = await prisma.medicalRecord.create({
    data: { patientId: patient.id, ...body },
  })
  return NextResponse.json(record, { status: 201 })
}
