'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Activity, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'PATIENT',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error && typeof data.error === 'object') {
          setError('Password must contain uppercase, lowercase, and numbers (min 8 chars).')
        } else {
          setError(data.error || 'Registration failed.')
        }
      } else {
        setSuccess('Registration successful! Redirecting to login...')
        setTimeout(() => router.push('/login'), 1500)
      }
    } catch (err) {
      setError('An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-slate-800/90 border border-slate-700/80 p-8 rounded-3xl shadow-2xl backdrop-blur">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-2">
            <div className="p-2 bg-gradient-to-tr from-sky-600 to-teal-500 text-white rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <span>Vita<span className="text-teal-400">Nexa</span></span>
          </Link>
          <h2 className="text-xl font-bold text-slate-100">Create VitaNexa Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join the integrated digital healthcare ecosystem</p>
        </div>

        {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs text-center">{error}</div>}
        {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'PATIENT' })}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  formData.role === 'PATIENT'
                    ? 'bg-sky-600 text-white border-sky-500 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                Patient Account
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'DOCTOR' })}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  formData.role === 'DOCTOR'
                    ? 'bg-teal-600 text-white border-teal-500 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                Doctor Account
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Doe / John Doe"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 8 chars (e.g. Vita@1234)"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:opacity-90 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Register'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-700/60">
          Already registered?{' '}
          <Link href="/login" className="text-sky-400 font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  )
}
