'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { Users, FileText, Calendar, Phone } from 'lucide-react'

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/appointments')
      const data = await res.json()
      if (data.appointments) {
        const unique = Array.from(new Set(data.appointments.map((a: any) => a.patient.id)))
          .map(id => data.appointments.find((a: any) => a.patient.id === id).patient)
        setPatients(unique)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="DOCTOR" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-teal-600" /> Patient Directory
            </h1>
            <p className="text-xs text-slate-500">Patients who have consulted with you</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading patients...</div>
          ) : patients.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No patients recorded yet</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((p) => (
                <div key={p.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950 text-teal-700 font-bold text-sm rounded-2xl flex items-center justify-center">
                      {p.user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{p.user.name}</h3>
                      <p className="text-xs text-slate-500">{p.user.email}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div><strong>Blood Group:</strong> {p.bloodGroup || 'O+'}</div>
                    <div><strong>Allergies:</strong> {p.allergies || 'None'}</div>
                  </div>
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
