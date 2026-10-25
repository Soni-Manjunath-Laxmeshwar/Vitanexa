import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { auth } from '@/auth'
import {
  Stethoscope,
  Calendar,
  FileText,
  ShieldCheck,
  Bot,
  AlertCircle,
  FlaskConical,
  Pill,
  Building,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Search,
  Activity,
} from 'lucide-react'

export default async function LandingPage() {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={session?.user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-900 via-slate-900 to-slate-900 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Next-Generation Healthcare Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Healthcare, Connected <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Around You.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            VitaNexa brings patients, doctors, hospitals, laboratories, and pharmacies together in one secure digital healthcare ecosystem.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/patient/doctors"
              className="px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/25 hover:opacity-95 transition-all flex items-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Find a Doctor</span>
            </Link>
            <Link
              href="/patient/doctors"
              className="px-6 py-3.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur transition-all flex items-center gap-2 text-sm"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Book an Appointment</span>
            </Link>
            <Link
              href="#features"
              className="px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2 text-sm"
            >
              <span>Explore VitaNexa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-slate-800 text-left">
            <div>
              <div className="text-3xl font-bold text-sky-400">100%</div>
              <div className="text-xs text-slate-400 mt-1">Digital Records Privacy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-400">24/7</div>
              <div className="text-xs text-slate-400 mt-1">Emergency SOS Guidance</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">VitaGuide</div>
              <div className="text-xs text-slate-400 mt-1">Smart AI Health Assistant</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">Integrated</div>
              <div className="text-xs text-slate-400 mt-1">Ecosystem for 6 Roles</div>
            </div>
          </div>
        </div>
      </section>

      {/* How VitaNexa Works */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              How VitaNexa Works
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
              Seamless end-to-end care coordination connecting all healthcare stakeholders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Search & Book Care</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Filter verified specialists by location, fee, availability, and consultation type (online or in-person).
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Digital Consultation & Records</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Consult with your clinician, receive digital prescriptions, and store lab reports securely in one location.
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Continuous Health Monitoring</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Track blood pressure, heart rate, and glucose trends while receiving medication reminders and AI support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Patient & Doctor Features Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Patient Features */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-2xl">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Patient Experience</h3>
                  <p className="text-xs text-slate-500">Comprehensive personal healthcare management</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <span>Real-time appointment scheduling with instant confirmation and reminders</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <span>Centralized digital medical records (prescriptions, X-rays, blood tests)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <span>Interactive health & vitals tracking with trend charts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <span>One-click Emergency SOS with local emergency guidance and contacts</span>
                </li>
              </ul>
            </div>

            {/* Doctor Features */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-2xl">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Doctor Portal</h3>
                  <p className="text-xs text-slate-500">Clinical workflow optimization</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span>Custom availability slots for in-person and online video consultations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span>Digital consultation note writer with diagnostic and follow-up tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span>Electronic prescription generator connected to pharmacy module</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span>Secure patient medical history review with authorization controls</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section id="ai-assistant" className="py-20 bg-gradient-to-r from-sky-900 via-slate-900 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-4">
              <Bot className="w-4 h-4" />
              <span>Smart AI Assistant</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Meet VitaGuide AI
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              VitaGuide helps you prepare for doctor appointments, understand complex medical terminology, organize questions, and navigate healthcare services.
            </p>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-200">
              ⚠️ <strong>Safety Commitment</strong>: VitaGuide is an informational assistant. It does not independently diagnose diseases or prescribe treatment.
            </div>
          </div>
          <div className="w-full max-w-md p-6 bg-slate-900/80 border border-slate-700/50 rounded-3xl shadow-2xl space-y-3 text-xs">
            <div className="flex items-center gap-2 text-sky-400 font-semibold mb-2">
              <Sparkles className="w-4 h-4" /> Sample VitaGuide Conversation
            </div>
            <div className="p-3 bg-slate-800 rounded-xl text-slate-300">
              <strong>Patient:</strong> &quot;What is CBC test?&quot;
            </div>
            <div className="p-3 bg-sky-950 border border-sky-800/50 rounded-xl text-sky-200">
              <strong>VitaGuide:</strong> &quot;A Complete Blood Count (CBC) measures red blood cells, white blood cells, and hemoglobin to evaluate overall health.&quot;
            </div>
          </div>
        </div>
      </section>

      {/* Emergency & Security */}
      <section id="security" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-8 bg-red-50 dark:bg-red-950/30 rounded-3xl border border-red-100 dark:border-red-900/50">
            <div className="p-3 bg-red-600 text-white rounded-2xl w-fit mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Emergency SOS Module</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Quick access to configured emergency contacts, emergency service guidance (112/102), and nearest health facility mapping.
            </p>
            <Link href="/patient/emergency-sos" className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
              <span>View Emergency SOS Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-8 bg-teal-50 dark:bg-teal-950/30 rounded-3xl border border-teal-100 dark:border-teal-900/50">
            <div className="p-3 bg-teal-600 text-white rounded-2xl w-fit mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Privacy & Security Built-in</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Role-based access control, encrypted sessions, strict input validation, and audit logging to protect sensitive medical data.
            </p>
            <div className="text-xs text-teal-700 dark:text-teal-300 font-medium">
              ✓ Compliant with healthcare privacy standards
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-medium">
              <summary className="cursor-pointer text-slate-900 dark:text-white font-semibold">How do I book an appointment with a doctor?</summary>
              <p className="mt-3 text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                Log in as a patient, navigate to Doctor Search, filter by specialty or city, select an available time slot, and confirm your booking.
              </p>
            </details>

            <details className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-medium">
              <summary className="cursor-pointer text-slate-900 dark:text-white font-semibold">Can VitaGuide AI prescribe medicines?</summary>
              <p className="mt-3 text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                No. VitaGuide is strictly an informational assistant. Prescriptions can only be issued by licensed doctors during formal consultations.
              </p>
            </details>

            <details className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-medium">
              <summary className="cursor-pointer text-slate-900 dark:text-white font-semibold">Who can view my uploaded medical records?</summary>
              <p className="mt-3 text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                Only you and clinicians explicitly authorized during a consultation have permission to view your private medical records.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
