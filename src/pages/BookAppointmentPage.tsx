import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertTriangle, ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { doctors, getDoctorById } from '../data/doctors'
import { toDateKey, getNextBookableDates, formatDateLong, parseDateKey } from '../lib/date'
import { validateBookingDraft, validatePatientDetails, hasErrors } from '../lib/validation'
import type { FormErrors } from '../lib/validation'
import {
  createAppointment,
  getBookedSlots,
  getBookingMode,
} from '../services/appointmentService'
import { StepIndicator } from '../components/appointment/StepIndicator'
import { DoctorSelectStep } from '../components/appointment/DoctorSelectStep'
import { DateTimeStep } from '../components/appointment/DateTimeStep'
import { DetailsStep } from '../components/appointment/DetailsStep'
import { ConfirmationView } from '../components/appointment/ConfirmationView'
import { Alert } from '../components/ui/Alert'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import type { Appointment, BookingDraft, StorageMode } from '../types'

const firstOpenDate = getNextBookableDates(1)[0]

export function BookAppointmentPage() {
  useDocumentTitle('Book an Appointment | MediConnect AI')

  const [searchParams] = useSearchParams()
  const preselectedDoctor = getDoctorById(searchParams.get('doctor'))

  const [step, setStep] = useState(0)
  const [doctorId, setDoctorId] = useState(preselectedDoctor?.id ?? '')
  const [date, setDate] = useState(firstOpenDate ? toDateKey(firstOpenDate) : '')
  const [time, setTime] = useState('')
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [errors, setErrors] = useState<FormErrors<BookingDraft>>({})
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [slotsReloadKey, setSlotsReloadKey] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<{
    appointment: Appointment
    mode: StorageMode
  } | null>(null)

  const doctor = getDoctorById(doctorId)
  const bookingMode = getBookingMode()
  const dateLabel = date ? formatDateLong(parseDateKey(date)) : ''

  useEffect(() => {
    if (!doctorId || !date) {
      setBookedSlots([])
      return undefined
    }

    let active = true
    setSlotsLoading(true)
    setSlotsError(null)

    getBookedSlots(doctorId, date)
      .then((slots) => {
        if (!active) return
        setBookedSlots(slots)
      })
      .catch((error: unknown) => {
        if (!active) return
        setBookedSlots([])
        setSlotsError(
          error instanceof Error ? error.message : 'Could not load the available time slots.',
        )
      })
      .finally(() => {
        if (active) setSlotsLoading(false)
      })

    return () => {
      active = false
    }
  }, [doctorId, date, slotsReloadKey])

  function handleDoctorNext() {
    const nextErrors = validateBookingDraft({
      doctorId,
      date,
      time,
      patientName,
      patientEmail,
    })
    const onlyDoctor: FormErrors<BookingDraft> = {}
    if (nextErrors.doctorId) onlyDoctor.doctorId = nextErrors.doctorId

    if (hasErrors(onlyDoctor)) {
      setErrors(onlyDoctor)
      return
    }
    setErrors({})
    setStep(1)
  }

  function handleDateTimeNext() {
    const nextErrors = validateBookingDraft({
      doctorId,
      date,
      time,
      patientName,
      patientEmail,
    })
    const selection: FormErrors<BookingDraft> = {}
    if (nextErrors.date) selection.date = nextErrors.date
    if (nextErrors.time) selection.time = nextErrors.time

    if (time && bookedSlots.includes(time)) {
      selection.time = 'That slot has just been booked. Please pick another time.'
    }

    if (hasErrors(selection)) {
      setErrors(selection)
      return
    }
    setErrors({})
    setStep(2)
  }

  async function handleSubmit() {
    if (!doctor) return

    const detailErrors = validatePatientDetails({ patientName, patientEmail })
    setErrors(detailErrors)
    setSubmitError(null)

    if (hasErrors(detailErrors)) return

    const draft: BookingDraft = {
      doctorId,
      date,
      time,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
    }

    setSubmitting(true)
    try {
      const result = await createAppointment(draft, doctor)
      setConfirmed(result)
      setErrors({})
      setStep(3)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  function resetFlow() {
    setStep(0)
    setDoctorId('')
    setDate(firstOpenDate ? toDateKey(firstOpenDate) : '')
    setTime('')
    setPatientName('')
    setPatientEmail('')
    setErrors({})
    setSubmitError(null)
    setConfirmed(null)
    setBookedSlots([])
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50">
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page py-10 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Appointment booking</p>
              <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Book an appointment</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Four quick steps: pick a doctor, choose an open slot, add your details and confirm.
              </p>
            </div>
            <Badge tone={bookingMode === 'supabase' ? 'info' : 'demo'}>
              {bookingMode === 'supabase'
                ? 'Storage: Supabase database'
                : 'Storage: your browser (demo mode)'}
            </Badge>
          </div>

          <div className="mt-8">
            <StepIndicator current={step} />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <div className="mx-auto w-full max-w-5xl">
            {bookingMode === 'demo' && step < 3 ? (
              <div className="mb-6">
                <Alert tone="info" title="Demo mode active" role="status">
                  Supabase is not configured, so appointments are saved only in this browser
                  (localStorage) and will not be visible on other devices. Add your free Supabase
                  keys to <code>.env</code> for persistent storage - see README setup step 4.
                </Alert>
              </div>
            ) : null}

            <div className="card p-5 sm:p-8">
              {step === 0 ? (
                <div className="space-y-6">
                  <DoctorSelectStep
                    doctors={doctors}
                    value={doctorId}
                    onChange={(id) => {
                      setDoctorId(id)
                      setErrors({})
                    }}
                    error={errors.doctorId}
                  />
                  <div className="flex justify-end border-t border-slate-100 pt-5">
                    <Button onClick={handleDoctorNext}>
                      Continue to date &amp; time
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === 1 && doctor ? (
                <div className="space-y-6">
                  <DateTimeStep
                    doctor={doctor}
                    date={date}
                    onDateChange={(value) => {
                      setDate(value)
                      setTime('')
                      setErrors({})
                    }}
                    time={time}
                    onTimeChange={(value) => {
                      setTime(value)
                      setErrors({})
                    }}
                    bookedSlots={bookedSlots}
                    loading={slotsLoading}
                    error={slotsError}
                    onRetry={() => setSlotsReloadKey((current) => current + 1)}
                    dateError={errors.date}
                    timeError={errors.time}
                  />
                  <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                    <Button variant="secondary" onClick={() => setStep(0)}>
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Back
                    </Button>
                    <Button onClick={handleDateTimeNext} disabled={!time}>
                      Continue to your details
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === 2 && doctor ? (
                <div className="space-y-6">
                  <DetailsStep
                    doctor={doctor}
                    dateLabel={dateLabel}
                    time={time}
                    patientName={patientName}
                    patientEmail={patientEmail}
                    onNameChange={(value) => {
                      setPatientName(value)
                      setErrors((current) => ({ ...current, patientName: undefined }))
                    }}
                    onEmailChange={(value) => {
                      setPatientEmail(value)
                      setErrors((current) => ({ ...current, patientEmail: undefined }))
                    }}
                    errors={{
                      patientName: errors.patientName,
                      patientEmail: errors.patientEmail,
                    }}
                    submitting={submitting}
                    submitError={submitError}
                    onSubmit={() => void handleSubmit()}
                  />
                  <div className="border-t border-slate-100 pt-5">
                    <Button variant="secondary" onClick={() => setStep(1)} disabled={submitting}>
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Back to date &amp; time
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === 3 && confirmed ? (
                <ConfirmationView
                  appointment={confirmed.appointment}
                  mode={confirmed.mode}
                  onBookAnother={resetFlow}
                />
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
              <p className="inline-flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
                Need help booking? Ask the{' '}
                <Link to="/assistant" className="font-semibold text-brand-600 hover:underline">
                  AI healthcare assistant
                </Link>
                .
              </p>
              <p className="inline-flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-brand-500" aria-hidden="true" />
                Clinic closed on Sundays - slots only appear on open days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
