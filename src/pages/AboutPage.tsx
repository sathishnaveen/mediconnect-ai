import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarCheck,
  HeartHandshake,
  Lightbulb,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CtaBanner } from '../components/home/CtaBanner'
import { clinicStats, team, timeline, values } from '../data/clinic'

const valueIcons = [HeartHandshake, ShieldCheck, Lightbulb, Sparkles]

const howItWorks = [
  {
    icon: Search,
    title: '1. Discover',
    description:
      'Search the doctor directory, filter by specialty and read each profile to find the right specialist.',
  },
  {
    icon: MessageSquare,
    title: '2. Ask',
    description:
      'Chat with the AI assistant about services, fees, opening hours or the booking steps - any time of day.',
  },
  {
    icon: CalendarCheck,
    title: '3. Book',
    description:
      'Pick an open date and time, add your name and email, and get an instant confirmation reference.',
  },
]

export function AboutPage() {
  useDocumentTitle('About Us | MediConnect AI')

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="grid-pattern absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="container-page relative py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">About MediConnect AI</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Healthcare that explains itself,{' '}
              <span className="text-gradient">before you arrive</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              MediConnect AI is a demo healthcare website that shows how a modern clinic can combine
              a clear doctor directory, an honest AI assistant and a fast booking flow - without
              ever pretending the software is a medical professional.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/book" className="btn-primary btn-lg">
                Book an appointment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/assistant" className="btn-secondary btn-lg">
                Try the AI assistant
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our mission"
              title="Make the first step to care feel effortless"
              description="Most patients delay a visit because calling is inconvenient. We move that first step online."
            />
            <p className="mt-5 text-sm leading-relaxed text-slate-600">
              In a real clinic, patients call during office hours, wait on hold and often leave a
              voicemail. MediConnect AI flips that journey: patients browse doctors, ask questions
              and book a slot themselves - while the clinic keeps full control of the information
              that is shared.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Every AI answer is labelled. When no AI model is configured, the assistant says so and
              serves clearly marked sample answers from a built-in FAQ list.
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            {clinicStats.map((stat) => (
              <div key={stat.label} className="card p-5">
                <dt className="text-sm font-medium text-slate-500">{stat.label}</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold text-brand-700">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our values"
            title="Four principles behind every screen"
            description="These principles guided the design, the copy and the AI guardrails in this project."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = valueIcons[index] ?? ShieldCheck
              return (
                <article key={value.title} className="card card-hover p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{value.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps from question to confirmation"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.title} className="card relative overflow-hidden p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-sky-100 text-brand-600">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our journey"
            title="From paper appointment books to AI guidance"
          />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((entry) => (
              <li key={entry.year} className="card p-6">
                <span className="font-display text-2xl font-extrabold text-brand-600">
                  {entry.year}
                </span>
                <h3 className="mt-2 text-base font-bold">{entry.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{entry.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="The team"
            title="People behind the demo"
            description="Fictional staff profiles created for this project - shown to demonstrate a realistic clinic team section."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <article key={member.name} className="card p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-sky-500 font-display text-xl font-extrabold text-white">
                  {member.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <h3 className="mt-4 text-base font-bold">{member.name}</h3>
                <p className="text-sm font-semibold text-brand-600">{member.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
