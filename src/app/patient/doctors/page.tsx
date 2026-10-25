'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import {
  Search,
  Stethoscope,
  MapPin,
  Star,
  Clock,
  Video,
  Building,
  Calendar as CalendarIcon,
  CheckCircle,
  X,
  AlertCircle,
} from 'lucide-react'

interface Doctor {
  id: string
  user: { name: string; email: string; phone?: string; avatar?: string }
  qualifications?: string
  experience: number
  bio?: string
  consultationFee: number
  onlineConsultationFee: number
  isAvailableOnline: boolean
  languages?: string
  rating: number
  totalRatings: number
  hospital?: { id: string; name: string; city: string }
  specialties: { specialty: { name: string; icon?: string } }[]
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [onlineOnly, setOnlineOnly] = useState(false)

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  )
  const [bookingTime, setBookingTime] = useState('10:00')
  const [bookingType, setBookingType] = useState<'IN_PERSON' | 'ONLINE'>('IN_PERSON')
  const [bookingReason, setBookingReason] = useState('')
  const [bookingStatus, setBookingStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' })

  useEffect(() => {
    fetchSpecialties()
    fetchDoctors()
  }, [selectedSpecialty, onlineOnly])

  const fetchSpecialties = async () => {
    try {
      const res = await fetch('/api/specialties')
      const data = await res.json()
      if (Array.isArray(data)) setSpecialties(data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (selectedSpecialty) query.set('specialty', selectedSpecialty)
      if (onlineOnly) query.set('online', 'true')
      if (search) query.set('search', search)

      const res = await fetch(`/api/doctors?${query.toString()}`)
      const data = await res.json()
      setDoctors(data.doctors || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor) return

    setBookingStatus({ type: 'loading' })
    try {
      const fee = bookingType === 'ONLINE' ? selectedDoctor.onlineConsultationFee : selectedDoctor.consultationFee
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          hospitalId: selectedDoctor.hospital?.id,
          appointmentDate: bookingDate,
          startTime: bookingTime,
          endTime: calculateEndTime(bookingTime),
          type: bookingType,
          reason: bookingReason,
          fee,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setBookingStatus({ type: 'error', message: data.error || 'Failed to book slot' })
      } else {
        setBookingStatus({ type: 'success', message: 'Appointment booked successfully!' })
        setTimeout(() => {
          setSelectedDoctor(null)
          setBookingStatus({ type: 'idle' })
        }, 1500)
      }
    } catch (err) {
      setBookingStatus({ type: 'error', message: 'An unexpected error occurred.' })
    }
  }

  const calculateEndTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number)
    const endMinutes = m + 30
    const endHour = h + Math.floor(endMinutes / 60)
    const finalM = endMinutes % 60
    return `${String(endHour).padStart(2, '0')}:${String(finalM).padStart(2, '0')}`
  }

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-sky-600" /> Find a Specialist & Book Appointment
            </h1>
            <p className="text-xs text-slate-500">
              Search verified doctors by specialty, location, availability, and consultation mode.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
                placeholder="Search by doctor name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
              />
            </div>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
            >
              <option value="">All Specialties</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Online Consultation Only</span>
            </label>
          </div>

          {/* Doctor Cards Grid */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">No doctors found matching criteria.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                        {doc.user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{doc.user.name}</h3>
                        <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                          {doc.specialties[0]?.specialty.name || 'General Practitioner'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.qualifications}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-b border-slate-100 dark:border-slate-800 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.experience} Years Experience</span>
                      </div>
                      {doc.hospital && (
                        <div className="flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.hospital.name}, {doc.hospital.city}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{doc.rating} ({doc.totalRatings} ratings)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block">In-Person Fee</span>
                        <span className="font-bold text-slate-900 dark:text-white">₹{doc.consultationFee}</span>
                      </div>
                      {doc.isAvailableOnline && (
                        <div className="text-right">
                          <span className="text-slate-400 block">Online Fee</span>
                          <span className="font-bold text-teal-600">₹{doc.onlineConsultationFee}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDoctor(doc)
                      setBookingStatus({ type: 'idle' })
                    }}
                    className="mt-6 w-full py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:opacity-90 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Booking Modal */}
          {selectedDoctor && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 relative">
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book Consultation</h3>
                  <p className="text-xs text-slate-500">With {selectedDoctor.user.name}</p>
                </div>

                {bookingStatus.type === 'error' && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bookingStatus.message}</span>
                  </div>
                )}

                {bookingStatus.type === 'success' && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{bookingStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Consultation Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingType('IN_PERSON')}
                        className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                          bookingType === 'IN_PERSON' ? 'bg-sky-600 text-white border-sky-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        🏥 In-Person (₹{selectedDoctor.consultationFee})
                      </button>
                      <button
                        type="button"
                        disabled={!selectedDoctor.isAvailableOnline}
                        onClick={() => setBookingType('ONLINE')}
                        className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                          bookingType === 'ONLINE' ? 'bg-teal-600 text-white border-teal-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        🌐 Online Video (₹{selectedDoctor.onlineConsultationFee})
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Available Time Slots</label>
                    <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingTime(slot)}
                          className={`p-1.5 text-center font-medium rounded-lg border text-[11px] transition-all ${
                            bookingTime === slot
                              ? 'bg-sky-600 text-white border-sky-600'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason for Visit / Symptoms</label>
                    <textarea
                      rows={2}
                      value={bookingReason}
                      onChange={(e) => setBookingReason(e.target.value)}
                      placeholder="e.g. Routine checkup, chest tightness, headache..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingStatus.type === 'loading'}
                    className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-md"
                  >
                    {bookingStatus.type === 'loading' ? 'Confirming Booking...' : 'Confirm Appointment'}
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
