import { describe, expect, it } from 'vitest'
import {
  formatDateLong,
  getNextBookableDates,
  isClinicOpen,
  parseDateKey,
  toDateKey,
} from './date'

describe('toDateKey / parseDateKey', () => {
  it('round-trips a date to a YYYY-MM-DD key', () => {
    const date = new Date(2026, 10, 2)
    expect(toDateKey(date)).toBe('2026-11-02')
    expect(toDateKey(parseDateKey('2026-11-02'))).toBe('2026-11-02')
  })

  it('pads single digit months and days', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('isClinicOpen', () => {
  it('is closed on Sundays and open on weekdays', () => {
    expect(isClinicOpen(new Date(2026, 9, 27))).toBe(true)
    expect(isClinicOpen(new Date(2026, 9, 25))).toBe(false)
  })
})

describe('getNextBookableDates', () => {
  it('never returns a Sunday', () => {
    const dates = getNextBookableDates(12, new Date(2026, 9, 20))
    expect(dates).toHaveLength(12)
    for (const date of dates) {
      expect(date.getDay()).not.toBe(0)
    }
  })

  it('starts from the given day and moves forward', () => {
    const dates = getNextBookableDates(3, new Date(2026, 9, 20))
    expect(dates[0]?.getTime()).toBeGreaterThanOrEqual(new Date(2026, 9, 20).getTime())
    expect(dates[1]?.getTime()).toBeGreaterThan(dates[0]?.getTime() ?? 0)
  })
})

describe('formatDateLong', () => {
  it('formats a readable date label', () => {
    expect(formatDateLong(new Date(2026, 10, 2))).toBe('Mon, 2 Nov 2026')
  })
})
