import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { cn } from '../../lib/utils'

type Tone = 'info' | 'success' | 'warning' | 'danger'

interface AlertProps {
  tone?: Tone
  title?: string
  children: ReactNode
  action?: ReactNode
  className?: string
  role?: 'status' | 'alert'
}

const toneStyles: Record<Tone, { wrapper: string; icon: typeof Info }> = {
  info: {
    wrapper: 'border-brand-200 bg-brand-50 text-brand-900',
    icon: Info,
  },
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: CheckCircle2,
  },
  warning: {
    wrapper: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: TriangleAlert,
  },
  danger: {
    wrapper: 'border-red-200 bg-red-50 text-red-900',
    icon: AlertCircle,
  },
}

export function Alert({
  tone = 'info',
  title,
  children,
  action,
  className,
  role = 'status',
}: AlertProps) {
  const styles = toneStyles[tone]
  const Icon = styles.icon

  return (
    <div
      role={role}
      className={cn('flex items-start gap-3 rounded-2xl border p-4 text-sm', styles.wrapper, className)}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex-1 space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="leading-relaxed">{children}</div>
        {action ? <div className="pt-1">{action}</div> : null}
      </div>
    </div>
  )
}
