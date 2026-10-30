import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { featuredDoctors } from '../../data/doctors'
import { SectionHeading } from '../ui/SectionHeading'
import { DoctorCard } from '../DoctorCard'

export function FeaturedDoctorsSection() {
  return (
    <section className="section-y bg-slate-50">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Featured doctors"
            title="Meet a few of our specialists"
            description="Sample profiles for this demo - use search and filters to explore the full directory."
          />
          <Link to="/doctors" className="btn-secondary shrink-0">
            View all doctors
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        <p className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-500">
          <ShieldCheck className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Doctor names, ratings and availability on this site are fictional demo content.
        </p>
      </div>
    </section>
  )
}
