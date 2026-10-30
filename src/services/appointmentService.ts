import { readStorage, writeStorage } from '../lib/storage'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { createId } from '../lib/utils'
import { timeSlots } from '../data/timeSlots'
import type { Appointment, BookingDraft, Doctor, StorageMode } from '../types'

const STORAGE_KEY = 'mediconnect_appointments_v1'
const MAX_LOCAL_APPOINTMENTS = 50

interface AppointmentRow {
  id: string
  reference: string
  doctor_id: string
  doctor_name: string
  specialty: string
  appointment_date: string
  appointment_time: string
  patient_name: string
  patient_email: string
  status: string
  created_at: string
}

export function getBookingMode(): StorageMode {
  return isSupabaseConfigured ? 'supabase' : 'demo'
}

export function loadLocalAppointments(): Appointment[] {
  const stored = readStorage<Appointment[]>(STORAGE_KEY, [])
  return Array.isArray(stored) ? stored : []
}

export function generateReference(): string {
  const year = new Date().getFullYear()
  const code = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `MC-${year}-${code}`
}

export async function getBookedSlots(doctorId: string, date: string): Promise<string[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', date)
      .in('status', ['confirmed'])

    if (error) throw new Error(error.message)
    const rows = (data ?? []) as { appointment_time: string }[]
    return rows.map((row) => row.appointment_time)
  }

  return loadLocalAppointments()
    .filter((appointment) => appointment.doctorId === doctorId && appointment.date === date)
    .map((appointment) => appointment.time)
}

function rowToAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    reference: row.reference,
    doctorId: row.doctor_id,
    doctorName: row.doctor_name,
    specialty: row.specialty as Appointment['specialty'],
    date: row.appointment_date,
    time: row.appointment_time,
    patientName: row.patient_name,
    patientEmail: row.patient_email,
    status: 'confirmed',
    createdAt: row.created_at,
  }
}

export async function createAppointment(
  draft: BookingDraft,
  doctor: Doctor,
): Promise<{ appointment: Appointment; mode: StorageMode }> {
  const booked = await getBookedSlots(doctor.id, draft.date)
  if (booked.includes(draft.time)) {
    throw new Error('That time slot was just booked by someone else. Please pick another slot.')
  }

  const reference = generateReference()

  if (isSupabaseConfigured && supabase) {
    const insertPayload = {
      reference,
      doctor_id: doctor.id,
      doctor_name: doctor.name,
      specialty: doctor.specialty,
      appointment_date: draft.date,
      appointment_time: draft.time,
      patient_name: draft.patientName.trim(),
      patient_email: draft.patientEmail.trim().toLowerCase(),
      status: 'confirmed',
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert(insertPayload)
      .select()
      .single()

    if (error || !data) {
      throw new Error(
        `Could not save the appointment in Supabase: ${
          error?.message ?? 'no row returned'
        }. Run supabase/schema.sql in the Supabase SQL editor, or clear the Supabase variables in .env to use local demo mode.`,
      )
    }

    return { appointment: rowToAppointment(data as unknown as AppointmentRow), mode: 'supabase' }
  }

  const appointment: Appointment = {
    id: createId(),
    reference,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date: draft.date,
    time: draft.time,
    patientName: draft.patientName.trim(),
    patientEmail: draft.patientEmail.trim().toLowerCase(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  const existing = loadLocalAppointments()
  const next = [appointment, ...existing].slice(0, MAX_LOCAL_APPOINTMENTS)
  const saved = writeStorage(STORAGE_KEY, next)

  if (!saved) {
    throw new Error(
      'Your browser blocked local storage, so the booking could not be saved. Enable site storage and try again.',
    )
  }

  return { appointment, mode: 'demo' }
}

export function slotIsInPast(date: string, time: string): boolean {
  const now = new Date()
  const [year, month, day] = date.split('-').map(Number)
  const [hourPart, minutePart] = time.split(/[: ]/)
  const isPm = time.endsWith('PM')
  const baseHour = Number(hourPart)
  const hour = isPm && baseHour !== 12 ? baseHour + 12 : !isPm && baseHour === 12 ? 0 : baseHour
  const slotDate = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1, hour, Number(minutePart ?? 0))
  return slotDate.getTime() <= now.getTime()
}

export function isSelectableSlot(date: string, time: string): boolean {
  return timeSlots.includes(time) && !slotIsInPast(date, time)
}
