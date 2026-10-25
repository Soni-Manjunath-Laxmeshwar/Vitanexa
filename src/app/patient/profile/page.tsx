'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { User, Phone, MapPin, Heart, AlertCircle, Save, CheckCircle } from 'lucide-react'

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile/patient')
      const data = await res.json()
      setProfile(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess('')

    try {
      const res = await fetch('/api/profile/patient', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setSuccess('Profile updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />

        <main className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-6 h-6 text-sky-600" /> My Patient Profile
            </h1>
            <p className="text-xs text-slate-500">Manage your medical info, blood group, allergies, and emergency contacts</p>
          </div>

          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading profile...</div>
          ) : (
            <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile?.user?.name || ''}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profile?.user?.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                  <select
                    value={profile?.bloodGroup || 'O+'}
                    onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    value={profile?.gender || 'Male'}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Medical History & Allergies</h3>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Known Allergies</label>
                  <input
                    type="text"
                    value={profile?.allergies || ''}
                    onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Chronic Conditions</label>
                  <input
                    type="text"
                    value={profile?.chronicConditions || ''}
                    onChange={(e) => setProfile({ ...profile, chronicConditions: e.target.value })}
                    placeholder="e.g. Hypertension, Diabetes Type II, Asthma"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Primary Emergency Contact</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={profile?.emergencyName || ''}
                      onChange={(e) => setProfile({ ...profile, emergencyName: e.target.value })}
                      placeholder="e.g. Sunita Kumar"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={profile?.emergencyPhone || ''}
                      onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                      placeholder="+91 9100000001"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={profile?.emergencyRelation || ''}
                      onChange={(e) => setProfile({ ...profile, emergencyRelation: e.target.value })}
                      placeholder="e.g. Spouse / Parent"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          )}
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
