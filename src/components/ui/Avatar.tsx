import { initials } from '../../lib/utils'
import type { Specialty } from '../../types'

const gradients: Record<Specialty, string> = {
  Cardiology: 'from-rose-500 to-pink-600',
  Dermatology: 'from-amber-400 to-orange-500',
  Pediatrics: 'from-sky-400 to-blue-600',
  Orthopedics: 'from-emerald-400 to-teal-600',
  Neurology: 'from-violet-500 to-indigo-600',
  'General Medicine': 'from-cyan-400 to-sky-600',
  Gynecology: 'from-fuchsia-400 to-pink-600',
  Physiotherapy: 'from-lime-400 to-green-600',
}

interface AvatarProps {
  name: string
  specialty: Specialty
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-base',
  lg: 'h-20 w-20 text-xl',
}

export function Avatar({ name, specialty, size = 'md' }: AvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display font-bold text-white shadow-md ${gradients[specialty] ?? 'from-brand-500 to-brand-700'} ${sizeClasses[size]}`}
    >
      {initials(name)}
    </div>
  )
}
