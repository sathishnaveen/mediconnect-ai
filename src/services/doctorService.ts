import { doctors as demoDoctors } from '../data/doctors'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Doctor, StorageMode } from '../types'

export interface DoctorQueryResult {
  doctors: Doctor[]
  source: StorageMode
  warning?: string
}

interface DoctorRow {
  id: string
  name: string
  title: string
  specialty: string
  experience_years: number
  education: string
  bio: string
  rating: number
  reviews: number
  available_days: string[]
  languages: string[]
  location: string
  fee: number
  consultation_types: string[]
  featured: boolean
}

function mapRowToDoctor(row: DoctorRow): Doctor {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    specialty: row.specialty as Doctor['specialty'],
    experienceYears: row.experience_years,
    education: row.education,
    bio: row.bio,
    rating: row.rating,
    reviews: row.reviews,
    availableDays: row.available_days ?? [],
    languages: row.languages ?? [],
    location: row.location,
    fee: row.fee,
    consultationTypes: (row.consultation_types ?? []) as Doctor['consultationTypes'],
    featured: Boolean(row.featured),
  }
}

export async function fetchDoctors(): Promise<DoctorQueryResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { doctors: demoDoctors, source: 'demo' }
  }

  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('rating', { ascending: false })

  if (error || !data) {
    return {
      doctors: demoDoctors,
      source: 'demo',
      warning: `Could not load doctors from Supabase (${error?.message ?? 'no data'}). Showing the built-in demo profiles instead.`,
    }
  }

  const rows = data as unknown as DoctorRow[]
  if (rows.length === 0) {
    return {
      doctors: demoDoctors,
      source: 'demo',
      warning: 'Your Supabase doctors table is empty. Showing the built-in demo profiles instead.',
    }
  }

  return { doctors: rows.map(mapRowToDoctor), source: 'supabase' }
}
