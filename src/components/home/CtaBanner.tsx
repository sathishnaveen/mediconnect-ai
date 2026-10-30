import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck } from 'lucide-react'

export function CtaBanner() {
  return (
    <section className="section-y bg-white">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-sky-600 px-6 py-12 text-white shadow-glow sm:px-12 sm:py-16">
          <div
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-sky-300/20 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Ready when you are
              </p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
                Book your appointment in under a minute
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/80">
                Pick a doctor, choose an open slot and get an instant confirmation reference - no
                phone call needed.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/book"
                className="btn bg-white px-6 py-3.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Book appointment
              </Link>
              <Link
                to="/assistant"
                className="btn border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ask the AI first
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
