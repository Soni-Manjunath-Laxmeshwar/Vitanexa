import Link from 'next/link'
import { Activity, ShieldCheck, HeartPulse, PhoneCall } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-white mb-3">
            <div className="p-2 bg-gradient-to-tr from-sky-600 to-teal-500 text-white rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <span>Vita<span className="text-teal-400">Nexa</span></span>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Connecting Care. Improving Lives. An integrated digital healthcare platform connecting patients, doctors, hospitals, laboratories, and pharmacies.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> HIPAA & DPDP Compliant Data Protection
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/patient/dashboard" className="hover:text-sky-400 transition-colors">Patient Dashboard</Link></li>
            <li><Link href="/doctor/dashboard" className="hover:text-sky-400 transition-colors">Doctor Portal</Link></li>
            <li><Link href="/hospital/dashboard" className="hover:text-sky-400 transition-colors">Hospital Portal</Link></li>
            <li><Link href="/lab/dashboard" className="hover:text-sky-400 transition-colors">Lab Diagnostics</Link></li>
            <li><Link href="/pharmacy/dashboard" className="hover:text-sky-400 transition-colors">Pharmacy Section</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Core Modules</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/patient/doctors" className="hover:text-sky-400 transition-colors">Doctor Search & Booking</Link></li>
            <li><Link href="/patient/medical-records" className="hover:text-sky-400 transition-colors">Digital Medical Records</Link></li>
            <li><Link href="/patient/health-tracker" className="hover:text-sky-400 transition-colors">Health & Vitals Tracker</Link></li>
            <li><Link href="/patient/emergency-sos" className="hover:text-sky-400 transition-colors">Emergency SOS</Link></li>
            <li><Link href="/#ai-assistant" className="hover:text-sky-400 transition-colors">VitaGuide AI Assistant</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Medical Disclaimer</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            VitaNexa is a healthcare support and management platform. AI features (VitaGuide) provide general informational assistance only and must not replace qualified medical evaluation. In case of emergency, call 112/102 immediately.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
            © {new Date().getFullYear()} VitaNexa Health Technologies. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
