import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { Pill, ShoppingBag, CheckCircle, Clock } from 'lucide-react'

export default async function PharmacyDashboard() {
  const session = await auth()

  const [medicinesCount, prescriptionsCount] = await Promise.all([
    prisma.medicine.count(),
    prisma.prescription.count(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={session?.user} />
      <div className="flex flex-1">
        <Sidebar role="PHARMACY_ADMIN" userName={session?.user?.name || 'MedPlus Admin'} />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-lg space-y-2">
            <h1 className="text-2xl font-bold">MedPlus Pharmacy Section</h1>
            <p className="text-xs text-emerald-200">Prescribed medicine inventory & patient refill tracking</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Active Prescription Orders</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{prescriptionsCount}</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Catalog Medicines</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{medicinesCount}</div>
            </div>
          </div>
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
