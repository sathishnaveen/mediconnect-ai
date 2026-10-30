export type Specialty =
  | 'Cardiology'
  | 'Dermatology'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'Neurology'
  | 'General Medicine'
  | 'Gynecology'
  | 'Physiotherapy'

export interface Doctor {
  id: string
  name: string
  title: string
  specialty: Specialty
  experienceYears: number
  education: string
  bio: string
  rating: number
  reviews: number
  availableDays: string[]
  languages: string[]
  location: string
  fee: number
  consultationTypes: ('In-person' | 'Video')[]
  featured: boolean
}

export type ChatRole = 'user' | 'assistant'

export type ChatMode = 'ai' | 'demo' | 'offline' | 'unknown'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  mode?: ChatMode
  note?: string
  warning?: string
  createdAt: number
}

export interface Appointment {
  id: string
  reference: string
  doctorId: string
  doctorName: string
  specialty: Specialty
  date: string
  time: string
  patientName: string
  patientEmail: string
  status: 'confirmed'
  createdAt: string
}

export interface BookingDraft {
  doctorId: string
  date: string
  time: string
  patientName: string
  patientEmail: string
}

export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

export type StorageMode = 'supabase' | 'demo'

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon: 'stethoscope' | 'heartPulse' | 'video' | 'flask' | 'baby' | 'bone'
}
