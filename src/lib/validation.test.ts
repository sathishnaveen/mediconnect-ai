import { describe, expect, it } from 'vitest'
import {
  hasErrors,
  isEmail,
  isName,
  validateBookingDraft,
  validateContactForm,
  validatePatientDetails,
} from './validation'

describe('isEmail', () => {
  it('accepts normal email addresses', () => {
    expect(isEmail('sam@example.com')).toBe(true)
    expect(isEmail('  first.last@clinic.org  ')).toBe(true)
  })

  it('rejects malformed addresses', () => {
    expect(isEmail('')).toBe(false)
    expect(isEmail('sam')).toBe(false)
    expect(isEmail('sam@')).toBe(false)
    expect(isEmail('sam@example')).toBe(false)
    expect(isEmail('sam @example.com')).toBe(false)
  })
})

describe('isName', () => {
  it('requires 2 to 80 characters', () => {
    expect(isName('Sam')).toBe(true)
    expect(isName('  Dr. A. Mehta  ')).toBe(true)
    expect(isName('S')).toBe(false)
    expect(isName('')).toBe(false)
    expect(isName('x'.repeat(81))).toBe(false)
  })
})

describe('validatePatientDetails', () => {
  it('returns errors for empty fields', () => {
    const errors = validatePatientDetails({ patientName: '', patientEmail: '' })
    expect(errors.patientName).toMatch(/enter your full name/i)
    expect(errors.patientEmail).toMatch(/email address/i)
    expect(hasErrors(errors)).toBe(true)
  })

  it('returns no errors for valid details', () => {
    const errors = validatePatientDetails({
      patientName: 'Sam Carter',
      patientEmail: 'sam@example.com',
    })
    expect(errors).toEqual({})
    expect(hasErrors(errors)).toBe(false)
  })

  it('flags an invalid email', () => {
    const errors = validatePatientDetails({
      patientName: 'Sam Carter',
      patientEmail: 'not-an-email',
    })
    expect(errors.patientEmail).toMatch(/valid email/i)
  })
})

describe('validateBookingDraft', () => {
  it('requires a doctor, date, time and patient details', () => {
    const errors = validateBookingDraft({})
    expect(errors.doctorId).toBeDefined()
    expect(errors.date).toBeDefined()
    expect(errors.time).toBeDefined()
    expect(errors.patientName).toBeDefined()
    expect(errors.patientEmail).toBeDefined()
  })

  it('passes for a complete booking', () => {
    const errors = validateBookingDraft({
      doctorId: 'dr-aarav-mehta',
      date: '2026-11-02',
      time: '10:00 AM',
      patientName: 'Sam Carter',
      patientEmail: 'sam@example.com',
    })
    expect(errors).toEqual({})
  })
})

describe('validateContactForm', () => {
  it('validates every field of an empty form', () => {
    const errors = validateContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
    expect(Object.keys(errors)).toEqual(['name', 'email', 'subject', 'message'])
  })

  it('rejects a message that is too short', () => {
    const errors = validateContactForm({
      name: 'Sam',
      email: 'sam@example.com',
      subject: 'general',
      message: 'Hi',
    })
    expect(errors.message).toMatch(/at least 10 characters/i)
  })

  it('accepts a complete message', () => {
    const errors = validateContactForm({
      name: 'Sam Carter',
      email: 'sam@example.com',
      subject: 'feedback',
      message: 'I loved the booking flow on this demo website.',
    })
    expect(errors).toEqual({})
  })
})
