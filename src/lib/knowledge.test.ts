import { describe, expect, it } from 'vitest'
import {
  DEMO_NOTE,
  emergencyLine,
  findBestFaq,
  localDemoReply,
  medicalDisclaimer,
} from './knowledge'

describe('findBestFaq', () => {
  it('matches booking questions', () => {
    const match = findBestFaq('How do I book an appointment?')
    expect(match?.id).toBe('booking')
  })

  it('matches opening hours questions', () => {
    const match = findBestFaq('What time do you open on Saturday?')
    expect(match?.id).toBe('hours')
  })

  it('matches medical-scope questions to the safety answer', () => {
    const match = findBestFaq('Can you prescribe medicine for my infection?')
    expect(match?.id).toBe('ai-limits')
  })

  it('matches emergency questions', () => {
    const match = findBestFaq('This is an emergency, what number do I call?')
    expect(match?.id).toBe('emergency')
  })

  it('returns null when nothing matches', () => {
    expect(findBestFaq('zzz qqq xxx')).toBeNull()
  })
})

describe('localDemoReply', () => {
  it('answers the last user question with the demo note', () => {
    const result = localDemoReply([
      { role: 'user', content: 'What services do you offer?' },
    ])
    expect(result.reply.toLowerCase()).toContain('cardiology')
    expect(result.note).toBe(DEMO_NOTE)
    expect(result.note).toContain('no AI model was called')
  })

  it('falls back safely for unknown questions', () => {
    const result = localDemoReply([{ role: 'user', content: 'xylophone quantum' }])
    expect(result.reply).toContain('911')
    expect(result.note).toBe(DEMO_NOTE)
  })
})

describe('safety content', () => {
  it('keeps a medical disclaimer and an emergency line', () => {
    expect(medicalDisclaimer).toMatch(/cannot diagnose/i)
    expect(medicalDisclaimer).toMatch(/prescribe medication/i)
    expect(emergencyLine).toMatch(/911/)
    expect(emergencyLine).toMatch(/emergency/i)
  })
})
