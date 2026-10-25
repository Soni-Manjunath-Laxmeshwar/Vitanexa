import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import Link from 'next/link'
import {
  Stethoscope,
  Calendar,
  Users,
  Pill,
  Clock,
  Video,
  Building,
  CheckCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export default async function DoctorDashboard() {
  const session = await auth()
  const userId = session?.user?.id

  const doctor = await prisma.doctor.findUnique({
    where: { userId: userId || '' },
    include: {
      user: true,
      hospital: true,
      specialties: { include: { specialty: true } },
      appointments: {
        include: { patient: { include: { user: true } } },
        orderBy: { appointmentDate: 'asc' },
      },
    }
  })

  const todayAppointments = doctor?.appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING') || []
  const totalCompleted = doctor?.appointments.filter(a => a.status === 'COMPLETED').length || 0

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={session?.user} />
      <div className="flex flex-1">
        <Sidebar role="DOCTOR" userName={session?.user?.name || 'Doctor'} />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
                <Stethoscope className="w-4 h-4" /> Doctor Clinical Portal
              </div>
              <h1 className="text-2xl font-bold">Welcome, {session?.user?.name || 'Dr. Sharma'} 🩺</h1>
              <p className="text-teal-100 text-sm max-w-2xl">
                Specialty: <strong>{doctor?.specialties[0]?.specialty.name || 'Cardiology'}</strong> • Hospital: <strong>{doctor?.hospital?.name || 'Apollo Hospital'}</strong>
              </p>
              <div className="pt-2 flex flex-wrap gap-3 text-xs">
                <Link
                  href="/doctor/appointments"
                  className="px-4 py-2 bg-white text-teal-900 font-semibold rounded-xl shadow-sm hover:bg-teal-50 transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" /> Today&apos;s Schedule ({todayAppointments.length})
                </Link>
                <Link
                  href="/doctor/prescriptions"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Pill className="w-4 h-4" /> Issue Digital Prescription
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Upcoming Consultations</span>
                <Calendar className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{todayAppointments.length}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Completed Visits</span>
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalCompleted}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Patient Rating</span>
                <span className="text-amber-500 font-bold text-sm">★ {doctor?.rating || 4.8}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{doctor?.totalRatings || 234} Reviews</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Consultation Fee</span>
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">₹{doctor?.consultationFee || 1500}</div>
            </div>
          </div>

          {/* Today's Appointments List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" /> Upcoming Patient Consultations
              </h2>
              <Link href="/doctor/appointments" className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1">
                Manage All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No upcoming patient appointments scheduled for today.</div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-sm rounded-xl flex items-center justify-center shrink-0">
                        {appt.patient.user.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{appt.patient.user.name}</div>
                        <div className="text-xs text-slate-500">
                          {appt.type === 'ONLINE' ? '🌐 Video Call' : '🏥 In-Person Visit'} • Reason: {appt.reason || 'General Checkup'}
                        </div>
                        <div className="text-xs text-teal-600 font-semibold mt-1">
                          📅 {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.startTime}
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/doctor/appointments"
                      className="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Start Consultation
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
