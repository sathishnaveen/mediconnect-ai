const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

export function isClinicOpen(date: Date): boolean {
  return date.getDay() !== 0
}

export function isToday(date: Date): boolean {
  return toDateKey(date) === toDateKey(new Date())
}

export function getNextBookableDates(count: number, from: Date = new Date()): Date[] {
  const dates: Date[] = []
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  while (dates.length < count) {
    if (isClinicOpen(cursor)) dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

export function formatDateLong(date: Date): string {
  return `${WEEKDAY_SHORT[date.getDay()]}, ${date.getDate()} ${MONTH_SHORT[date.getMonth()]} ${date.getFullYear()}`
}

export function formatDayChip(date: Date): { weekday: string; day: string; month: string } {
  return {
    weekday: WEEKDAY_SHORT[date.getDay()] ?? '',
    day: String(date.getDate()).padStart(2, '0'),
    month: MONTH_SHORT[date.getMonth()] ?? '',
  }
}
