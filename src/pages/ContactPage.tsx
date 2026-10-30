import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, MessageSquare, Phone, Send, Siren } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Alert } from '../components/ui/Alert'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { TextInput } from '../components/ui/TextInput'
import { SelectField } from '../components/ui/SelectField'
import { clinicInfo, emergencyLine } from '../lib/knowledge'
import { validateContactForm, hasErrors } from '../lib/validation'
import type { FormErrors } from '../lib/validation'
import { submitContact, type ContactResult } from '../services/contactService'
import { isSupabaseConfigured } from '../lib/supabase'
import type { ContactMessage } from '../types'

const subjectOptions = [
  { value: 'general', label: 'General enquiry' },
  { value: 'appointment', label: 'Help with an appointment' },
  { value: 'billing', label: 'Billing & insurance' },
  { value: 'feedback', label: 'Feedback about the website' },
  { value: 'technical', label: 'Technical problem' },
]

const emptyForm: ContactMessage = { name: '', email: '', subject: '', message: '' }

export function ContactPage() {
  useDocumentTitle('Contact Us | MediConnect AI')

  const [form, setForm] = useState<ContactMessage>(emptyForm)
  const [errors, setErrors] = useState<FormErrors<ContactMessage>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState<ContactResult | null>(null)

  function updateField(field: keyof ContactMessage, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit() {
    const nextErrors = validateContactForm(form)
    setErrors(nextErrors)
    setSubmitError(null)

    if (hasErrors(nextErrors)) return

    setSubmitting(true)
    try {
      const result = await submitContact(form)
      setSuccess(result)
      setForm(emptyForm)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page py-12 sm:py-16">
          <p className="eyebrow">Contact us</p>
          <h1 className="mt-4 max-w-2xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            We usually reply within one working day
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Send a message about appointments, services or feedback. Prefer instant answers? The{' '}
            <Link to="/assistant" className="font-semibold text-brand-600 hover:underline">
              AI healthcare assistant
            </Link>{' '}
            handles common questions 24/7.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Send us a message</h2>
              <Badge tone={isSupabaseConfigured ? 'info' : 'demo'}>
                {isSupabaseConfigured ? 'Delivered via Supabase' : 'Demo mode'}
              </Badge>
            </div>

            {!isSupabaseConfigured ? (
              <div className="mt-4">
                <Alert tone="warning" title="Demo mode - message not delivered" role="status">
                  Supabase is not configured, so submitting saves your message only in this browser.
                  Nothing is emailed or stored on a server. Add your free Supabase keys to{' '}
                  <code>.env</code> to deliver messages to a real table (see README step 4).
                </Alert>
              </div>
            ) : null}

            {success ? (
              <div className="mt-6 space-y-4">
                <Alert
                  tone="success"
                  title="Message recorded"
                  role="status"
                  action={
                    <Button variant="secondary" onClick={() => setSuccess(null)}>
                      Send another message
                    </Button>
                  }
                >
                  Reference <span className="font-semibold">{success.submission.reference}</span> -{' '}
                  {success.info}
                </Alert>
                {success.mode === 'demo' ? (
                  <p className="text-xs text-slate-500">
                    Limitation of demo mode: clearing your browser storage removes this message, and
                    nobody at the clinic is notified.
                  </p>
                ) : null}
              </div>
            ) : (
              <form
                className="mt-6 space-y-4"
                noValidate
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleSubmit()
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    id="contact-name"
                    label="Your name"
                    value={form.name}
                    onChange={(value) => updateField('name', value)}
                    autoComplete="name"
                    placeholder="e.g. Sam Carter"
                    required
                    disabled={submitting}
                    error={errors.name}
                  />
                  <TextInput
                    id="contact-email"
                    label="Email address"
                    type="email"
                    value={form.email}
                    onChange={(value) => updateField('email', value)}
                    autoComplete="email"
                    placeholder="e.g. sam@example.com"
                    required
                    disabled={submitting}
                    error={errors.email}
                  />
                </div>

                <SelectField
                  id="contact-subject"
                  label="Subject"
                  value={form.subject}
                  onChange={(value) => updateField('subject', value)}
                  options={subjectOptions}
                  placeholder="Choose a subject"
                  required
                  disabled={submitting}
                  error={errors.subject}
                />

                <TextInput
                  id="contact-message"
                  label="Message"
                  value={form.message}
                  onChange={(value) => updateField('message', value)}
                  placeholder="How can we help you?"
                  required
                  textarea
                  rows={6}
                  maxLength={1200}
                  disabled={submitting}
                  error={errors.message}
                  hint={`${form.message.length}/1200 characters`}
                />

                {submitError ? (
                  <Alert tone="danger" title="Could not send your message" role="alert">
                    {submitError}
                  </Alert>
                ) : null}

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Button type="submit" loading={submitting}>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {submitting ? 'Sending...' : 'Send message'}
                  </Button>
                  <p className="text-xs text-slate-400">
                    Please do not include medical records or sensitive health data.
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold">Clinic details</h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
                Sample contact information (demo)
              </p>
              <ul className="mt-4 space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                  <span>{clinicInfo.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                  <a
                    href={`tel:${clinicInfo.phone.replace(/[^+\d]/g, '')}`}
                    className="link-muted"
                  >
                    {clinicInfo.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                  <a href={`mailto:${clinicInfo.email}`} className="link-muted">
                    {clinicInfo.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                  <span>
                    {clinicInfo.hours.map((entry) => (
                      <span key={entry.days} className="block">
                        {entry.days}: <span className="font-medium">{entry.time}</span>
                      </span>
                    ))}
                  </span>
                </li>
              </ul>
            </div>

            <div className="card p-6">
              <h2 className="inline-flex items-center gap-2 text-lg font-bold">
                <MessageSquare className="h-5 w-5 text-brand-600" aria-hidden="true" />
                Quick answers
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Fees, opening hours, specialties and booking steps are answered instantly by the AI
                healthcare assistant.
              </p>
              <Link to="/assistant" className="btn-primary mt-4 w-full">
                Open the AI assistant
              </Link>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
              <Siren className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p>
                <span className="font-bold">Medical emergency?</span> {emergencyLine}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
