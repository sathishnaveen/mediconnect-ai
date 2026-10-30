import { DEMO_NOTE, localDemoReply } from '../lib/knowledge'
import type { ChatMode, ChatMessage } from '../types'

export interface ChatReply {
  content: string
  mode: ChatMode
  note?: string
  warning?: string
}

export interface ChatHealth {
  mode: ChatMode
  aiConfigured: boolean
  model: string | null
}

function toApiMessages(messages: ChatMessage[]): { role: 'user' | 'assistant'; content: string }[] {
  return messages
    .filter((message) => message.content.trim().length > 0)
    .slice(-12)
    .map((message) => ({ role: message.role, content: message.content }))
}

export async function fetchChatHealth(): Promise<ChatHealth> {
  try {
    const response = await fetch('/api/health')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = (await response.json()) as {
      mode?: string
      aiConfigured?: boolean
      model?: string | null
    }
    return {
      mode: data.mode === 'ai' ? 'ai' : 'demo',
      aiConfigured: Boolean(data.aiConfigured),
      model: data.model ?? null,
    }
  } catch {
    return { mode: 'offline', aiConfigured: false, model: null }
  }
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatReply> {
  const payload = toApiMessages(messages)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: payload }),
    })

    const data = (await response.json().catch(() => null)) as {
      reply?: string
      mode?: string
      note?: string
      warning?: string
      error?: string
    } | null

    if (!response.ok) {
      throw new Error(data?.error ?? `The AI server responded with status ${response.status}.`)
    }

    if (!data?.reply) throw new Error('The AI server returned an empty reply.')

    const mode: ChatMode =
      data.mode === 'ai' ? 'ai' : data.mode === 'demo' ? 'demo' : 'offline'

    return { content: data.reply, mode, note: data.note, warning: data.warning }
  } catch (error) {
    const offline = localDemoReply(payload)
    const reason = error instanceof Error ? error.message : 'Network error'
    return {
      content: offline.reply,
      mode: 'offline',
      note: `The AI server could not be reached (${reason}). Showing built-in sample answers - start the project with "npm run dev" to connect it. No AI model generated this reply.`,
      warning: DEMO_NOTE,
    }
  }
}
