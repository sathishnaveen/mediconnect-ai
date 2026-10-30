-- ============================================================================
-- MediConnect AI - Supabase schema
-- Run this file in: Supabase Dashboard -> SQL Editor -> New query -> Run
--
-- It creates three tables, enables Row Level Security (RLS) and seeds the
-- demo doctors so the website can load doctors from your database.
-- Everything here uses the free Supabase tier.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. doctors (optional - the site falls back to built-in demo profiles)
-- ----------------------------------------------------------------------------
create table if not exists public.doctors (
  id text primary key,
  name text not null,
  title text not null,
  specialty text not null,
  experience_years integer not null default 0,
  education text not null default '',
  bio text not null default '',
  rating numeric not null default 0,
  reviews integer not null default 0,
  available_days text[] not null default '{}',
  languages text[] not null default '{}',
  location text not null default '',
  fee numeric not null default 0,
  consultation_types text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. appointments (used by the Book Appointment page)
-- ----------------------------------------------------------------------------
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  doctor_id text not null,
  doctor_name text not null,
  specialty text not null,
  appointment_date date not null,
  appointment_time text not null,
  patient_name text not null,
  patient_email text not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create index if not exists appointments_doctor_date_idx
  on public.appointments (doctor_id, appointment_date);

create index if not exists appointments_email_idx
  on public.appointments (patient_email);

-- ----------------------------------------------------------------------------
-- 3. contact_messages (used by the Contact page)
-- ----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- NOTE for interviews / production: allowing the public anon role to read
-- appointments is needed so the booking page can grey out taken slots.
-- A production system would replace the SELECT with a server-side Edge
-- Function or a SQL function that only returns appointment_time.
-- ----------------------------------------------------------------------------
alter table public.doctors enable row level security;
alter table public.appointments enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "anon_read_doctors" on public.doctors;
create policy "anon_read_doctors"
  on public.doctors for select
  to anon
  using (true);

drop policy if exists "anon_read_appointments" on public.appointments;
create policy "anon_read_appointments"
  on public.appointments for select
  to anon
  using (status = 'confirmed');

drop policy if exists "anon_insert_appointments" on public.appointments;
create policy "anon_insert_appointments"
  on public.appointments for insert
  to anon
  with check (status = 'confirmed' and length(patient_email) > 3);

drop policy if exists "anon_insert_contact" on public.contact_messages;
create policy "anon_insert_contact"
  on public.contact_messages for insert
  to anon
  with check (length(message) >= 10);

-- ----------------------------------------------------------------------------
-- Seed the 8 demo doctors (safe to re-run)
-- ----------------------------------------------------------------------------
insert into public.doctors
  (id, name, title, specialty, experience_years, education, bio, rating, reviews,
   available_days, languages, location, fee, consultation_types, featured)
values
  ('dr-aarav-mehta', 'Dr. Aarav Mehta', 'Senior Consultant Cardiologist', 'Cardiology', 18,
   'MD, DM (Cardiology)',
   'Focuses on preventive cardiology, hypertension management and post-operative heart care, with a strong interest in patient education.',
   4.9, 214, array['Mon','Tue','Thu','Fri'], array['English','Hindi'],
   'Room 204, Heart Centre', 90, array['In-person','Video'], true),

  ('dr-sofia-ramirez', 'Dr. Sofia Ramirez', 'Consultant Dermatologist', 'Dermatology', 11,
   'MD (Dermatology & Venereology)',
   'Treats chronic skin conditions, hair and nail disorders, and offers evidence-based skincare plans for all age groups.',
   4.8, 167, array['Mon','Wed','Fri','Sat'], array['English','Spanish'],
   'Room 110, Skin Clinic', 70, array['In-person','Video'], true),

  ('dr-ethan-brooks', 'Dr. Ethan Brooks', 'Consultant Pediatrician', 'Pediatrics', 14,
   'MD (Pediatrics)',
   'Cares for newborns, children and adolescents - vaccination schedules, growth monitoring and childhood allergies.',
   4.9, 198, array['Tue','Wed','Thu','Sat'], array['English'],
   'Room 105, Child Centre', 65, array['In-person','Video'], true),

  ('dr-priya-nair', 'Dr. Priya Nair', 'Consultant Orthopedic Surgeon', 'Orthopedics', 16,
   'MS (Orthopedics)',
   'Handles sports injuries, joint pain and rehabilitation planning, with a conservative-first approach to surgery.',
   4.7, 142, array['Mon','Tue','Thu','Sat'], array['English','Malayalam'],
   'Room 302, Bone & Joint Centre', 85, array['In-person'], false),

  ('dr-marcus-lindqvist', 'Dr. Marcus Lindqvist', 'Consultant Neurologist', 'Neurology', 21,
   'MD, DM (Neurology)',
   'Experienced in headache and migraine care, sleep disorders and long-term neurological follow-up.',
   4.8, 121, array['Wed','Thu','Fri'], array['English','Swedish'],
   'Room 408, Neuro Centre', 95, array['In-person','Video'], false),

  ('dr-hana-yamamoto', 'Dr. Hana Yamamoto', 'General Medicine Physician', 'General Medicine', 9,
   'MBBS, MD (General Medicine)',
   'First point of contact for everyday health concerns, annual check-ups and coordinating specialist referrals.',
   4.6, 236, array['Mon','Tue','Wed','Thu','Fri'], array['English','Japanese'],
   'Room 101, OPD', 45, array['In-person','Video'], false),

  ('dr-elena-petrova', 'Dr. Elena Petrova', 'Consultant Gynecologist', 'Gynecology', 13,
   'MS (Obstetrics & Gynecology)',
   'Supports women''s health at every stage - routine screenings, prenatal care and family planning consultations.',
   4.8, 158, array['Mon','Wed','Fri','Sat'], array['English','Russian'],
   'Room 208, Women''s Centre', 80, array['In-person','Video'], false),

  ('dr-omar-haddad', 'Dr. Omar Haddad', 'Senior Physiotherapist', 'Physiotherapy', 10,
   'MPT (Musculoskeletal)',
   'Designs recovery programmes for back pain, posture correction and post-injury return to activity.',
   4.7, 96, array['Tue','Thu','Fri','Sat'], array['English','Arabic'],
   'Room G02, Rehab Studio', 55, array['In-person'], false)

on conflict (id) do update set
  name = excluded.name,
  title = excluded.title,
  specialty = excluded.specialty,
  experience_years = excluded.experience_years,
  education = excluded.education,
  bio = excluded.bio,
  rating = excluded.rating,
  reviews = excluded.reviews,
  available_days = excluded.available_days,
  languages = excluded.languages,
  location = excluded.location,
  fee = excluded.fee,
  consultation_types = excluded.consultation_types,
  featured = excluded.featured;
