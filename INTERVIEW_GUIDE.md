# INTERVIEW_GUIDE.md - How to present MediConnect AI

Everything you need to talk about the project confidently in an interview, plus a 2-minute video
script.

---

## 1. The 30-second pitch

> "MediConnect AI is a full-stack healthcare website where patients can search a directory of
> doctors, ask an AI clinic assistant questions 24/7, and book an appointment in four steps.
> The technical highlight is honesty by design: the chatbot only ever calls a live AI model when a
> server-side API key exists - otherwise it serves FAQ answers clearly labelled 'Demo answer
> (no AI)'. The same principle applies to storage: Supabase when it is configured, an explicitly
> labelled browser-only demo mode when it is not. It ships with 36 passing tests, zero lint
> errors and a strict TypeScript build."

---

## 2. Project architecture

```
                        ┌──────────────────────────────────────────┐
                        │              BROWSER (React SPA)         │
                        │                                          │
                        │  Pages: Home · AI Assistant · Doctors ·  │
                        │         Book · About · Contact · 404     │
                        │  Components: layout / ui / chat /         │
                        │              appointment / home           │
                        │  Services: chatService · appointment-     │
                        │            Service · contact · doctor     │
                        │  State: hooks (useChat) + React state     │
                        │  Storage: localStorage = demo fallback    │
                        └───────┬───────────────────────┬──────────┘
                                │ POST /api/chat        │ supabase-js (optional)
                                │ GET  /api/health      │ anon key + RLS
                        ┌───────▼───────────┐   ┌───────▼──────────────────────┐
                        │  Vite dev server   │   │  SUPABASE (free tier)        │
                        │  proxy /api → 3001 │   │  doctors / appointments /    │
                        └───────┬───────────┘   │  contact_messages + policies │
                                │               └──────────────────────────────┘
                        ┌───────▼───────────────────────────────┐
                        │  server/index.js  (Node, 0 deps)      │
                        │  - loads .env (key never leaves here) │
                        │  - system prompt + safety rules       │
                        │  - sanitise, truncate, rate limit     │
                        │  - mode: "ai" | "demo"                │
                        └───────┬───────────────────────────────┘
                                │ HTTPS (server-side only)
                        ┌───────▼──────────────┐
                        │ Groq / OpenAI API    │
                        └──────────────────────┘

   shared/knowledge.json  ── used by BOTH the server (demo answers, system prompt facts)
                             and the browser (offline fallback, FAQ page content)
```

**Key decision:** one JSON knowledge file shared by server and client means demo answers and live
AI facts can never drift apart.

---

## 3. Feature-to-requirement map

| Requirement | Where it lives |
| --- | --- |
| Professional hero + nav + services + featured doctors + CTA + AI section | `src/components/home/*` |
| Chatbot with history, input, send | `src/pages/ChatPage.tsx`, `src/hooks/useChat.ts` |
| Doctor cards, specialties, search, filter | `src/pages/DoctorsPage.tsx`, `src/components/DoctorCard.tsx` |
| Booking: doctor, date, slots, name/email, validation, confirmation | `src/pages/BookAppointmentPage.tsx`, `src/components/appointment/*` |
| About + Contact with validation and demo mode | `src/pages/AboutPage.tsx`, `src/pages/ContactPage.tsx` |
| Secure AI integration, no key in frontend | `server/index.js`, `vite.config.ts` proxy |
| Demo mode disclosure | `Badge`/`Alert` on chat, booking and contact pages |
| Medical disclaimer + emergency guidance | Chat banner, home AI section, contact card, footer |
| Loading / empty / error states | Doctor skeleton, slot skeleton, chat typing + retry, empty states |
| README, `.env.example`, Git-ignored secrets | root files |
| Prompt log + interview guide | `AI_PROMPTS.md`, this file |

---

## 4. Technology choices and why

| Choice | Reason |
| --- | --- |
| **React + TypeScript (strict)** | Type safety caught real bugs (unused imports, unsafe env access) before runtime |
| **Vite** | Instant dev server, simple config, built-in env handling and proxy |
| **Tailwind 3.4 + tokens** | Consistent design system (brand palette, `.card`, `.btn-*`, `.field-*`) without a component library's weight |
| **React Router** | Declarative routes, `NavLink` for active states, `useSearchParams` for `?doctor=` and `?specialty=` deep links |
| **Dependency-free Node server** | Nothing to break in installation; pure `node:http` + native `fetch` |
| **Supabase (optional)** | Free Postgres + RLS, so the project shows a real backend without billing |
| **Vitest + Testing Library** | Same Vite pipeline, fast unit + DOM tests |
| **lucide-react** | Tree-shaken, consistent icon language |

