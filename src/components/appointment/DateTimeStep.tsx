import { CalendarX2, CheckCircle2, RefreshCw } from 'lucide-react'
import { slotGroups } from '../../data/timeSlots'
import { formatDayChip, formatDateLong, getNextBookableDates, toDateKey, isToday } from '../../lib/date'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import type { Doctor } from '../../types'

interface DateTimeStepProps {
  doctor: Doctor
  date: string
  onDateChange: (dateKey: string) => void
  time: string
  onTimeChange: (time: string) => void
  bookedSlots: string[]
  loading: boolean
  error: string | null
  onRetry: () => void
  dateError?: string
  timeError?: string
}

export function DateTimeStep({
  doctor,
  date,
  onDateChange,
  time,
  onTimeChange,
  bookedSlots,
  loading,
  error,
  onRetry,
  dateError,
  timeError,
}: DateTimeStepProps) {
  const dates = getNextBookableDates(10)

  function isSlotDisabled(slot: string): boolean {
    if (bookedSlots.includes(slot)) return true
    if (!date) return true
    if (date === toDateKey(new Date()) && isPastForToday(slot)) return true
    return false
  }

  function isPastForToday(slot: string): boolean {
    const now = new Date()
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot)
    if (!match) return false
    let hour = Number(match[1])
    const minute = Number(match[2])
    if (match[3]?.toUpperCase() === 'PM' && hour !== 12) hour += 12
    if (match[3]?.toUpperCase() === 'AM' && hour === 12) hour = 0
    const slotDate = new Date()
    slotDate.setHours(hour, minute, 0, 0)
    return slotDate.getTime() <= now.getTime()
  }

  return (
    <div>
      <fieldset>
        <legend className="text-lg font-bold text-slate-900">
          Choose a date for {doctor.name}
        </legend>
        <p className="mt-1 text-sm text-slate-500">
          The clinic is closed on Sundays, so only open days are listed. Booking for{' '}
          {doctor.availableDays.join(', ')} is recommended.
        </p>
        {dateError ? (
          <p role="alert" className="field-error mt-3">
            {dateError}
          </p>
        ) : null}

        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-2" role="group" aria-label="Available dates">
          {dates.map((dateObj) => {
            const key = toDateKey(dateObj)
            const selected = key === date
            const chip = formatDayChip(dateObj)
            const today = isToday(dateObj)
            const inDoctorSchedule = doctor.availableDays.includes(chip.weekday)

            return (
              <button
                key={key}
                type="button"
                onClick={() => onDateChange(key)}
                aria-pressed={selected}
                aria-label={formatDateLong(dateObj)}
                className={cn(
                  'min-w-[4.5rem] shrink-0 rounded-2xl border px-3 py-3 text-center transition duration-200',
                  selected
                    ? 'border-brand-600 bg-brand-600 text-white shadow-[0_14px_30px_-16px_rgba(37,99,235,1)]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50',
                )}
              >
                <span className="block text-[11px] font-semibold uppercase tracking-wide opacity-80">
                  {chip.weekday}
                </span>
                <span className="block font-display text-xl font-extrabold">{chip.day}</span>
                <span className="block text-[11px] font-medium opacity-80">{chip.month}</span>
                <span
                  className={cn(
                    'mt-1 block text-[10px] font-semibold',
                    selected ? 'text-white/80' : inDoctorSchedule ? 'text-emerald-600' : 'text-slate-400',
                  )}
                >
                  {today ? 'Today' : inDoctorSchedule ? 'In clinic' : 'Open day'}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-lg font-bold text-slate-900">Choose a time slot</legend>
        <p className="mt-1 text-sm text-slate-500">
          Slots are 30 minutes. Times already booked are disabled.
        </p>
        {timeError ? (
          <p role="alert" className="field-error mt-3">
            {timeError}
          </p>
        ) : null}

        {error ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <Button variant="secondary" onClick={onRetry} className="!py-2 text-xs">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Retry
            </Button>
          </div>
        ) : null}

        {!date ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            <CalendarX2 className="h-4 w-4" aria-hidden="true" />
            Select a date to see available slots.
          </p>
        ) : loading ? (
          <div className="mt-4 space-y-4" role="status" aria-label="Loading available time slots">
            <span className="sr-only">Loading available time slots...</span>
            {[0, 1].map((group) => (
              <div key={group}>
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-10 animate-pulse rounded-xl bg-slate-200" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {slotGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {group.label}
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                  {group.slots.map((slot) => {
                    const disabled = isSlotDisabled(slot)
                    const selected = slot === time
                    const isBooked = bookedSlots.includes(slot)

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={disabled}
                        onClick={() => onTimeChange(slot)}
                        aria-pressed={selected}
                        aria-label={`${slot}${isBooked ? ' (already booked)' : ''}`}
                        className={cn(
                          'rounded-xl border px-2 py-2.5 text-xs font-semibold transition duration-200 sm:text-sm',
                          selected &&
                            'border-brand-600 bg-brand-600 text-white shadow-[0_12px_26px_-16px_rgba(37,99,235,1)]',
                          !selected && !disabled &&
                            'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
                          !selected && disabled &&
                            'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through',
                        )}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {bookedSlots.length === 0 && !loading ? (
              <p className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                All slots look free on this date.
              </p>
            ) : null}
          </div>
        )}
      </fieldset>
    </div>
  )
}
