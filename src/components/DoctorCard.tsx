import { Link } from 'react-router-dom'
import { Activity, Star } from 'lucide-react'
import { Avatar } from './ui/Avatar'
import { Badge } from './ui/Badge'
import { cn } from '../lib/utils'
import type { Doctor } from '../types'

interface DoctorCardProps {
  doctor: Doctor
  showDemoBadge?: boolean
}

export function DoctorCard({ doctor, showDemoBadge = true }: DoctorCardProps) {
  return (
    <article className="card card-hover flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar name={doctor.name} specialty={doctor.specialty} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-bold">{doctor.name}</h3>
            {showDemoBadge ? <Badge tone="demo">Demo profile</Badge> : null}
          </div>
          <p className="truncate text-sm font-medium text-brand-700">{doctor.title}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1 font-medium text-amber-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              {doctor.rating.toFixed(1)}
              <span className="font-normal text-slate-400">({doctor.reviews} reviews)</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Activity className="h-4 w-4 text-brand-500" aria-hidden="true" />
              {doctor.experienceYears} yrs experience
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">{doctor.bio}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Specialty</dt>
          <dd className="font-semibold text-slate-700">{doctor.specialty}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Fee</dt>
          <dd className="font-semibold text-slate-700">${doctor.fee}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Languages</dt>
          <dd className="font-semibold text-slate-700">{doctor.languages.join(', ')}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Location</dt>
          <dd className="truncate font-semibold text-slate-700">{doctor.location}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Available
        </span>
        {doctor.availableDays.map((day) => (
          <span
            key={day}
            className={cn(
              'rounded-md border border-brand-100 bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700',
            )}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
        <Link
          to={`/book?doctor=${doctor.id}`}
          className="btn-primary flex-1"
          aria-label={`Book an appointment with ${doctor.name}`}
        >
          Book appointment
        </Link>
        <Link
          to={`/assistant?q=${encodeURIComponent(`How do I book an appointment with ${doctor.name}?`)}`}
          className="btn-secondary flex-1"
          aria-label={`Ask the AI assistant about booking ${doctor.name}`}
        >
          Ask AI assistant
        </Link>
      </div>
    </article>
  )
}

export function DoctorCardSkeleton() {
  return (
    <div className="card animate-pulse p-6" aria-hidden="true">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 rounded-2xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-4 w-56 rounded bg-slate-200" />
          <div className="h-4 w-32 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-4/5 rounded bg-slate-200" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="h-12 rounded-xl bg-slate-200" />
        <div className="h-12 rounded-xl bg-slate-200" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-10 flex-1 rounded-xl bg-slate-200" />
        <div className="h-10 flex-1 rounded-xl bg-slate-200" />
      </div>
    </div>
  )
}
