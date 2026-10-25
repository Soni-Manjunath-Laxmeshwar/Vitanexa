import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createSchema = z.object({
  doctorId: z.string(),
  hospitalId: z.string().optional(),
  appointmentDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  type: z.enum(['IN_PERSON', 'ONLINE']),
  reason: z.string().optional(),
  fee: z.number().optional(),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  let where: any = {}
  if (user.role === 'PATIENT') {
    const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    where.patientId = patient.id
  } else if (user.role === 'DOCTOR') {
    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } })
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    where.doctorId = doctor.id
  } else if (user.role === 'SYSTEM_ADMIN') {
    // Admin sees all
  }
  if (status) where.status = status

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        patient: {
          include: { user: { select: { name: true, email: true, phone: true } } },
        },
        doctor: {
          include: {
            user: { select: { name: true, email: true } },
            specialties: { include: { specialty: true } },
          },
        },
        hospital: true,
        consultationNote: true,
        prescription: true,
      },
      orderBy: { appointmentDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ])

  return NextResponse.json({ appointments, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  if (user.role !== 'PATIENT')
    return NextResponse.json({ error: 'Only patients can book appointments' }, { status: 403 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
  if (!patient) return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })

  const { doctorId, hospitalId, appointmentDate, startTime, endTime, type, reason, fee } =
    parsed.data

  // Double booking prevention
  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId,
      appointmentDate: new Date(appointmentDate),
      startTime,
      status: { in: ['PENDING', 'CONFIRMED', 'IN_CONSULTATION'] },
    },
  })
  if (conflict)
    return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 })

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId,
      hospitalId,
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
      type,
      reason,
      fee,
      status: 'PENDING',
    },
    include: {
      doctor: { include: { user: { select: { name: true } } } },
      hospital: true,
    },
  })

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'Appointment Booked',
      message: `Your appointment with ${appointment.doctor.user.name} has been booked for ${startTime}.`,
      type: 'APPOINTMENT',
      actionUrl: '/patient/appointments',
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'CREATE',
      resource: 'Appointment',
      resourceId: appointment.id,
      details: `Patient booked appointment`,
    },
  })

  return NextResponse.json(appointment, { status: 201 })
}
