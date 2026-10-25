import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  const patient = await prisma.patient.findUnique({
    where: { userId: user.id },
    include: {
      user: { select: { name: true, email: true, phone: true, avatar: true, createdAt: true } },
      emergencyContacts: true,
    },
  })
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(patient)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  const body = await req.json()
  const { name, phone, ...patientData } = body

  if (name || phone) {
    await prisma.user.update({
      where: { id: user.id },
      data: { ...(name && { name }), ...(phone && { phone }) },
    })
  }

  const patient = await prisma.patient.upsert({
    where: { userId: user.id },
    update: { ...patientData, updatedAt: new Date() },
    create: { userId: user.id, ...patientData },
  })
  return NextResponse.json(patient)
}
