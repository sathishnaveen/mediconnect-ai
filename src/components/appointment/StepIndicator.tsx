import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

const steps = ['Choose doctor', 'Date & time', 'Your details', 'Confirmation']

interface StepIndicatorProps {
  current: number
}

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-4" aria-label="Booking progress">
      {steps.map((label, index) => {
        const isComplete = index < current
        const isCurrent = index === current

        return (
          <li
            key={label}
            aria-current={isCurrent ? 'step' : undefined}
            className="flex items-center gap-2"
          >
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition',
                isComplete && 'bg-brand-600 text-white',
                isCurrent && 'bg-brand-50 text-brand-700 ring-2 ring-brand-600',
                !isComplete && !isCurrent && 'bg-slate-100 text-slate-400',
              )}
            >
              {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>
            <span
              className={cn(
                'text-xs font-semibold sm:text-sm',
                isCurrent ? 'text-brand-700' : isComplete ? 'text-slate-700' : 'text-slate-400',
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 ? (
              <span className="mx-1 hidden h-px w-6 bg-slate-200 sm:block" aria-hidden="true" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
