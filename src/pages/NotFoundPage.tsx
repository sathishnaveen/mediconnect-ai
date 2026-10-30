import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { Home, MessageSquare, Search } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found | MediConnect AI')
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="flex min-h-[70vh] items-center bg-slate-50">
      <div className="container-page py-16 text-center">
        <p className="font-display text-7xl font-extrabold text-brand-600 sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
          {notFound ? 'This page does not exist' : 'Something went wrong'}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
          The link may be outdated, or the page was moved. Try one of the options below to get back
          on track.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link to="/doctors" className="btn-secondary">
            <Search className="h-4 w-4" aria-hidden="true" />
            Find a doctor
          </Link>
          <Link to="/assistant" className="btn-secondary">
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Ask the AI assistant
          </Link>
        </div>
      </div>
    </div>
  )
}
