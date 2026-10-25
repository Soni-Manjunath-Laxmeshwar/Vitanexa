'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  User,
  FileText,
  FlaskConical,
  Pill,
  Activity,
  AlertCircle,
  Bell,
  Building,
  Users,
  Settings,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'

interface SidebarProps {
  role: string
  userName?: string
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()

  const getLinks = () => {
    switch (role) {
      case 'PATIENT':
        return [
          { href: '/patient/dashboard', label: 'Overview', icon: LayoutDashboard },
          { href: '/patient/doctors', label: 'Find Doctor', icon: Stethoscope },
          { href: '/patient/appointments', label: 'Appointments', icon: Calendar },
          { href: '/patient/medical-records', label: 'Medical Records', icon: FileText },
          { href: '/patient/prescriptions', label: 'Prescriptions', icon: Pill },
          { href: '/patient/lab-reports', label: 'Lab Reports', icon: FlaskConical },
          { href: '/patient/health-tracker', label: 'Health Tracker', icon: Activity },
          { href: '/patient/emergency-sos', label: 'Emergency SOS', icon: AlertCircle, badge: 'SOS' },
          { href: '/patient/notifications', label: 'Notifications', icon: Bell },
          { href: '/patient/profile', label: 'My Profile', icon: User },
        ]
      case 'DOCTOR':
        return [
          { href: '/doctor/dashboard', label: 'Overview', icon: LayoutDashboard },
          { href: '/doctor/appointments', label: 'Patient Schedule', icon: Calendar },
          { href: '/doctor/patients', label: 'My Patients', icon: Users },
          { href: '/doctor/prescriptions', label: 'Issue Prescription', icon: Pill },
          { href: '/doctor/profile', label: 'Doctor Profile', icon: User },
        ]
      case 'HOSPITAL_ADMIN':
        return [
          { href: '/hospital/dashboard', label: 'Hospital Overview', icon: Building },
          { href: '/hospital/doctors', label: 'Manage Doctors', icon: Stethoscope },
          { href: '/hospital/appointments', label: 'All Appointments', icon: Calendar },
        ]
      case 'LAB_ADMIN':
        return [
          { href: '/lab/dashboard', label: 'Lab Overview', icon: FlaskConical },
          { href: '/lab/reports', label: 'Manage Reports', icon: FileText },
        ]
      case 'PHARMACY_ADMIN':
        return [
          { href: '/pharmacy/dashboard', label: 'Pharmacy Overview', icon: Pill },
          { href: '/pharmacy/orders', label: 'Medication Orders', icon: FileText },
        ]
      case 'SYSTEM_ADMIN':
        return [
          { href: '/admin/dashboard', label: 'System Analytics', icon: LayoutDashboard },
          { href: '/admin/users', label: 'Manage Users', icon: Users },
          { href: '/admin/audit-logs', label: 'Audit Logs', icon: ShieldCheck },
        ]
      default:
        return []
    }
  }

  const links = getLinks()

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] border-r border-slate-800 p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        <div className="px-3 py-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Account Role</div>
          <div className="text-sm font-bold text-sky-400 mt-0.5">{role.replace('_', ' ')}</div>
          {userName && <div className="text-xs text-slate-300 truncate mt-1">{userName}</div>}
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
        Encrypted & Clinical Safe
      </div>
    </aside>
  )
}
