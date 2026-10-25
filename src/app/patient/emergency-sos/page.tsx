'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { AlertTriangle, Phone, MapPin, HeartPulse, ShieldAlert, CheckCircle, UserCheck } from 'lucide-react'

export default function EmergencySOSPage() {
  const [sosTriggered, setSosTriggered] = useState(false)

  const handleSOSTrigger = () => {
    setSosTriggered(true)
    alert('🚨 EMERGENCY SOS TRIGGERED!\n\nYour primary emergency contacts have been notified with your last known location. Emergency services guidance is displayed below.')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 text-xs font-bold rounded-full">
              <AlertTriangle className="w-4 h-4" /> 24/7 Clinical Emergency SOS Response
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Emergency SOS Assistance</h1>
            <p className="text-xs text-slate-500">
              Trigger instant alert notifications to your configured emergency contacts and access local emergency services.
            </p>
          </div>

          {/* Prominent Emergency SOS Button */}
          <div className="p-8 bg-gradient-to-br from-red-600 to-rose-700 rounded-3xl shadow-2xl text-white text-center space-y-4 max-w-xl mx-auto">
            <button
              onClick={handleSOSTrigger}
              className={`w-36 h-36 mx-auto rounded-full bg-white text-red-600 font-extrabold text-xl shadow-2xl flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-all border-4 ${
                sosTriggered ? 'border-amber-400 animate-pulse' : 'border-red-200'
              }`}
            >
              <AlertTriangle className="w-10 h-10" />
              <span>{sosTriggered ? 'ACTIVE' : 'SOS'}</span>
            </button>
            <p className="text-xs text-red-100 font-medium">
              Tap the SOS button to alert Sunita Kumar (Spouse: +91 9100000001) and display nearest hospital route.
            </p>
          </div>

          {/* Emergency Service Numbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="p-3 bg-red-100 text-red-600 dark:bg-red-950 rounded-2xl w-fit mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">112</h3>
              <p className="text-xs font-semibold text-slate-500">National Emergency Number</p>
              <a href="tel:112" className="inline-block px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700">
                Call 112 Now
              </a>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="p-3 bg-red-100 text-red-600 dark:bg-red-950 rounded-2xl w-fit mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">102 / 108</h3>
              <p className="text-xs font-semibold text-slate-500">Ambulance Services</p>
              <a href="tel:102" className="inline-block px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700">
                Call Ambulance
              </a>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="p-3 bg-sky-100 text-sky-600 dark:bg-sky-950 rounded-2xl w-fit mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Nearest Hospital</h3>
              <p className="text-xs text-slate-500">Apollo Hospital (1.2 km away)</p>
              <button onClick={() => alert('Opening map navigation to Apollo Multi-Specialty Hospital...')} className="px-4 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700">
                Navigate Route
              </button>
            </div>
          </div>

          {/* Configured Emergency Contacts */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-sky-600" /> Configured Emergency Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Sunita Kumar (Spouse)</div>
                  <div className="text-slate-500">+91 9100000001 • Primary Contact</div>
                </div>
                <a href="tel:+919100000001" className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-xl">
                  Call
                </a>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Ram Kumar (Father)</div>
                  <div className="text-slate-500">+91 9100000003</div>
                </div>
                <a href="tel:+919100000003" className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-xl">
                  Call
                </a>
              </div>
            </div>
          </div>

          {/* Emergency First-Aid Guidance */}
          <div className="p-6 bg-slate-900 text-slate-300 rounded-3xl space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-red-500" /> Basic First-Aid Emergency Protocol
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>Chest Pain / Suspected Heart Attack:</strong> Have the person sit comfortably, remain calm, and loosen tight clothing. Call emergency services immediately.</li>
              <li><strong>Severe Bleeding:</strong> Apply firm, continuous pressure directly over the wound with a clean cloth.</li>
              <li><strong>Loss of Consciousness:</strong> Place in recovery position on their side and monitor breathing until ambulance arrives.</li>
            </ul>
          </div>
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
