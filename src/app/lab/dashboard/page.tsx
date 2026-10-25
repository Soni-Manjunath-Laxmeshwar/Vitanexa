import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { FlaskConical, FileText, CheckCircle, Clock } from 'lucide-react'

export default async function LabDashboard() {
  const session = await auth()

  const [reports, tests] = await Promise.all([
    prisma.labReport.findMany({ include: { patient: { include: { user: true } } } }),
    prisma.labTest.findMany(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={session?.user} />
      <div className="flex flex-1">
        <Sidebar role="LAB_ADMIN" userName={session?.user?.name || 'Lab Admin'} />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-amber-700 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-2">
            <h1 className="text-2xl font-bold">PathCare Diagnostics Portal</h1>
            <p className="text-xs text-amber-200">Manage diagnostic test bookings and upload patient results</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Total Test Reports</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{reports.length}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Available Test Services</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{tests.length}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Patient Test Requests</h2>
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{r.testName}</div>
                    <div className="text-slate-500">Patient: {r.patient.user.name}</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-full">
                    {r.status}
                  </span>
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
