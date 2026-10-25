'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Mail, ArrowRight, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-slate-800/90 border border-slate-700/80 p-8 rounded-3xl shadow-2xl backdrop-blur text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-2">
          <div className="p-2 bg-gradient-to-tr from-sky-600 to-teal-500 text-white rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <span>Vita<span className="text-teal-400">Nexa</span></span>
        </Link>
        <h2 className="text-xl font-bold text-slate-100">Reset Password</h2>
        <p className="text-xs text-slate-400">Enter your email address to receive password reset instructions</p>

        {sent ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs space-y-2">
            <CheckCircle className="w-6 h-6 mx-auto text-emerald-400" />
            <p className="font-semibold">Reset instructions sent!</p>
            <p className="text-slate-300">If an account exists for {email}, you will receive an email shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (email) setSent(true)
            }}
            className="space-y-4 text-left"
          >
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

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-semibold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Send Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-700/60 text-xs">
          <Link href="/login" className="text-sky-400 hover:underline font-semibold">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
