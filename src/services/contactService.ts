import { readStorage, writeStorage } from '../lib/storage'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { createId } from '../lib/utils'
import type { ContactMessage, StorageMode } from '../types'

const STORAGE_KEY = 'mediconnect_contact_v1'

export interface ContactSubmission {
  id: string
  reference: string
  createdAt: string
}

export interface ContactResult {
  mode: StorageMode
  submission: ContactSubmission
  info: string
}

export async function submitContact(values: ContactMessage): Promise<ContactResult> {
  const reference = `MSG-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        reference,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        subject: values.subject,
        message: values.message.trim(),
        status: 'new',
      })
      .select()
      .single()

    if (error || !data) {
      throw new Error(
        `Could not send your message: ${
          error?.message ?? 'no row returned'
        }. Run supabase/schema.sql in the Supabase SQL editor, or clear the Supabase variables in .env to use demo mode.`,
      )
    }

    const row = data as { id: string; reference: string; created_at: string }
    return {
      mode: 'supabase',
      submission: { id: row.id, reference: row.reference, createdAt: row.created_at },
      info: 'Your message was saved in the clinic inbox (Supabase).',
    }
  }

  const submission: ContactSubmission = {
    id: createId(),
    reference,
    createdAt: new Date().toISOString(),
  }

  const existing = readStorage<ContactSubmission[]>(STORAGE_KEY, [])
  const next = [submission, ...(Array.isArray(existing) ? existing : [])].slice(0, 30)
  const saved = writeStorage(STORAGE_KEY, next)

  if (!saved) {
    throw new Error(
      'Your browser blocked local storage, so the message could not be saved. Enable site storage and try again.',
    )
  }

  return {
    mode: 'demo',
    submission,
    info: 'Demo mode: your message was saved only in this browser and was NOT delivered anywhere. Configure Supabase (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY) to deliver messages to a real inbox table.',
  }
}
