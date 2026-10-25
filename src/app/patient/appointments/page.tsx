'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import {
  Calendar,
  Clock,
  Video,
  Building,
  CheckCircle,
  XCircle,
  FileText,
  Pill,
  AlertCircle,
  User,
} from 'lucide-react'

interface Appointment {
  id: string
  appointmentDate: string
  startTime: string
  endTime: string
  type: string
  status: string
  reason?: string
  fee?: number
  cancelReason?: string
  doctor: {
    user: { name: string; email: string }
    specialties: { specialty: { name: string } }[]
  }
  hospital?: { name: string; city: string }
  consultationNote?: { diagnosis: string; chiefComplaint: string; plan: string }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  useEffect(() => {
    fetchAppointments()
  }, [filterStatus])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const url = filterStatus === 'ALL' ? '/api/appointments' : `/api/appointments?status=${filterStatus}`
      const res = await fetch(url)
      const data = await res.json()
      setAppointments(data.appointments || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: string) => {
    const reason = prompt('Please specify a reason for cancellation:')
    if (!reason) return

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED', cancelReason: reason }),
      })
      if (res.ok) {
        fetchAppointments()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-bold text-xs rounded-full">CONFIRMED</span>
      case 'PENDING':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold text-xs rounded-full">PENDING</span>
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold text-xs rounded-full">COMPLETED</span>
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 font-bold text-xs rounded-full">CANCELLED</span>
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 font-bold text-xs rounded-full">{status}</span>
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-sky-600" /> My Appointments
              </h1>
              <p className="text-xs text-slate-500">Track and manage all your healthcare appointments</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold">
              {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    filterStatus === st
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No appointments found</h3>
              <p className="text-xs text-slate-500">You don&apos;t have any appointments matching this status.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-sm rounded-2xl flex items-center justify-center shrink-0">
                        {appt.doctor.user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{appt.doctor.user.name}</h3>
                        <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                          {appt.doctor.specialties[0]?.specialty.name || 'Specialist'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(appt.status)}
                      {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-100 font-semibold text-xs rounded-xl transition-colors"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Date & Time</span>
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.startTime}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Consultation Mode</span>
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {appt.type === 'ONLINE' ? (
                          <>
                            <Video className="w-3.5 h-3.5 text-teal-600" /> Online Video Consultation
                          </>
                        ) : (
                          <>
                            <Building className="w-3.5 h-3.5 text-sky-600" /> In-Person at {appt.hospital?.name || 'Clinic'}
                          </>
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Consultation Fee</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{appt.fee || 500}</span>
                    </div>
                  </div>

                  {appt.reason && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs text-slate-700 dark:text-slate-300">
                      <strong>Reason for Visit:</strong> {appt.reason}
                    </div>
                  )}

                  {appt.consultationNote && (
                    <div className="p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 rounded-2xl text-xs space-y-1 text-teal-900 dark:text-teal-200">
                      <div className="font-bold flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-teal-600" /> Doctor&apos;s Consultation Summary
                      </div>
                      <div><strong>Diagnosis:</strong> {appt.consultationNote.diagnosis}</div>
                      <div><strong>Plan:</strong> {appt.consultationNote.plan}</div>
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
