import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ContactPage } from './ContactPage'
import { DoctorCard } from '../components/DoctorCard'
import { doctors } from '../data/doctors'

describe('DoctorCard', () => {
  it('shows the demo badge and both functional actions', () => {
    render(
      <MemoryRouter>
        <DoctorCard doctor={doctors[0]!} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Demo profile')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /book an appointment with dr\. aarav mehta/i }),
    ).toHaveAttribute('href', '/book?doctor=dr-aarav-mehta')
    expect(
      screen.getByRole('link', { name: /ask the ai assistant about booking/i }),
    ).toHaveAttribute('href', expect.stringContaining('/assistant?q='))
  })
})

describe('ContactPage form validation', () => {
  it('shows errors when submitting an empty form', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/please tell us your name/i)).toBeInTheDocument()
    expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument()
    expect(screen.getByText(/please choose a subject/i)).toBeInTheDocument()
    expect(screen.getByText(/please write a message/i)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/demo mode/i)
  })

  it('accepts a valid message and shows a confirmation', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/your name/i), 'Sam Carter')
    await user.type(screen.getByLabelText(/email address/i), 'sam@example.com')
    await user.selectOptions(screen.getByLabelText(/subject/i), 'general')
    await user.type(screen.getByLabelText(/message/i), 'Loved the booking flow on this site!')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    const success = await screen.findByText(/message recorded/i)
    const container = success.closest('[role="status"]')
    expect(container).toHaveTextContent(/saved only in this browser/i)
    expect(container).toHaveTextContent(/MSG-/)

    const form = screen.queryByLabelText(/your name/i)
    expect(form).not.toBeInTheDocument()
  })
})

describe('ContactPage emergency guidance', () => {
  it('tells visitors to call emergency services', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Medical emergency?')).toBeInTheDocument()
    expect(screen.getByText(/911 in the United States/)).toBeInTheDocument()
  })

  it('lists the demo clinic contact details', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )

    const details = screen.getByRole('heading', { name: /clinic details/i }).parentElement
    expect(details).toBeTruthy()
    expect(within(details as HTMLElement).getByText(/100 Wellness Avenue/i)).toBeInTheDocument()
  })
})
