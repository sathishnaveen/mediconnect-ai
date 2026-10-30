import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'

const capabilities = [
  { icon: Bot, text: 'Answers general healthcare FAQs and clinic questions instantly' },
  { icon: Clock3, text: 'Explains opening hours, locations, fees and telemedicine options' },
  { icon: CalendarCheck, text: 'Walks you through every step of booking an appointment' },
  { icon: CheckCircle2, text: 'Clearly labels live AI vs demo answers - no pretending' },
]

export function AIAssistantSection() {
  return (
    <section className="section-y relative overflow-hidden bg-white">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="card overflow-hidden border-brand-100">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-brand-600 to-sky-600 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold">MediConnect Assistant</p>
                  <p className="text-xs text-white/70">Always online - never a substitute for a doctor</p>
                </div>
              </div>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold">
                Demo
              </span>
            </div>

            <div className="space-y-3 p-5">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm text-white">
                How do I book an appointment?
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-sm leading-relaxed text-slate-700">
                Open the Book Appointment page, choose a doctor, pick an open date and time slot,
                enter your name and email, then confirm. You will get a reference number on the
                confirmation screen.
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-sm leading-relaxed text-slate-700">
                I cannot diagnose conditions or prescribe medicine - for personal medical advice,
                please book a doctor.
              </div>
            </div>

            <div className="border-t border-slate-100 bg-amber-50 px-5 py-3 text-xs font-medium text-amber-800">
              Medical disclaimer: general information only. Emergencies: call 911.
            </div>
          </div>
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="AI healthcare assistant"
            title={
              <>
                Answers at 2 AM,{' '}
                <span className="text-gradient">without the hold music</span>
              </>
            }
            description="The assistant is wired into our clinic knowledge base, so it knows our services, specialties and booking flow."
          />

          <ul className="mt-8 space-y-4">
            {capabilities.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-slate-600">{item.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>
              <span className="font-semibold">Safety first:</span> the assistant never diagnoses
              diseases, never prescribes medication and always advises contacting emergency services
              when symptoms sound urgent.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/assistant" className="btn-primary group">
              Start a conversation
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link to="/doctors" className="btn-secondary">
              Browse doctors
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
