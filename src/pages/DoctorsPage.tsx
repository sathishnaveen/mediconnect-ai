import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SearchX, SlidersHorizontal } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { fetchDoctors, type DoctorQueryResult } from '../services/doctorService'
import { specialties } from '../data/doctors'
import { DoctorCard, DoctorCardSkeleton } from '../components/DoctorCard'
import { Alert } from '../components/ui/Alert'
import { EmptyState } from '../components/ui/EmptyState'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'
import type { Doctor } from '../types'

type SortKey = 'rating' | 'experience' | 'name'

const filterOptions = ['All', ...specialties]

function sortDoctors(list: Doctor[], sort: SortKey): Doctor[] {
  const copy = [...list]
  if (sort === 'rating') return copy.sort((a, b) => b.rating - a.rating)
  if (sort === 'experience') return copy.sort((a, b) => b.experienceYears - a.experienceYears)
  return copy.sort((a, b) => a.name.localeCompare(b.name))
}

export function DoctorsPage() {
  useDocumentTitle('Find a Doctor | MediConnect AI')

  const [searchParams, setSearchParams] = useSearchParams()
  const specialty = searchParams.get('specialty') ?? 'All'

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('rating')
  const [result, setResult] = useState<DoctorQueryResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    fetchDoctors()
      .then((data) => {
        if (!active) return
        setResult(data)
        setLoadError(null)
      })
      .catch((error: unknown) => {
        if (!active) return
        setLoadError(
          error instanceof Error ? error.message : 'Could not load the doctor directory.',
        )
        setResult({ doctors: [], source: 'demo' })
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filteredDoctors = useMemo(() => {
    const list = result?.doctors ?? []
    const normalized = query.trim().toLowerCase()

    const matching = list.filter((doctor) => {
      const matchesSpecialty = specialty === 'All' || doctor.specialty === specialty
      const haystack = [
        doctor.name,
        doctor.title,
        doctor.specialty,
        doctor.bio,
        doctor.languages.join(' '),
        doctor.location,
      ]
        .join(' ')
        .toLowerCase()
      const matchesQuery = normalized.length === 0 || haystack.includes(normalized)
      return matchesSpecialty && matchesQuery
    })

    return sortDoctors(matching, sort)
  }, [result, query, specialty, sort])

  function selectSpecialty(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value === 'All') next.delete('specialty')
    else next.set('specialty', value)
    setSearchParams(next, { replace: true })
  }

  function clearFilters() {
    setQuery('')
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page py-12 sm:py-16">
          <div className="max-w-3xl">
            <p className="eyebrow">Doctor directory</p>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Find the right doctor for you
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Search by name, language or keyword, then filter by specialty. All profiles below are
              fictional <span className="font-semibold">demo content</span>.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <label htmlFor="doctor-search" className="sr-only">
                Search doctors by name, specialty or language
              </label>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="doctor-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search doctors, specialties, languages..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-card placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <label htmlFor="doctor-sort" className="sr-only">
                Sort doctors
              </label>
              <select
                id="doctor-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 shadow-card focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
              >
                <option value="rating">Sort: Top rated</option>
                <option value="experience">Sort: Most experienced</option>
                <option value="name">Sort: Name (A-Z)</option>
              </select>
            </div>
          </div>

          <div
            className="mt-5 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by specialty"
          >
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => selectSpecialty(option)}
                aria-pressed={specialty === option}
                className={cn('chip', specialty === option && 'chip-active')}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          {loadError ? (
            <div className="mb-6">
              <Alert tone="danger" title="Directory error" role="alert">
                {loadError}
              </Alert>
            </div>
          ) : null}

          {result?.warning ? (
            <div className="mb-6">
              <Alert tone="warning" title="Showing fallback data" role="status">
                {result.warning}
              </Alert>
            </div>
          ) : null}

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500" role="status">
              {loading
                ? 'Loading doctors...'
                : `Showing ${filteredDoctors.length} of ${
                    result?.doctors.length ?? 0
                  } doctors`}
            </p>
            <Badge tone={result?.source === 'supabase' ? 'info' : 'demo'}>
              {result?.source === 'supabase' ? 'Supabase data' : 'Demo profiles'}
            </Badge>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
            </div>
          ) : filteredDoctors.length === 0 ? (
            <EmptyState
              icon={<SearchX className="h-6 w-6" aria-hidden="true" />}
              title="No doctors match your search"
              description="Try a different keyword or clear the filters to see the full directory of demo doctors."
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Clear search &amp; filters
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
