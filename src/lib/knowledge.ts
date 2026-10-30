import knowledgeJson from '../../shared/knowledge.json'
import { createId } from './utils'
import type { ChatMessage, ChatRole } from '../types'

export const knowledge = knowledgeJson
export const clinicInfo = knowledgeJson.clinic
export const emergencyLine = knowledgeJson.emergency
export const medicalDisclaimer = knowledgeJson.disclaimer
export const bookingSteps = knowledgeJson.bookingSteps

export const DEMO_NOTE =
  'Sample answer from the built-in FAQ knowledge base - no AI model was called. Set AI_API_KEY (or GROQ_API_KEY) in .env to enable live AI replies.'

export interface FaqMatch {
  id: string
  question: string
  answer: string
}

export function findBestFaq(text: string): FaqMatch | null {
  const normalized = text.toLowerCase()
  const words = normalized.split(/[^a-z0-9]+/).filter((word) => word.length > 3)
  let best: FaqMatch | null = null
  let bestScore = 0

  for (const faq of knowledgeJson.faqs) {
    let score = 0
    for (const keyword of faq.keywords) {
      if (normalized.includes(keyword.toLowerCase())) score += keyword.length > 6 ? 3 : 2
    }
    for (const word of words) {
      if (faq.question.toLowerCase().includes(word)) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      best = { id: faq.id, question: faq.question, answer: faq.answer }
    }
  }

  return bestScore > 0 ? best : null
}

export function localDemoReply(
  messages: { role: ChatRole; content: string }[],
): { reply: string; note: string } {
  const lastUser = [...messages].reverse().find((message) => message.role === 'user')
  const match = lastUser ? findBestFaq(lastUser.content) : null
  if (!match) return { reply: knowledgeJson.fallback, note: DEMO_NOTE }
  return { reply: match.answer, note: DEMO_NOTE }
}

export function createSeedMessage(): ChatMessage {
  return {
    id: createId(),
    role: 'assistant',
    content: knowledgeJson.greeting,
    mode: 'unknown',
    note: 'MediConnect AI is a demo project - clinic details and doctors are sample data.',
    createdAt: Date.now(),
  }
}
