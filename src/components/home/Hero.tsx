import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, CheckCircle2, Clock, MessageSquare, Star } from 'lucide-react'
import { clinicStats } from '../../data/clinic'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="grid-pattern absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-16 top-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="animate-fade-up">
          <p className="eyebrow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-brand-500" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
            </span>
            AI-guided clinic experience
          </p>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
            Your health, connected by{' '}
            <span className="text-gradient">intelligent care</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Explore specialist doctors, get instant answers about our clinic from the AI assistant,
            and book an appointment in under a minute - no phone calls, no waiting on hold.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/book" className="btn-primary btn-lg group">
              <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              Book an appointment
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link to="/assistant" className="btn-secondary btn-lg">
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
              Ask the AI assistant
            </Link>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
            {clinicStats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-brand-200 pl-3">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-extrabold text-slate-900">
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium leading-snug text-slate-500">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-fade-up lg:pl-6" style={{ animationDelay: '120ms' }}>
          <div className="card relative z-10 overflow-hidden p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-500 text-white">
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Clinic AI Assistant</p>
                  <p className="text-xs text-slate-400">Answers clinic questions 24/7</p>
                </div>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                Demo
              </span>
            </div>

            <div className="space-y-3 pt-4">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm text-white">
                What time is the clinic open on Saturday?
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-sm text-slate-700">
                Saturday hours are 9:00 AM - 3:00 PM. Sunday we are closed - would you like me to
                find you a slot?
              </div>
              <div className="flex items-center gap-1.5 pl-1 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:300ms]" />
              </div>
            </div>
          </div>

          <div className="card absolute -left-2 -bottom-8 z-20 hidden w-56 animate-float p-4 sm:block">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-400">Next available</p>
                <p className="text-sm font-bold text-slate-900">Today, 09:30 AM</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                4.9 rating
              </span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                30 min slots
              </span>
            </div>
          </div>

          <div className="absolute -right-2 -top-6 z-20 hidden items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 shadow-card sm:inline-flex">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Booking confirmed instantly
          </div>
        </div>
      </div>
    </section>
  )
}
