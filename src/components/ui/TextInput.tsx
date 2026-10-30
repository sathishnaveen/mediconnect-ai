import { cn } from '../../lib/utils'

interface TextInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  name?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  autoComplete?: string
  disabled?: boolean
  textarea?: boolean
  rows?: number
  maxLength?: number
}

export function TextInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  name,
  placeholder,
  error,
  hint,
  required = false,
  autoComplete,
  disabled = false,
  textarea = false,
  rows = 5,
  maxLength,
}: TextInputProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  const classes = cn('field-input', error && 'field-input-error')

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name ?? id}
          rows={rows}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={cn(classes, 'resize-y')}
        />
      ) : (
        <input
          id={id}
          name={name ?? id}
          type={type}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={classes}
        />
      )}
      {error ? (
        <p id={`${id}-error`} role="alert" className="field-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
