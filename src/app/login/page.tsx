'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid email or password.')
      } else {
        router.refresh()
        router.push('/')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-slate-800/90 border border-slate-700/80 p-8 rounded-3xl shadow-2xl backdrop-blur">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-2">
            <div className="p-2 bg-gradient-to-tr from-sky-600 to-teal-500 text-white rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <span>Vita<span className="text-teal-400">Nexa</span></span>
          </Link>
          <h2 className="text-xl font-bold text-slate-100 mt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to access your digital healthcare portal</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Demo Quick-Fill Buttons */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60 space-y-2">
          <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Quick Demo Login Fill
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => fillDemoCredentials('patient@vitanexa.com', 'Patient@1234')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-left transition-colors truncate"
            >
              👤 Patient
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('dr.sharma@vitanexa.com', 'Doctor@1234')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-left transition-colors truncate"
            >
              🩺 Doctor
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('hospital@vitanexa.com', 'Hospital@1234')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-left transition-colors truncate"
            >
              🏥 Hospital
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('lab@vitanexa.com', 'Lab@1234')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-left transition-colors truncate"
            >
              🧪 Lab Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('pharmacy@vitanexa.com', 'Pharmacy@1234')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-left transition-colors truncate"
            >
              💊 Pharmacy
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin@vitanexa.com', 'Admin@1234')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-left transition-colors truncate"
            >
              ⚙️ Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-xs text-sky-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:opacity-90 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-700/60">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-sky-400 font-semibold hover:underline">
            Create Patient / Doctor Account
          </Link>
        </div>
      </div>
    </div>
  )
}
