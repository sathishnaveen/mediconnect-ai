import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import type { Doctor } from '../../types'

interface DoctorSelectStepProps {
  doctors: Doctor[]
  value: string
  onChange: (doctorId: string) => void
  error?: string
}

export function DoctorSelectStep({ doctors, value, onChange, error }: DoctorSelectStepProps) {
  return (
    <fieldset>
      <legend className="text-lg font-bold text-slate-900">Select a doctor</legend>
      <p className="mt-1 text-sm text-slate-500">
        Choose the specialist you would like to see. Every profile is demo content.
      </p>

      {error ? (
        <p role="alert" className="field-error mt-3">
          {error}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {doctors.map((doctor) => {
          const isSelected = value === doctor.id

          return (
            <label key={doctor.id} className="block cursor-pointer">
              <input
                type="radio"
                name="doctor"
                value={doctor.id}
                checked={isSelected}
                onChange={() => onChange(doctor.id)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  'h-full rounded-2xl border bg-white p-4 transition duration-200',
                  'hover:border-brand-300 hover:shadow-card',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-600 peer-focus-visible:ring-offset-2',
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 shadow-glow'
                    : 'border-slate-200',
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={doctor.name} specialty={doctor.specialty} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{doctor.name}</p>
                        <p className="truncate text-xs font-medium text-brand-700">
                          {doctor.specialty}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-slate-900">
                        ${doctor.fee}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                      <Badge tone="neutral">{doctor.experienceYears} yrs</Badge>
                      <Badge tone="neutral">{doctor.availableDays.join(' · ')}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
