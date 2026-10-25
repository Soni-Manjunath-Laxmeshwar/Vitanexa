import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and number'
    ),
  role: z.enum(['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN', 'LAB_ADMIN', 'PHARMACY_ADMIN']).default('PATIENT'),
  phone: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const { name, email, password, role, phone } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing)
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role, phone, isActive: true },
    })

    if (role === 'PATIENT') {
      await prisma.patient.create({ data: { userId: user.id } })
    } else if (role === 'DOCTOR') {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          licenseNumber: `MCI-${Date.now()}`,
        }
      })
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        resource: 'User',
        resourceId: user.id,
        details: `New ${role} registered`,
      },
    })

    return NextResponse.json(
      { message: 'Registration successful', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
