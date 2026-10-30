import { Link } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Download, Home, Mail, MapPin, RotateCcw, User } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { downloadIcs } from '../../lib/calendar'
import { clinicInfo } from '../../lib/knowledge'
import { parseDateKey, formatDateLong } from '../../lib/date'
import type { Appointment, StorageMode } from '../../types'

interface ConfirmationViewProps {
  appointment: Appointment
  mode: StorageMode
  onBookAnother: () => void
}

export function ConfirmationView({ appointment, mode, onBookAnother }: ConfirmationViewProps) {
  const dateLabel = formatDateLong(parseDateKey(appointment.date))

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white shadow-card">
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden="true" />
          </span>

          <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">Appointment confirmed!</h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
            Thanks, {appointment.patientName}. Your slot with {appointment.doctorName} is reserved.
            A real clinic would email the confirmation to{' '}
            <span className="font-semibold text-slate-800">{appointment.patientEmail}</span>.
          </p>

          <div className="mt-5 rounded-2xl border border-dashed border-emerald-300 bg-white px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Confirmation reference
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold tracking-wide text-brand-700">
              {appointment.reference}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Badge tone={mode === 'supabase' ? 'info' : 'demo'}>
              {mode === 'supabase' ? 'Saved in Supabase' : 'Saved in this browser (demo)'}
            </Badge>
            <Badge tone="success">Status: {appointment.status}</Badge>
          </div>
        </div>

        <dl className="grid gap-4 border-t border-emerald-100 bg-white/70 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Doctor</dt>
              <dd className="text-sm font-semibold text-slate-800">{appointment.doctorName}</dd>
              <dd className="text-xs text-brand-700">{appointment.specialty}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Date</dt>
              <dd className="text-sm font-semibold text-slate-800">{dateLabel}</dd>
              <dd className="text-xs text-slate-500">{appointment.time}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Patient</dt>
              <dd className="text-sm font-semibold text-slate-800">{appointment.patientName}</dd>
              <dd className="truncate text-xs text-slate-500">{appointment.patientEmail}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Location</dt>
              <dd className="text-sm font-semibold text-slate-800">{clinicInfo.address}</dd>
              <dd className="text-xs text-slate-500">{clinicInfo.phone}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => downloadIcs(appointment, clinicInfo.address)}
          className="btn-primary"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Add to calendar (.ics)
        </button>
        <button type="button" onClick={onBookAnother} className="btn-secondary">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Book another appointment
        </button>
        <Link to="/" className="btn-secondary">
          <Home className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>

      {mode === 'demo' ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
          <span className="font-semibold">Demo mode:</span> this booking is stored only in your
          browser (localStorage). It is not sent to any server and disappears if you clear site
          data. Connect a free Supabase project and run <code>supabase/schema.sql</code> to store
          bookings in a real database.
        </p>
      ) : (
        <p className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-xs leading-relaxed text-brand-800">
          <span className="font-semibold">Supabase mode:</span> the booking row was inserted into
          your <code>appointments</code> table with RLS policies enabled.
        </p>
      )}
    </div>
  )
}
