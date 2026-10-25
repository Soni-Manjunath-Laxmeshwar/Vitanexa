import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 text-center text-white">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-4">
        <div className="p-3 bg-red-500/20 text-red-400 rounded-full w-fit mx-auto">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          You do not have permission to view this section of VitaNexa. Please make sure you are logged in with the correct role account.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Sign In</span>
        </Link>
      </div>
    </div>
  )
}
