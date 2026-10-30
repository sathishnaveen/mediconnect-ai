import { beforeEach, describe, expect, it } from 'vitest'
import {
  createAppointment,
  generateReference,
  getBookedSlots,
  getBookingMode,
  loadLocalAppointments,
} from './appointmentService'
import { doctors } from '../data/doctors'

const doctor = doctors[0]

async function book(time: string) {
  return createAppointment(
    {
      doctorId: doctor.id,
      date: '2099-01-05',
      time,
      patientName: 'Sam Carter',
      patientEmail: 'sam@example.com',
    },
    doctor,
  )
}

describe('appointmentService (local demo mode)', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('reports demo mode when Supabase is not configured', () => {
    expect(getBookingMode()).toBe('demo')
  })

  it('generates a reference in the MC-YEAR-CODE format', () => {
    expect(generateReference()).toMatch(/^MC-\d{4}-[A-Z0-9]{5}$/)
  })

  it('stores a booking in localStorage', async () => {
    const { appointment, mode } = await book('10:00 AM')

    expect(mode).toBe('demo')
    expect(appointment.reference).toMatch(/^MC-/)
    expect(loadLocalAppointments()).toHaveLength(1)
    expect(loadLocalAppointments()[0]?.time).toBe('10:00 AM')
  })

  it('reports booked slots for the same doctor and date', async () => {
    await book('10:00 AM')
    await book('11:30 AM')

    const slots = await getBookedSlots(doctor.id, '2099-01-05')
    expect(slots).toEqual(expect.arrayContaining(['10:00 AM', '11:30 AM']))
  })

  it('does not report slots from another doctor or date', async () => {
    await book('10:00 AM')

    const otherDoctorSlots = await getBookedSlots(doctors[1]?.id ?? 'other', '2099-01-05')
    expect(otherDoctorSlots).toHaveLength(0)

    const otherDateSlots = await getBookedSlots(doctor.id, '2099-01-06')
    expect(otherDateSlots).toHaveLength(0)
  })

  it('blocks double-booking the same slot', async () => {
    await book('09:30 AM')
    await expect(book('09:30 AM')).rejects.toThrow(/just booked/i)
  })
})
