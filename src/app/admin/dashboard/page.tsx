import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import {
  Users,
  Stethoscope,
  Building,
  FlaskConical,
  Pill,
  Calendar,
  ShieldCheck,
  Activity,
  UserCheck,
} from 'lucide-react'

export default async function AdminDashboard() {
  const session = await auth()

  const [
    patientsCount,
    doctorsCount,
    hospitalsCount,
    labsCount,
    pharmaciesCount,
    appointmentsCount,
    unverifiedDoctors,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.hospital.count(),
    prisma.laboratory.count(),
    prisma.pharmacy.count(),
    prisma.appointment.count(),
    prisma.doctor.findMany({ where: { isVerified: false }, include: { user: true } }),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={session?.user} />
      <div className="flex flex-1">
        <Sidebar role="SYSTEM_ADMIN" userName={session?.user?.name || 'System Admin'} />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-2">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-sky-400" /> VitaNexa System Administration
            </h1>
            <p className="text-xs text-slate-300">Global ecosystem metrics, verification queues, and system audit logs</p>
          </div>

          {/* Core Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500">Patients</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{patientsCount}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500">Doctors</span>
              <div className="text-2xl font-bold text-teal-600 mt-1">{doctorsCount}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500">Hospitals</span>
              <div className="text-2xl font-bold text-sky-600 mt-1">{hospitalsCount}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500">Labs</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">{labsCount}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500">Pharmacies</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{pharmaciesCount}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500">Appointments</span>
              <div className="text-2xl font-bold text-indigo-600 mt-1">{appointmentsCount}</div>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" /> Pending Doctor Verifications ({unverifiedDoctors.length})
            </h2>

            {unverifiedDoctors.length === 0 ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs text-slate-400 text-center">
                All doctor registration requests are currently verified and active.
              </div>
            ) : (
              <div className="space-y-3">
                {unverifiedDoctors.map((doc) => (
                  <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{doc.user.name}</div>
                      <div className="text-slate-500">License: {doc.licenseNumber} • Email: {doc.user.email}</div>
                    </div>
                    <button className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl">
                      Verify Credentials
                    </button>
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
