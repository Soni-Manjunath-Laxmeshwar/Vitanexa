'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { Pill, Plus, Trash2, CheckCircle, User } from 'lucide-react'

interface MedicineRow {
  medicineName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export default function DoctorPrescriptionGeneratorPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [medicines, setMedicines] = useState<MedicineRow[]>([
    { medicineName: 'Metoprolol 50mg', dosage: '50mg', frequency: 'Once daily after breakfast', duration: '30 days', instructions: 'Take with food' }
  ])
  const [issuing, setIssuing] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/appointments')
      const data = await res.json()
      if (data.appointments) {
        const unique = Array.from(new Set(data.appointments.map((a: any) => a.patient.id)))
          .map(id => data.appointments.find((a: any) => a.patient.id === id).patient)
        setPatients(unique)
        if (unique.length > 0) setSelectedPatientId(unique[0].id)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const addMedicineRow = () => {
    setMedicines([...medicines, { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }])
  }

  const removeMedicineRow = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const updateMedicineRow = (index: number, field: keyof MedicineRow, value: string) => {
    const updated = [...medicines]
    updated[index][field] = value
    setMedicines(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatientId) return
    setIssuing(true)
    setSuccess('')

    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatientId,
          diagnosis,
          notes,
          medicines,
        }),
      })

      if (res.ok) {
        setSuccess('Digital prescription issued and sent to patient!')
        setDiagnosis('')
        setNotes('')
        setMedicines([{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIssuing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="DOCTOR" />

        <main className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-6 h-6 text-teal-600" /> Issue Digital Prescription
            </h1>
            <p className="text-xs text-slate-500">Create electronic prescriptions with full dosage instructions</p>
          </div>

          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.user.name} ({p.user.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Diagnosis</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Hypertension, Migraine"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>
            </div>

            {/* Medicines List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Prescribed Medications</h3>
                <button
                  type="button"
                  onClick={addMedicineRow}
                  className="px-3 py-1.5 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 font-semibold rounded-xl text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Medicine
                </button>
              </div>

              {medicines.map((med, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Item #{idx + 1}</span>
                    {medicines.length > 1 && (
                      <button type="button" onClick={() => removeMedicineRow(idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        value={med.medicineName}
                        onChange={(e) => updateMedicineRow(idx, 'medicineName', e.target.value)}
                        placeholder="Medicine Name (e.g. Paracetamol 500mg)"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={med.dosage}
                        onChange={(e) => updateMedicineRow(idx, 'dosage', e.target.value)}
                        placeholder="Dosage (e.g. 500mg)"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={med.frequency}
                        onChange={(e) => updateMedicineRow(idx, 'frequency', e.target.value)}
                        placeholder="Frequency (e.g. Twice daily)"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => updateMedicineRow(idx, 'duration', e.target.value)}
                        placeholder="Duration (e.g. 7 days)"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Additional Advice / Diet Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Drink plenty of water, avoid spicy food"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={issuing}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold rounded-xl shadow-md"
            >
              {issuing ? 'Issuing Prescription...' : 'Issue Prescription'}
            </button>
          </form>
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
