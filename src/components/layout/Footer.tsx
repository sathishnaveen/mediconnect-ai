import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { clinicInfo } from '../../lib/knowledge'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/assistant', label: 'AI Healthcare Assistant' },
  { to: '/doctors', label: 'Find a Doctor' },
  { to: '/book', label: 'Book Appointment' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const serviceLinks = [
  { to: '/doctors?specialty=Cardiology', label: 'Cardiology' },
  { to: '/doctors?specialty=Pediatrics', label: 'Pediatrics' },
  { to: '/doctors?specialty=Dermatology', label: 'Dermatology' },
  { to: '/doctors?specialty=Orthopedics', label: 'Orthopedics' },
  { to: '/doctors?specialty=Neurology', label: 'Neurology' },
  { to: '/doctors?specialty=General%20Medicine', label: 'General Medicine' },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-slate-500">
            A demo AI-powered healthcare website where patients can discover doctors, ask the clinic
            assistant questions and book appointments online.
          </p>
          <p className="inline-flex rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            Demo project - sample doctors &amp; clinic data
          </p>
        </div>

        <nav aria-label="Footer quick links">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Quick links</h2>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="link-muted">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer specialty links">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Specialties
          </h2>
          <ul className="mt-4 space-y-2.5">
            {serviceLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="link-muted">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              <span>{clinicInfo.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              <a href={`tel:${clinicInfo.phone.replace(/[^+\d]/g, '')}`} className="link-muted">
                {clinicInfo.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              <a href={`mailto:${clinicInfo.email}`} className="link-muted">
                {clinicInfo.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              <span>
                {clinicInfo.hours.map((entry) => (
                  <span key={entry.days} className="block">
                    {entry.days}: {entry.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} MediConnect AI (demo). All rights reserved.</p>
          <p className="max-w-2xl sm:text-right">
            General information only - not a diagnosis or prescription. In an emergency, call your
            local emergency number (911 in the US).
          </p>
        </div>
      </div>
    </footer>
  )
}
