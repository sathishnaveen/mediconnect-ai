import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Baby,
  Bone,
  FlaskConical,
  HeartPulse,
  Stethoscope,
  Video,
} from 'lucide-react'
import { services } from '../../data/clinic'
import { SectionHeading } from '../ui/SectionHeading'

const iconMap = {
  stethoscope: Stethoscope,
  heartPulse: HeartPulse,
  video: Video,
  flask: FlaskConical,
  baby: Baby,
  bone: Bone,
} as const

export function ServicesSection() {
  return (
    <section id="services" className="section-y bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Healthcare services"
          title={
            <>
              Everything your family needs,{' '}
              <span className="text-gradient">under one roof</span>
            </>
          }
          description="From routine check-ups to specialist consultations and lab diagnostics - browse our core services below."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon]
            return (
              <article key={service.id} className="card card-hover flex flex-col p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-sky-100 text-brand-600">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                  {service.description}
                </p>
                <Link
                  to={`/assistant?q=${encodeURIComponent(`Tell me about the ${service.title} service.`)}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                  aria-label={`Ask the AI assistant about ${service.title}`}
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
