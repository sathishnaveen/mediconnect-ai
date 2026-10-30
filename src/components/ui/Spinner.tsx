interface SpinnerProps {
  className?: string
  label?: string
}

export function Spinner({ className = 'h-5 w-5', label }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        className={`animate-spin text-current ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
        <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </span>
  )
}
