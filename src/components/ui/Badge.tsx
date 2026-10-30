import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Tone = 'demo' | 'live' | 'info' | 'success' | 'warning' | 'neutral'

interface BadgeProps {
  tone?: Tone
  children: ReactNode
  className?: string
}

const toneClasses: Record<Tone, string> = {
  demo: 'border-amber-200 bg-amber-50 text-amber-700',
  live: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-brand-200 bg-brand-50 text-brand-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-orange-200 bg-orange-50 text-orange-700',
  neutral: 'border-slate-200 bg-slate-50 text-slate-600',
}

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
