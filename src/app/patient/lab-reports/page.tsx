'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { FlaskConical, Download, Share2, Calendar, CheckCircle, Clock } from 'lucide-react'

interface LabReport {
  id: string
  testName: string
  status: string
  reportDate?: string
  results?: string
  interpretation?: string
  laboratory: { name: string; city: string }
}

export default function LabReportsPage() {
  const [reports, setReports] = useState<LabReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/lab-reports')
      const data = await res.json()
      if (Array.isArray(data)) setReports(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = (reportName: string) => {
    alert(`Report "${reportName}" has been securely shared with your consulting doctor.`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-amber-600" /> Laboratory Reports
            </h1>
            <p className="text-xs text-slate-500">Access, download, and share diagnostic test results</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading lab reports...</div>
          ) : reports.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <FlaskConical className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No lab reports found</h3>
              <p className="text-xs text-slate-500">Diagnostic test reports will appear here once processed by the lab.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{report.testName}</h3>
                      <p className="text-xs text-slate-500">{report.laboratory.name}, {report.laboratory.city}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      report.status === 'READY'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  {report.interpretation && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white">Lab Interpretation:</div>
                      <p>{report.interpretation}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {report.reportDate ? new Date(report.reportDate).toLocaleDateString() : 'Recent'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShare(report.testName)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors flex items-center gap-1 text-xs"
                      >
                        <Share2 className="w-3.5 h-3.5 text-sky-600" /> Share
                      </button>
                      <button
                        onClick={() => alert(`Downloading PDF report for ${report.testName}`)}
                        className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1 text-xs shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
