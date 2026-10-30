import { useCallback, useEffect, useRef, useState } from 'react'
import { createId } from '../lib/utils'
import { createSeedMessage } from '../lib/knowledge'
import { readStorage, removeStorage, writeStorage } from '../lib/storage'
import { fetchChatHealth, sendChatMessage } from '../services/chatService'
import type { ChatMessage, ChatMode } from '../types'

const STORAGE_KEY = 'mediconnect_chat_v1'
const MAX_STORED_MESSAGES = 50

export interface UseChatResult {
  messages: ChatMessage[]
  isTyping: boolean
  error: string | null
  mode: ChatMode
  send: (text: string) => Promise<void>
  retry: () => Promise<void>
  clearChat: () => void
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = readStorage<ChatMessage[]>(STORAGE_KEY, [])
    if (Array.isArray(stored) && stored.length > 0) return stored
    return [createSeedMessage()]
  })
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<ChatMode>('unknown')

  const messagesRef = useRef<ChatMessage[]>(messages)
  const healthRequested = useRef(false)

  useEffect(() => {
    messagesRef.current = messages
    writeStorage(STORAGE_KEY, messages.slice(-MAX_STORED_MESSAGES))
  }, [messages])

  useEffect(() => {
    if (healthRequested.current) return
    healthRequested.current = true
    let active = true
    fetchChatHealth().then((health) => {
      if (active) setMode(health.mode)
    })
    return () => {
      active = false
    }
  }, [])

  const appendReply = useCallback(async (history: ChatMessage[]) => {
    const reply = await sendChatMessage(history)
    const assistantMessage: ChatMessage = {
      id: createId(),
      role: 'assistant',
      content: reply.content,
      mode: reply.mode,
      note: reply.note,
      warning: reply.warning,
      createdAt: Date.now(),
    }
    setMessages((previous) => [...previous, assistantMessage])
    setMode(reply.mode)
    return reply
  }, [])

  const send = useCallback(
    async (text: string) => {
      const content = text.trim()
      if (!content || isTyping) return

      setError(null)
      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        content,
        createdAt: Date.now(),
      }
      const history = [...messagesRef.current, userMessage]
      messagesRef.current = history
      setMessages(history)
      setIsTyping(true)

      try {
        await appendReply(history)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.')
      } finally {
        setIsTyping(false)
      }
    },
    [appendReply, isTyping],
  )

  const retry = useCallback(async () => {
    if (isTyping) return
    setError(null)
    setIsTyping(true)
    try {
      await appendReply(messagesRef.current)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.')
    } finally {
      setIsTyping(false)
    }
  }, [appendReply, isTyping])

  const clearChat = useCallback(() => {
    removeStorage(STORAGE_KEY)
    const seed = [createSeedMessage()]
    messagesRef.current = seed
    setMessages(seed)
    setError(null)
  }, [])

  return { messages, isTyping, error, mode, send, retry, clearChat }
}
