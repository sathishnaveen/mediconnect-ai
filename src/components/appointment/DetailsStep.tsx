import { Lock, ShieldCheck } from 'lucide-react'
import { TextInput } from '../ui/TextInput'
import { Alert } from '../ui/Alert'
import { Badge } from '../ui/Badge'
import type { FormErrors } from '../../lib/validation'
import type { Doctor } from '../../types'

interface DetailsStepProps {
  doctor: Doctor
  dateLabel: string
  time: string
  patientName: string
  patientEmail: string
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  errors: FormErrors<{ patientName: string; patientEmail: string }>
  submitting: boolean
  submitError: string | null
  onSubmit: () => void
}

export function DetailsStep({
  doctor,
  dateLabel,
  time,
  patientName,
  patientEmail,
  onNameChange,
  onEmailChange,
  errors,
  submitting,
  submitError,
  onSubmit,
}: DetailsStepProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Your details</h2>
        <p className="mt-1 text-sm text-slate-500">
          We only need a name and an email for the confirmation - never medical information.
        </p>

        <div className="mt-5 space-y-4">
          <TextInput
            id="patient-name"
            label="Full name"
            value={patientName}
            onChange={onNameChange}
            placeholder="e.g. Sam Carter"
            autoComplete="name"
            required
            disabled={submitting}
            error={errors.patientName}
          />
          <TextInput
            id="patient-email"
            label="Email address"
            type="email"
            value={patientEmail}
            onChange={onEmailChange}
            placeholder="e.g. sam@example.com"
            autoComplete="email"
            required
            disabled={submitting}
            error={errors.patientEmail}
            hint="Your confirmation reference appears on screen instantly."
          />
        </div>

        <p className="mt-4 inline-flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
          This demo stores only your name, email and chosen slot. Do not enter real medical history
          or insurance details.
        </p>

        {submitError ? (
          <div className="mt-4">
            <Alert tone="danger" title="Could not confirm the appointment" role="alert">
              {submitError}
            </Alert>
          </div>
        ) : null}
      </div>

      <aside className="card h-fit p-5" aria-label="Appointment summary">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Summary</h3>
          <Badge tone="info">Step 4 of 4</Badge>
        </div>

        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Doctor</dt>
            <dd className="font-semibold text-slate-800">{doctor.name}</dd>
            <dd className="text-xs text-brand-700">{doctor.title}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Date &amp; time</dt>
            <dd className="font-semibold text-slate-800">{dateLabel}</dd>
            <dd className="text-xs text-slate-500">{time} (30 min)</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Location</dt>
            <dd className="font-semibold text-slate-800">{doctor.location}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <dt className="text-sm font-medium text-slate-500">Consultation fee</dt>
            <dd className="font-display text-lg font-extrabold text-slate-900">${doctor.fee}</dd>
          </div>
        </dl>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Confirming your appointment...' : 'Confirm appointment'}
        </button>

        <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
          No payment is taken in this demo.
        </p>
      </aside>
    </form>
  )
}
