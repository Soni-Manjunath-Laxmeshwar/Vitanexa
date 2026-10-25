'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { Pill, Calendar, User, Clock, CheckCircle, RefreshCw } from 'lucide-react'

interface Prescription {
  id: string
  diagnosis?: string
  notes?: string
  validUntil?: string
  createdAt: string
  doctor: { user: { name: string } }
  medicines: {
    id: string
    medicineName: string
    dosage: string
    frequency: string
    duration?: string
    instructions?: string
  }[]
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/prescriptions')
      const data = await res.json()
      if (Array.isArray(data)) setPrescriptions(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleRefill = (medicineName: string) => {
    alert(`Refill request placed for: ${medicineName}. The pharmacy will contact you.`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-6 h-6 text-teal-600" /> Digital Prescriptions
            </h1>
            <p className="text-xs text-slate-500">View active prescriptions, medication dosages, and request refills</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading prescriptions...</div>
          ) : prescriptions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Pill className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No prescriptions found</h3>
              <p className="text-xs text-slate-500">Your doctor will issue prescriptions following your consultations.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Issued by {rx.doctor.user.name}</span>
                      </h3>
                      {rx.diagnosis && (
                        <p className="text-xs text-teal-600 font-semibold mt-0.5">Diagnosis: {rx.diagnosis}</p>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Issued: {new Date(rx.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Medicines Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500">
                          <th className="p-3 rounded-l-xl">Medicine</th>
                          <th className="p-3">Dosage</th>
                          <th className="p-3">Frequency</th>
                          <th className="p-3">Duration</th>
                          <th className="p-3">Instructions</th>
                          <th className="p-3 rounded-r-xl text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {rx.medicines.map((med) => (
                          <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="p-3 font-bold text-slate-900 dark:text-white">{med.medicineName}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-300">{med.dosage}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-300">{med.frequency}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-300">{med.duration || 'N/A'}</td>
                            <td className="p-3 text-slate-500 italic">{med.instructions || 'As advised'}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleRefill(med.medicineName)}
                                className="px-3 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300 font-semibold rounded-lg transition-colors flex items-center gap-1 ml-auto text-[11px]"
                              >
                                <RefreshCw className="w-3 h-3" /> Request Refill
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {rx.notes && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-2xl text-xs text-amber-900 dark:text-amber-200">
                      <strong>Doctor Notes:</strong> {rx.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
