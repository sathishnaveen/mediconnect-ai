import type { BookingDraft, ContactMessage } from '../types'

export type FormErrors<T> = Partial<Record<keyof T, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function isName(value: string): boolean {
  const trimmed = value.trim()
  return trimmed.length >= 2 && trimmed.length <= 80
}

export function validatePatientDetails(values: {
  patientName: string
  patientEmail: string
}): FormErrors<Pick<BookingDraft, 'patientName' | 'patientEmail'>> {
  const errors: FormErrors<Pick<BookingDraft, 'patientName' | 'patientEmail'>> = {}

  if (!values.patientName.trim()) {
    errors.patientName = 'Please enter your full name.'
  } else if (!isName(values.patientName)) {
    errors.patientName = 'Name must be between 2 and 80 characters.'
  }

  if (!values.patientEmail.trim()) {
    errors.patientEmail = 'Please enter your email address.'
  } else if (!isEmail(values.patientEmail)) {
    errors.patientEmail = 'Enter a valid email address, for example sam@example.com.'
  }

  return errors
}

export function validateBookingDraft(
  values: Partial<BookingDraft>,
): FormErrors<BookingDraft> {
  const errors: FormErrors<BookingDraft> = {}

  if (!values.doctorId) errors.doctorId = 'Please select a doctor.'
  if (!values.date) errors.date = 'Please choose a date.'
  if (!values.time) errors.time = 'Please choose a time slot.'

  const detailErrors = validatePatientDetails({
    patientName: values.patientName ?? '',
    patientEmail: values.patientEmail ?? '',
  })
  if (detailErrors.patientName) errors.patientName = detailErrors.patientName
  if (detailErrors.patientEmail) errors.patientEmail = detailErrors.patientEmail

  return errors
}

export function validateContactForm(values: ContactMessage): FormErrors<ContactMessage> {
  const errors: FormErrors<ContactMessage> = {}

  if (!values.name.trim()) {
    errors.name = 'Please tell us your name.'
  } else if (!isName(values.name)) {
    errors.name = 'Name must be between 2 and 80 characters.'
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!isEmail(values.email)) {
    errors.email = 'Enter a valid email address, for example sam@example.com.'
  }

  if (!values.subject) {
    errors.subject = 'Please choose a subject.'
  }

  if (!values.message.trim()) {
    errors.message = 'Please write a message.'
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters long.'
  }

  return errors
}

export function hasErrors<T>(errors: FormErrors<T>): boolean {
  return Object.keys(errors).length > 0
}
