import { Bot } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { ChatMessage, ChatMode } from '../../types'

const modeBadge: Record<
  Exclude<ChatMode, 'unknown'>,
  { tone: 'live' | 'demo' | 'warning'; label: string }
> = {
  ai: { tone: 'live', label: 'AI-generated' },
  demo: { tone: 'demo', label: 'Demo answer (no AI)' },
  offline: { tone: 'warning', label: 'Offline sample (no AI)' },
}

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-3 text-sm leading-relaxed text-white shadow-[0_10px_24px_-16px_rgba(37,99,235,1)]">
          {message.content}
        </div>
      </div>
    )
  }

  const badge = message.mode && message.mode !== 'unknown' ? modeBadge[message.mode] : null

  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-sky-500 text-white"
        aria-hidden="true"
      >
        <Bot className="h-4 w-4" />
      </span>
      <div className="max-w-[85%] space-y-2">
        <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-700">
          {message.content}
        </div>
        <div className="flex flex-wrap items-center gap-2 pl-1">
          {badge ? <Badge tone={badge.tone}>{badge.label}</Badge> : null}
          {message.note ? (
            <span className="text-[11px] leading-snug text-slate-400">{message.note}</span>
          ) : null}
        </div>
        {message.warning ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] leading-snug text-amber-800">
            {message.warning}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3" role="status" aria-live="polite">
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-sky-500 text-white"
        aria-hidden="true"
      >
        <Bot className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
        <span className="sr-only">The assistant is typing a reply</span>
      </div>
    </div>
  )
}
