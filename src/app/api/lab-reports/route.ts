import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  if (user.role === 'PATIENT') {
    const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
    if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const reports = await prisma.labReport.findMany({
      where: { patientId: patient.id },
      include: { laboratory: true, labTest: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reports)
  }

  if (user.role === 'LAB_ADMIN') {
    const lab = await prisma.laboratory.findFirst({ where: { adminUserId: user.id } })
    if (!lab) return NextResponse.json({ error: 'Lab not found' }, { status: 404 })
    const reports = await prisma.labReport.findMany({
      where: { laboratoryId: lab.id },
      include: { patient: { include: { user: { select: { name: true } } } }, labTest: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reports)
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  if (user.role !== 'LAB_ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const lab = await prisma.laboratory.findFirst({ where: { adminUserId: user.id } })
  if (!lab) return NextResponse.json({ error: 'Lab not found' }, { status: 404 })

  const body = await req.json()
  const report = await prisma.labReport.create({
    data: { laboratoryId: lab.id, ...body },
  })
  return NextResponse.json(report, { status: 201 })
}
