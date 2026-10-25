import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  const { id } = await params

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, doctor: true },
  })
  if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (user.role === 'PATIENT') {
    const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
    if (appointment.patientId !== patient?.id)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  } else if (user.role === 'DOCTOR') {
    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } })
    if (appointment.doctorId !== doctor?.id)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      ...body,
      cancelledBy: body.status === 'CANCELLED' ? user.id : undefined,
      updatedAt: new Date(),
    },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'UPDATE',
      resource: 'Appointment',
      resourceId: id,
      details: `Status: ${body.status}`,
    },
  })

  return NextResponse.json(updated)
}
