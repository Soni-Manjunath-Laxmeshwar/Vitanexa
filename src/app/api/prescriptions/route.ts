import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  let where: any = {}
  if (user.role === 'PATIENT') {
    const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
    if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    where.patientId = patient.id
  } else if (user.role === 'DOCTOR') {
    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } })
    if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    where.doctorId = doctor.id
  }

  const prescriptions = await prisma.prescription.findMany({
    where,
    include: {
      medicines: { include: { medicine: true } },
      doctor: { include: { user: { select: { name: true } } } },
      patient: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(prescriptions)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  if (user.role !== 'DOCTOR')
    return NextResponse.json({ error: 'Only doctors can create prescriptions' }, { status: 403 })

  const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } })
  if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })

  const body = await req.json()
  const { medicines, ...prescriptionData } = body

  const prescription = await prisma.prescription.create({
    data: {
      ...prescriptionData,
      doctorId: doctor.id,
      medicines: {
        create: medicines || [],
      },
    },
    include: {
      medicines: true,
      patient: { include: { user: { select: { name: true } } } },
    },
  })
  return NextResponse.json(prescription, { status: 201 })
}
