'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VitaGuideChat } from '@/components/vitaguide-chat'
import { Bell, CheckCircle, Calendar, Pill, FlaskConical, Info } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      if (Array.isArray(data)) setNotifications(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH', body: JSON.stringify({}) })
      fetchNotifications()
    } catch (e) {
      console.error(e)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'APPOINTMENT': return <Calendar className="w-5 h-5 text-sky-600" />
      case 'PRESCRIPTION': return <Pill className="w-5 h-5 text-teal-600" />
      case 'LAB_REPORT': return <FlaskConical className="w-5 h-5 text-amber-600" />
      default: return <Info className="w-5 h-5 text-purple-600" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-6 h-6 text-sky-600" /> Notifications & Alerts
              </h1>
              <p className="text-xs text-slate-500">Appointment confirmations, prescription updates, and health reminders</p>
            </div>

            <button
              onClick={markAllRead}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Mark All as Read
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Bell className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No new notifications</h3>
              <p className="text-xs text-slate-500">You are all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    notif.isRead
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 shadow-sm'
                  }`}
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{notif.title}</h4>
                      <span className="text-[11px] text-slate-400">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{notif.message}</p>
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
