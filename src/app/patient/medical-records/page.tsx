'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import {
  FileText,
  Plus,
  Filter,
  Download,
  Share2,
  Calendar,
  Lock,
  X,
  CheckCircle,
  FileCheck,
} from 'lucide-react'

interface MedicalRecord {
  id: string
  title: string
  description?: string
  documentType: string
  recordDate: string
  fileUrl?: string
  specialty?: string
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('ALL')
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Upload Form State
  const [title, setTitle] = useState('')
  const [docType, setDocType] = useState('BLOOD_TEST')
  const [description, setDescription] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/medical-records')
      const data = await res.json()
      if (Array.isArray(data)) setRecords(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    try {
      const res = await fetch('/api/medical-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          documentType: docType,
          description,
          specialty,
          fileUrl: '/demo-document.pdf',
        }),
      })

      if (res.ok) {
        setShowUploadModal(false)
        setTitle('')
        setDescription('')
        fetchRecords()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setUploading(false)
    }
  }

  const filteredRecords = filterType === 'ALL'
    ? records
    : records.filter((r) => r.documentType === filterType)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-sky-600" /> Digital Medical Records
              </h1>
              <p className="text-xs text-slate-500">Securely store and organize prescriptions, X-rays, and lab reports</p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:opacity-90 text-white font-semibold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Medical Document</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            {['ALL', 'PRESCRIPTION', 'BLOOD_TEST', 'XRAY', 'SCAN', 'DISCHARGE_SUMMARY'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  filterType === type
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Records Grid */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading medical records...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No medical records found</h3>
              <p className="text-xs text-slate-500">Click &quot;Upload Medical Document&quot; to add your health files.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="px-2.5 py-1 bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[10px] font-bold rounded-lg uppercase">
                        {record.documentType.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.recordDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{record.title}</h3>
                    {record.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400">{record.description}</p>
                    )}
                    {record.specialty && (
                      <p className="text-[11px] text-sky-600 font-medium">Specialty: {record.specialty}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Lock className="w-3 h-3 text-emerald-500" /> Private & Encrypted
                    </div>
                    <button
                      onClick={() => alert(`Downloading demo document for: ${record.title}`)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 rounded-xl font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 relative">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Medical Record</h3>
                  <p className="text-xs text-slate-500">Store your medical documents securely</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. ECG Scan Nov 2024 / Complete Blood Count"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                    >
                      <option value="PRESCRIPTION">Prescription</option>
                      <option value="BLOOD_TEST">Blood Test Report</option>
                      <option value="XRAY">X-Ray</option>
                      <option value="SCAN">MRI / CT Scan</option>
                      <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Specialty / Department</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g. Cardiology, Neurology"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description / Notes</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Additional notes about test results..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-md"
                  >
                    {uploading ? 'Saving Record...' : 'Save Medical Record'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
      <VitaGuideChat />
    </div>
  )
}
