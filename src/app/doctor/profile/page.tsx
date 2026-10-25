'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { Stethoscope, Save, CheckCircle } from 'lucide-react'

export default function DoctorProfilePage() {
  const [fee, setFee] = useState('1500')
  const [onlineFee, setOnlineFee] = useState('800')
  const [qualifications, setQualifications] = useState('MBBS, MD (Cardiology), DM')
  const [bio, setBio] = useState('Interventional cardiologist with 15 years experience.')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="DOCTOR" />

        <main className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-teal-600" /> Doctor Profile & Availability Settings
            </h1>
            <p className="text-xs text-slate-500">Manage your clinical qualifications, bio, and consultation fees</p>
          </div>

          {saved && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Doctor profile saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">In-Person Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Online Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={onlineFee}
                  onChange={(e) => setOnlineFee(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Qualifications & Degrees</label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile & Availability</span>
            </button>
          </form>
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