---

## 5. How AI was used (three angles you can talk about)

1. **AI in the product** - a chatbot with a hard-bounded system prompt (clinic info only, no
   diagnosis, no prescriptions, forced emergency escalation), server-side key, per-IP rate limit,
   25s timeout, sanitised/truncated messages, and honest mode labelling.
2. **AI as a development assistant** - the build followed a prompt loop documented in
   `AI_PROMPTS.md`: scope → risk review → plan → code → test → debug, with explicit revisions.
3. **Prompt engineering decisions** - the system prompt was rewritten three times (role-only →
   rules list → short imperative rules under a safety heading with injected clinic facts) because
   long paragraph-style rules were being skipped.

**Model/provider:** Groq's free tier by default (`llama-3.3-70b-versatile`), OpenAI-compatible so
`AI_BASE_URL`/`AI_MODEL` can swap providers without code changes.

---

## 6. Challenges, solutions, and what I learned

| Challenge | Solution | Lesson |
| --- | --- | --- |
| API key must not reach the browser | Node proxy on `/api/chat`, `VITE_`-prefix rule documented | Secret handling is a architecture decision, not a `.gitignore` line |
| Demo replies could look like real AI | `mode` field on every response + three distinct badges | Trust features are product features |
| Supabase may not be configured | Runtime detection + localStorage fallback + visible warning | Every optional integration needs a designed fallback |
| Double-booking a slot | Server-free check in `createAppointment` + slot grey-out + friendly error | Validate at every layer, not just the UI |
| npm crashed installing vitest (`edgesOut`) | Installed vitest 4 with `--legacy-peer-deps`, then audited to 0 vulnerabilities | Have ranked workarounds, not one hope |
| Tests failing on Node 20.18 (`ERR_REQUIRE_ESM`) | Version-detecting `--experimental-require-module` in Vitest `execArgv` | Fix it *automatically* so other machines work too |
| Broken Retry button on the slot grid | Added `slotsReloadKey` so the effect re-runs | Same-value `setState` never re-triggers an effect |
| Curly apostrophe broke `tsc` with 30+ errors | One-character fix | Error counts can mislead - read the first error |

---

## 7. Limitations (say these before the interviewer does)

1. **Not a medical device.** The assistant gives general clinic information only; it cannot
   triage, diagnose or prescribe, and it is not HIPAA/GDPR certified.
2. **Demo data.** Doctors, ratings, reviews, addresses and fees are fictional and labelled as such.
3. **Demo mode storage** (no Supabase): appointments live in `localStorage` - device-only, lost
   when site data is cleared, no notifications, no auth, no multi-user view.
4. **RLS trade-off:** the anon key can insert/read bookings so the page can grey out taken slots.
   Production would move that to a server-side Edge Function.
5. **No payments, login or email delivery** - out of scope for the assessment.
6. **Rate limiting is per-process and in memory** - fine for a demo, not for horizontal scaling.
7. **Tests are unit/component level**; there is no deployed end-to-end environment in this repo.

---

## 8. Testing report (honest)

| Check | Command | Result |
| --- | --- | --- |
| Type check + production build | `npm run build` | ✅ passes (`tsc --noEmit` + Vite) |
| Lint | `npm run lint` | ✅ 0 errors, 0 warnings |
| Unit + component tests | `npm test` | ✅ 36/36 passing (5 files) |
| Dependency audit | `npm audit` | ✅ 0 vulnerabilities |
| HTTP smoke test of all routes | dev server + HTTP requests | ✅ 6/6 routes return 200 with app shell |
| Chat API: health + demo reply | HTTP POST to `/api/chat` | ✅ returns `mode: "demo"` + FAQ answer |
| Chat API: validation + rate limit | HTTP edge cases | ✅ 400 on bad body, 429 over the limit |
| Live AI model reply | needs your own API key | ⚠️ not executed here - add `AI_API_KEY` to verify |
| Supabase persistence | needs your project credentials | ⚠️ not executed here - run `supabase/schema.sql` |
| Real-browser visual/interaction testing (click-through, responsive breakpoints) | browser automation tools | ❌ not available in this environment - verified via HTTP + component tests instead |

---

## 9. How to explain the project in an interview

**Structure your answer in four beats:**

