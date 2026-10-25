'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Activity, User, LogOut, Bell, Shield, Stethoscope, Building, FlaskConical, Pill } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  user?: {
    name?: string | null
    email?: string | null
    role?: string
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const isDashboard = pathname?.includes('/dashboard') || pathname?.includes('/patient') || pathname?.includes('/doctor') || pathname?.includes('/admin') || pathname?.includes('/hospital') || pathname?.includes('/lab') || pathname?.includes('/pharmacy')

  const getDashboardLink = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'PATIENT': return '/patient/dashboard'
      case 'DOCTOR': return '/doctor/dashboard'
      case 'HOSPITAL_ADMIN': return '/hospital/dashboard'
      case 'LAB_ADMIN': return '/lab/dashboard'
      case 'PHARMACY_ADMIN': return '/pharmacy/dashboard'
      case 'SYSTEM_ADMIN': return '/admin/dashboard'
      default: return '/'
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-sky-700 dark:text-sky-400">
          <div className="p-2 bg-gradient-to-tr from-sky-600 to-teal-500 text-white rounded-xl shadow-md shadow-sky-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <span>Vita<span className="text-teal-600 dark:text-teal-400">Nexa</span></span>
        </Link>

        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/#features" className="hover:text-sky-600 transition-colors">Features</Link>
            <Link href="/#doctors" className="hover:text-sky-600 transition-colors">Doctors</Link>
            <Link href="/#records" className="hover:text-sky-600 transition-colors">Records</Link>
            <Link href="/#ai-assistant" className="hover:text-sky-600 transition-colors">VitaGuide AI</Link>
            <Link href="/#security" className="hover:text-sky-600 transition-colors">Security</Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardLink()}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-teal-600 rounded-lg shadow hover:opacity-90 transition-opacity"
              >
                Dashboard
              </Link>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm shadow-sky-600/30 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
