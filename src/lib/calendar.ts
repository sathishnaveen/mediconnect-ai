import type { Appointment } from '../types'

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function to24Hour(time: string): { hour: number; minute: number } {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim())
  if (!match) return { hour: 9, minute: 0 }
  let hour = Number(match[1])
  const minute = Number(match[2])
  const period = match[3]?.toUpperCase()
  if (period === 'PM' && hour !== 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0
  return { hour, minute }
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function toIcsStamp(date: string, time: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const { hour, minute } = to24Hour(time)
  return `${year ?? 1970}${pad(month ?? 1)}${pad(day ?? 1)}T${pad(hour)}${pad(minute)}00`
}

function addMinutes(date: string, time: string, minutes: number): string {
  const { hour, minute } = to24Hour(time)
  const total = hour * 60 + minute + minutes
  const [year, month, day] = date.split('-').map(Number)
  const base = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1, Math.floor(total / 60), total % 60)
  return `${base.getFullYear()}${pad(base.getMonth() + 1)}${pad(base.getDate())}T${pad(base.getHours())}${pad(base.getMinutes())}00`
}

export function buildIcsFile(appointment: Appointment, location: string): string {
  const stamp = new Date()
  const utcStamp = `${stamp.getUTCFullYear()}${pad(stamp.getUTCMonth() + 1)}${pad(stamp.getUTCDate())}T${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}${pad(stamp.getUTCSeconds())}Z`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MediConnect AI//Appointment//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${appointment.reference}@mediconnect-ai.demo`,
    `DTSTAMP:${utcStamp}`,
    `DTSTART:${toIcsStamp(appointment.date, appointment.time)}`,
    `DTEND:${addMinutes(appointment.date, appointment.time, 30)}`,
    `SUMMARY:${escapeIcsText(`Appointment with ${appointment.doctorName} (MediConnect AI)`)}`,
    `DESCRIPTION:${escapeIcsText(
      `Confirmation ${appointment.reference}. ${appointment.specialty} consultation. Patient: ${appointment.patientName}. Please arrive 10 minutes early with a photo ID.`,
    )}`,
    `LOCATION:${escapeIcsText(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs(appointment: Appointment, location: string): void {
  const content = buildIcsFile(appointment, location)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${appointment.reference}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
