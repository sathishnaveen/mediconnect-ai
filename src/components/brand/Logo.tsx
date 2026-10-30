import { Link } from 'react-router-dom'

interface LogoProps {
  className?: string
  onNavigate?: () => void
}

export function Logo({ className, onNavigate }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className={`group inline-flex items-center gap-2.5 ${className ?? ''}`}
      aria-label="MediConnect AI home"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-500 shadow-[0_10px_24px_-12px_rgba(37,99,235,0.9)]">
        <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition group-hover:opacity-100" />
        <svg viewBox="0 0 64 64" className="h-6 w-6 text-white" aria-hidden="true">
          <path
            d="M10 34h11l5-12 8 22 6-14 4 6h10"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
          MediConnect
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
          AI Clinic
        </span>
      </span>
    </Link>
  )
}
