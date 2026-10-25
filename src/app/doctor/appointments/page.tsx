'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { Calendar, Clock, Video, Building, CheckCircle, FileText, Pill, X, AlertCircle } from 'lucide-react'

interface Appointment {
  id: string
  appointmentDate: string
  startTime: string
  endTime: string
  type: string
  status: string
  reason?: string
  fee?: number
  patient: {
    id: string
    user: { name: string; email: string; phone?: string }
  }
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)

  // Clinical Note Form
  const [chiefComplaint, setChiefComplaint] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [plan, setPlan] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/appointments')
      const data = await res.json()
      setAppointments(data.appointments || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAppt) return
    setSavingNote(true)

    try {
      const res = await fetch(`/api/appointments/${selectedAppt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          notes: `Diagnosis: ${diagnosis} | Plan: ${plan}`,
        }),
      })

      if (res.ok) {
        setSelectedAppt(null)
        setChiefComplaint('')
        setDiagnosis('')
        setPlan('')
        fetchAppointments()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSavingNote(false)
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
              <Calendar className="w-6 h-6 text-teal-600" /> Patient Schedule & Clinical Notes
            </h1>
            <p className="text-xs text-slate-500">Manage patient visits, record diagnoses, and issue clinical summaries</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading patient appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No consultations scheduled</h3>
              <p className="text-xs text-slate-500">Booked patient appointments will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950 text-teal-700 font-bold text-sm rounded-2xl flex items-center justify-center shrink-0">
                        {appt.patient.user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{appt.patient.user.name}</h3>
                        <p className="text-xs text-slate-500">
                          {appt.type === 'ONLINE' ? '🌐 Video Call' : '🏥 In-Person'} • Phone: {appt.patient.user.phone || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        appt.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                      }`}>
                        {appt.status}
                      </span>
                      {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                        <button
                          onClick={() => setSelectedAppt(appt)}
                          className="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-semibold text-xs rounded-xl hover:opacity-90 transition-opacity"
                        >
                          Write Clinical Note
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Date & Time</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.startTime}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Chief Complaint</span>
                      <span className="font-bold text-slate-900 dark:text-white">{appt.reason || 'General Health Checkup'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Consultation Fee</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{appt.fee || 500}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Consultation Note Modal */}
          {selectedAppt && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 relative">
                <button
                  onClick={() => setSelectedAppt(null)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Record Clinical Consultation</h3>
                  <p className="text-xs text-slate-500">Patient: {selectedAppt.patient.user.name}</p>
                </div>

                <form onSubmit={handleCompleteConsultation} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Chief Complaint & Symptoms</label>
                    <input
                      type="text"
                      required
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      placeholder="e.g. Throbbing migraine for 3 days, nausea"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Diagnosis</label>
                    <input
                      type="text"
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Migraine with aura / Acute Sinusitis"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Treatment Plan & Follow-up</label>
                    <textarea
                      rows={3}
                      required
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      placeholder="e.g. Prescribed sumatriptan 50mg. Advised 8 hours rest. Follow up in 2 weeks."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingNote}
                    className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-md"
                  >
                    {savingNote ? 'Saving Consultation...' : 'Complete Visit & Save Note'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
