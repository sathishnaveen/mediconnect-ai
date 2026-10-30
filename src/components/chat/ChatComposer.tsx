import { useState, type KeyboardEvent } from 'react'
import { SendHorizonal } from 'lucide-react'

interface ChatComposerProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatComposer({ onSend, disabled = false }: ChatComposerProps) {
  const [value, setValue] = useState('')

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form
      className="border-t border-slate-200 bg-white p-3 sm:p-4"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <label htmlFor="chat-input" className="sr-only">
        Type your message to the AI healthcare assistant
      </label>
      <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-brand-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100">
        <textarea
          id="chat-input"
          rows={1}
          value={value}
          maxLength={2000}
          disabled={disabled}
          placeholder="Ask about services, specialties or booking an appointment..."
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          className="btn-primary h-11 w-11 shrink-0 !px-0"
          aria-label="Send message"
        >
          <SendHorizonal className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 px-1 text-[11px] text-slate-400">
        Enter to send - Shift + Enter for a new line. The assistant gives general information only.
      </p>
    </form>
  )
}
