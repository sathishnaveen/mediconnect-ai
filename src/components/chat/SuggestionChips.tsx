import { Sparkles } from 'lucide-react'
import { knowledge } from '../../lib/knowledge'

const suggestedIds = ['services', 'booking', 'hours', 'find-doctor', 'telemedicine']

interface SuggestionChipsProps {
  onSelect: (question: string) => void
  disabled?: boolean
}

export function SuggestionChips({ onSelect, disabled = false }: SuggestionChipsProps) {
  const suggestions = knowledge.faqs
    .filter((faq) => suggestedIds.includes(faq.id))
    .map((faq) => faq.question)
    .slice(0, 5)

  if (suggestions.length === 0) return null

  return (
    <div className="border-t border-dashed border-slate-200 bg-white px-4 py-4 sm:px-6">
      <p className="mb-2.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Suggested questions
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((question) => (
          <button
            key={question}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(question)}
            className="chip text-xs disabled:cursor-not-allowed disabled:opacity-60"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}
