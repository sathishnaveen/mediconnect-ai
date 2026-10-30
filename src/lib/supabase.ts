import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const looksReal = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-'),
)

export const isSupabaseConfigured: boolean = looksReal

export const supabase: SupabaseClient | null = looksReal
  ? createClient(String(supabaseUrl), String(supabaseAnonKey))
  : null
