import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  if (user.role !== 'SYSTEM_ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [
    totalPatients,
    totalDoctors,
    totalHospitals,
    totalLabs,
    totalPharmacies,
    totalAppointments,
    pendingVerifications,
    recentAppointments,
    appointmentsByStatus,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.hospital.count(),
    prisma.laboratory.count(),
    prisma.pharmacy.count(),
    prisma.appointment.count(),
    prisma.doctor.count({ where: { isVerified: false } }),
    prisma.appointment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: { include: { user: { select: { name: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
      },
    }),
    prisma.appointment.groupBy({ by: ['status'], _count: true }),
  ])

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const newUsers = await prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } })

  return NextResponse.json({
    stats: {
      totalPatients,
      totalDoctors,
      totalHospitals,
      totalLabs,
      totalPharmacies,
      totalAppointments,
      pendingVerifications,
      newUsers,
    },
    appointmentsByStatus,
    recentAppointments,
  })
}
