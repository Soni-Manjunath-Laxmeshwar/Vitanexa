import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import Link from 'next/link'
import {
  Calendar,
  FileText,
  FlaskConical,
  Pill,
  Activity,
  AlertCircle,
  Stethoscope,
  Clock,
  ArrowRight,
  CheckCircle,
  Plus,
} from 'lucide-react'

export default async function PatientDashboard() {
  const session = await auth()
  const userId = session?.user?.id

  const patient = await prisma.patient.findUnique({
    where: { userId: userId || '' },
    include: {
      user: true,
      appointments: {
        include: { doctor: { include: { user: true, specialties: { include: { specialty: true } } } }, hospital: true },
        orderBy: { appointmentDate: 'asc' },
      },
      medicalRecords: { take: 5, orderBy: { recordDate: 'desc' } },
      prescriptions: { take: 5, orderBy: { createdAt: 'desc' }, include: { doctor: { include: { user: true } }, medicines: true } },
      labReports: { take: 5, orderBy: { createdAt: 'desc' } },
      healthMetrics: { take: 5, orderBy: { measuredAt: 'desc' } },
    }
  })

  const upcomingAppointments = patient?.appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING') || []
  const pastAppointments = patient?.appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED') || []

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={session?.user} />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" userName={session?.user?.name || 'Patient'} />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <h1 className="text-2xl font-bold">Welcome back, {session?.user?.name || 'Patient'} 👋</h1>
              <p className="text-sky-100 text-sm max-w-2xl">
                Your health overview is up-to-date. You have <strong className="underline">{upcomingAppointments.length} upcoming appointments</strong> scheduled.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 text-xs">
                <Link
                  href="/patient/doctors"
                  className="px-4 py-2 bg-white text-sky-800 font-semibold rounded-xl shadow-sm hover:bg-sky-50 transition-colors flex items-center gap-1.5"
                >
                  <Stethoscope className="w-4 h-4" /> Book Consultation
                </Link>
                <Link
                  href="/patient/emergency-sos"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4" /> Emergency SOS
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Upcoming Visits</span>
                <Calendar className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{upcomingAppointments.length}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Prescriptions</span>
                <Pill className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{patient?.prescriptions.length || 0}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Medical Records</span>
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{patient?.medicalRecords.length || 0}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Lab Reports</span>
                <FlaskConical className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{patient?.labReports.length || 0}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Appointments */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-600" /> Upcoming Appointments
                </h2>
                <Link href="/patient/appointments" className="text-xs text-sky-600 hover:underline font-semibold flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No upcoming appointments scheduled.
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-sm rounded-xl flex items-center justify-center shrink-0">
                          {appt.doctor.user.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">{appt.doctor.user.name}</div>
                          <div className="text-xs text-slate-500">
                            {appt.doctor.specialties[0]?.specialty.name || 'Specialist'} • {appt.type === 'ONLINE' ? '🌐 Video Call' : '🏥 In-Person'}
                          </div>
                          <div className="text-xs text-sky-600 font-semibold mt-1">
                            📅 {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.startTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-semibold rounded-full">
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions & Health Profile */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Patient Profile Summary
                </h3>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Blood Group</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{patient?.bloodGroup || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Allergies</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{patient?.allergies || 'None recorded'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Chronic Conditions</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{patient?.chronicConditions || 'None recorded'}</span>
                  </div>
                </div>
                <Link
                  href="/patient/profile"
                  className="block text-center w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-200 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>

              {/* Health Tracker Preview */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600" /> Recent Vitals
                  </h3>
                  <Link href="/patient/health-tracker" className="text-xs text-teal-600 font-semibold hover:underline">
                    Track Vitals
                  </Link>
                </div>
                {patient?.healthMetrics && patient.healthMetrics.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {patient.healthMetrics.slice(0, 3).map((m) => (
                      <div key={m.id} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-slate-500">{m.type.replace('_', ' ')}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{m.value} {m.unit}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No vitals logged recently.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
