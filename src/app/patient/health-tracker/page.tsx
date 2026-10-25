'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { Activity, Plus, Heart, Scale, Thermometer, AlertCircle } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface HealthMetric {
  id: string
  type: string
  value: string
  unit?: string
  measuredAt: string
}

export default function HealthTrackerPage() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [metricType, setMetricType] = useState('BLOOD_PRESSURE')
  const [val, setVal] = useState('')
  const [unit, setUnit] = useState('mmHg')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/health-metrics')
      const data = await res.json()
      if (Array.isArray(data)) setMetrics(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMetric = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!val) return
    setSaving(true)

    try {
      const res = await fetch('/api/health-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: metricType,
          value: val,
          unit: getUnitForType(metricType),
        }),
      })

      if (res.ok) {
        setVal('')
        fetchMetrics()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const getUnitForType = (t: string) => {
    switch (t) {
      case 'BLOOD_PRESSURE': return 'mmHg'
      case 'HEART_RATE': return 'bpm'
      case 'WEIGHT': return 'kg'
      case 'BLOOD_GLUCOSE': return 'mg/dL'
      case 'TEMPERATURE': return '°F'
      default: return ''
    }
  }

  const bpData = metrics
    .filter((m) => m.type === 'BLOOD_PRESSURE')
    .map((m) => {
      const [sys] = m.value.split('/').map(Number)
      return {
        date: new Date(m.measuredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        Systolic: sys || 120,
      }
    })
    .reverse()

  const hrData = metrics
    .filter((m) => m.type === 'HEART_RATE')
    .map((m) => ({
      date: new Date(m.measuredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      'Heart Rate': Number(m.value) || 72,
    }))
    .reverse()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-teal-600" /> Health & Vitals Tracker
            </h1>
            <p className="text-xs text-slate-500">Monitor blood pressure, heart rate, weight, and blood glucose trends</p>
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <span>
              <strong>Medical Disclaimer:</strong> Tracking data is for personal record-keeping only and does not replace professional medical evaluation or emergency clinical care.
            </span>
          </div>

          {/* Log New Vitals Form */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600" /> Log New Health Reading
            </h2>

            <form onSubmit={handleAddMetric} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Metric Type</label>
                <select
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                >
                  <option value="BLOOD_PRESSURE">Blood Pressure (mmHg)</option>
                  <option value="HEART_RATE">Heart Rate (bpm)</option>
                  <option value="WEIGHT">Weight (kg)</option>
                  <option value="BLOOD_GLUCOSE">Blood Glucose (mg/dL)</option>
                  <option value="TEMPERATURE">Body Temperature (°F)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Measured Value</label>
                <input
                  type="text"
                  required
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  placeholder={metricType === 'BLOOD_PRESSURE' ? '120/80' : '72'}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                <input
                  type="text"
                  disabled
                  value={getUnitForType(metricType)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl cursor-not-allowed"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold rounded-xl transition-all shadow-sm"
                >
                  {saving ? 'Logging...' : 'Log Reading'}
                </button>
              </div>
            </form>
          </div>

          {/* Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blood Pressure Trend */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" /> Blood Pressure Trend (Systolic)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bpData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={10} />
                    <YAxis stroke="#888888" fontSize={10} domain={[80, 160]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Systolic" stroke="#0284c7" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Heart Rate Trend */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" /> Heart Rate Trend (bpm)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hrData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={10} />
                    <YAxis stroke="#888888" fontSize={10} domain={[50, 120]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Heart Rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