1. **What it is (20s)** - patient-facing clinic website: find a doctor → ask the assistant → book.
2. **How it's built (40s)** - React/TS/Vite/Tailwind SPA; optional Supabase; a small Node AI proxy
   that owns the API key; one shared JSON knowledge file for both demo and live answers.
3. **The interesting problem (60s)** - honest AI: mode labelling, safety-bounded system prompt,
   rate limits, and designed fallbacks for missing credentials (demo mode everywhere).
4. **Proof (30s)** - 36 tests, zero lint, strict build, README + `.env.example` + prompt log.

**If asked "what would you do next?":** Edge Functions for writes, auth for patients, email/SMS
confirmations, payment for private bookings, analytics on unanswered questions to grow content,
and Playwright E2E + accessibility audits.

---

## 10. Likely questions and suggested answers

**Q: Where is the API key?**
Only in `server/index.js` process memory, loaded from `.env`. The browser calls `/api/chat`, which
Vite proxies. `.env` is git-ignored; only `.env.example` (with empty values) is committed.

**Q: What happens if OpenAI/Groq is down?**
The server catches the failure (including the 25s timeout) and returns a demo answer with a
`warning` field; the UI shows an amber note. The chat never silently pretends a model replied.

**Q: How do you stop it giving medical advice?**
Layered: a system prompt with hard rules, a rule that any emergency-sounding message gets the
exact "call 911" line, a permanent on-screen disclaimer, and a built-in FAQ answer that refuses
prescription requests (covered by a test).

**Q: Why is demo mode even a feature?**
Because the interviewers' environment won't have my credentials. A designed, labelled fallback
means the product is always demonstrable - and honest about what is real.

**Q: How would you scale it?**
Stateless frontend on a CDN, AI proxy on a container with a shared Redis rate limiter, Supabase
for data with server-side writes, and a queue for confirmation emails.

**Q: Test coverage?**
36 deterministic tests: validation rules, FAQ matching (including refusals), booking persistence
and double-booking guards, date rules (no Sundays), plus component tests for the doctor card and
the contact form's error and success paths.

---

## 11. Two-minute video presentation script

*Target time: ~1:55. Speak slowly; show the screen as marked.*

---

**[0:00 - 0:20] Show home page, scroll the hero**

"Hi, this is MediConnect AI - a healthcare website where patients can find a doctor, ask an AI
assistant about the clinic, and book an appointment in under a minute. It's built with React,
TypeScript, Vite and Tailwind CSS, and it runs locally with just two commands: `npm install`
and `npm run dev`."

**[0:20 - 0:45] Click *Find a Doctor*: type in search, click a specialty chip**

"Here's the doctor directory - eight sample specialists, clearly marked as demo content. Search
updates live, specialty chips filter instantly, and you can sort by rating or experience. Notice
the loading skeletons and the empty state with a clear-filters button - every state is designed,
not left blank."

**[0:45 - 1:15] Click *AI Assistant*: send a question, show the badge and disclaimer**

"This is the AI assistant. The important part isn't the chat UI - it's honesty. Each reply is
labelled: *AI-generated*, *Demo answer (no AI)* or *Offline sample*. The API key lives only in a
small Node server - the browser never sees it. Without a key, answers come from a built-in FAQ
and are explicitly labelled as samples; I never pretend a model wrote them. The safety rules
block diagnosis and prescriptions, and there's a permanent disclaimer pointing emergencies to 911."

**[1:15 - 1:45] Walk the booking flow: pick doctor → date → slot → details → confirm**

"Booking is a four-step flow: choose a doctor, pick an open date - Sundays and past slots are
blocked, and slots someone already took are greyed out - then validate your name and email,
confirm, and you get a reference number plus a downloadable calendar file. Without Supabase it
saves to your browser and says so on screen; add two environment variables and it writes to a real
Postgres database with row-level security."

**[1:45 - 1:55] Show terminal: lint, tests, build results**

"Quality checks: ESLint with zero warnings, 36 passing tests covering validation, booking
double-booking protection and chat safety answers, and a strict TypeScript build. Full docs are in
the README, with my prompt log in AI_PROMPTS.md. Thanks - happy to take questions."

---

### Filming tips

- Record the terminal checks **first** so the video never waits on a build.
- Keep the browser at 100% zoom in a single window; hide bookmarks bar.
- Show one failure state on purpose (empty search) - interviewers notice designed edge cases.
- Say "demo" whenever you touch sample data; it signals product judgement.
