import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { Building, Stethoscope, Users, Calendar, TrendingUp } from 'lucide-react'

export default async function HospitalDashboard() {
  const session = await auth()

  const [doctorsCount, appointmentsCount, hospital] = await Promise.all([
    prisma.doctor.count(),
    prisma.appointment.count(),
    prisma.hospital.findFirst({ include: { departments: true } }),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={session?.user} />
      <div className="flex flex-1">
        <Sidebar role="HOSPITAL_ADMIN" userName={session?.user?.name || 'Hospital Admin'} />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-sky-800 to-indigo-900 text-white p-6 rounded-3xl shadow-lg space-y-2">
            <h1 className="text-2xl font-bold">{hospital?.name || 'Apollo Multi-Specialty Hospital'}</h1>
            <p className="text-xs text-sky-200">License: {hospital?.licenseNo} • Location: {hospital?.city}, {hospital?.state}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Affiliated Doctors</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{doctorsCount}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Total Hospital Bookings</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{appointmentsCount}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Active Departments</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{hospital?.departments.length || 5}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Hospital Clinical Departments</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {hospital?.departments.map((d) => (
                <div key={d.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-semibold text-slate-800 dark:text-slate-200">
                  🩺 {d.name}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
