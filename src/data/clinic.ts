import type { ServiceItem } from '../types'

export const services: ServiceItem[] = [
  {
    id: 'general-checkup',
    title: 'General Health Check-up',
    description:
      'Routine screenings, vitals and personalised prevention plans from our general medicine team.',
    icon: 'stethoscope',
  },
  {
    id: 'cardiology',
    title: 'Cardiology Care',
    description:
      'ECG, echo reporting and long-term heart health management with senior consultants.',
    icon: 'heartPulse',
  },
  {
    id: 'telemedicine',
    title: 'Telemedicine Visits',
    description:
      'Secure video consultations for follow-ups and quick concerns - no travel required.',
    icon: 'video',
  },
  {
    id: 'diagnostics',
    title: 'Lab & Diagnostics',
    description:
      'On-site blood work, imaging and fast digital reports delivered to your patient portal.',
    icon: 'flask',
  },
  {
    id: 'pediatrics',
    title: 'Pediatric Wellness',
    description:
      'Vaccinations, growth tracking and friendly care designed specifically for children.',
    icon: 'baby',
  },
  {
    id: 'orthopedics',
    title: 'Bone & Joint Care',
    description:
      'Physiotherapy, sports injury recovery and joint pain programmes that get you moving again.',
    icon: 'bone',
  },
]

export const clinicStats = [
  { value: '8+', label: 'Specialist doctors' },
  { value: '25+', label: 'Combined years of care' },
  { value: '4.8', label: 'Average patient rating' },
  { value: '24/7', label: 'AI assistant answers' },
]

export const values = [
  {
    title: 'Patient-first design',
    description:
      'Every screen is built to reduce stress: clear language, large tap targets and no hidden steps.',
  },
  {
    title: 'Honest technology',
    description:
      'The AI assistant is labelled whenever it is in demo mode, and it never pretends to be a doctor.',
  },
  {
    title: 'Privacy by default',
    description:
      'We never ask for medical history in this demo - only a name, email and the slot you want.',
  },
  {
    title: 'Accessible for everyone',
    description:
      'Semantic HTML, keyboard navigation and responsive layouts from mobile to wide desktop.',
  },
]

export const team = [
  {
    name: 'Dr. Naomi Clarke',
    role: 'Medical Director',
    bio: 'Leads clinical standards and reviews the information our AI assistant is allowed to share.',
  },
  {
    name: 'Jordan Okafor',
    role: 'Head of Digital Health',
    bio: 'Designs the booking journey and makes sure patients never lose their place in a form.',
  },
  {
    name: 'Priyanka Iyer',
    role: 'Patient Experience Lead',
    bio: 'Trains the front desk team and keeps our response times short across every channel.',
  },
  {
    name: 'Sam Whitfield',
    role: 'Data & AI Ethics',
    bio: 'Audits prompts, safety guardrails and demo disclosures before anything ships.',
  },
]

export const timeline = [
  {
    year: '2019',
    title: 'A small clinic opens',
    description: 'MediConnect begins as a two-room family practice with paper appointment books.',
  },
  {
    year: '2022',
    title: 'Digital records arrive',
    description: 'Scheduling, lab reports and billing move online, cutting waiting times by a third.',
  },
  {
    year: '2025',
    title: 'AI assistant pilot',
    description: 'A guarded AI assistant starts answering routine clinic questions around the clock.',
  },
  {
    year: '2026',
    title: 'MediConnect AI',
    description: 'Doctor discovery, AI guidance and appointment booking come together in one website.',
  },
]
