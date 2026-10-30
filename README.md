# MediConnect AI

A complete, AI-powered healthcare website: explore doctors, get instant answers from an AI
clinic assistant, and book appointments online.

Built for the **AI Growth & Automation Associate** interview assessment with
**React + TypeScript + Vite + Tailwind CSS**, an optional **Supabase** backend and a
**secure server-side AI chatbot**.

> **Demo project.** All doctors, ratings, clinic addresses and appointments are fictional sample
> data. The chatbot never diagnoses conditions, never prescribes medication and always points
> emergencies to local emergency services (911 in the US).

---

## 1. Features

| Area | What works |
| --- | --- |
| Home page | Hero, service cards, featured doctors, AI assistant section, booking CTA |
| AI Healthcare Assistant | Chat UI, persistent chat history, quick suggestions, typing indicator, loading/error/retry states, live-AI vs demo labelling, medical disclaimer |
| Find a Doctor | 8 demo doctors, live search, specialty filter chips, sort (rating / experience / name), loading skeletons, empty state with "clear filters" |
| Book Appointment | 4-step flow: doctor → date & time → details → confirmation, availability checks, double-booking guard, form validation, confirmation screen, `.ics` calendar download |
| About Us | Mission, values, timeline, team, how it works |
| Contact | Validated contact form, demo-mode disclosure, clinic details, emergency guidance |
| Everywhere | Responsive (mobile/tablet/desktop), keyboard accessible, semantic HTML, skip link, consistent header/footer navigation, 404 page |

**Honesty rules built into the product**

- Chat replies are labelled `AI-generated`, `Demo answer (no AI)` or `Offline sample (no AI)`.
- Appointment and contact forms show whether they are using Supabase or local demo storage.
- Nothing claims to be a live AI model unless an API key is actually configured.

---

## 2. Tech stack

- **Frontend:** React 19, TypeScript (strict), Vite 6, React Router 7, lucide-react icons
- **Styling:** Tailwind CSS 3.4 with a custom design system (brand palette, cards, buttons, fields)
- **Backend / AI:** dependency-free Node HTTP server (`server/index.js`) that proxies chat
  requests to an OpenAI-compatible API. The API key stays on the server - never in the browser.
- **Database (optional):** Supabase (PostgreSQL + Row Level Security). Falls back to
  `localStorage` demo mode when not configured.
- **Quality:** ESLint 9 (flat config), Vitest 4 + Testing Library (36 tests), `tsc --noEmit` in the build.

---

## 3. Requirements

- **Node.js 18.18+** (Node 20.19+ or 22.12+ recommended) - check with `node -v`
- **npm 9+** - check with `npm -v`
- A normal Windows / macOS / Linux terminal

---

## 4. Quick start

```bash
# 1. install dependencies (first time only)
npm install

# 2. start frontend + AI server together
npm run dev
```

Then open **http://localhost:5173**

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the AI server (port 3001) **and** Vite dev server (port 5173) together |
| `npm run dev:client` | Frontend only |
| `npm run dev:server` | AI server only |
| `npm run build` | Type-checks (`tsc --noEmit`) and builds `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | ESLint over the whole project |
| `npm test` | Runs the Vitest test suite once |
| `npm run test:watch` | Runs tests in watch mode |

If port 5173 is busy, Vite automatically chooses the next free port (e.g. 5174) and prints the URL.

---

## 5. Environment variables (all optional)

Copy the example file to `.env`:

```bash
copy .env.example .env      # Windows
cp .env.example .env        # macOS / Linux
```

`.env` is git-ignored, so secrets are never committed. Restart `npm run dev` after editing it.

| Variable | Where it is used | Required? | Purpose |
| --- | --- | --- | --- |
| `AI_API_KEY` | AI server only | No | Enables **live AI** replies |
| `GROQ_API_KEY` | AI server only | No | Alternative key (auto-detected) |
| `OPENAI_API_KEY` | AI server only | No | Alternative key (auto-detected) |
| `AI_BASE_URL` | AI server only | No | Defaults to `https://api.groq.com/openai/v1` |
| `AI_MODEL` | AI server only | No | Defaults to `llama-3.3-70b-versatile` (Groq) or `gpt-4o-mini` (OpenAI) |
| `PORT` | AI server only | No | Defaults to `3001` |
| `VITE_SUPABASE_URL` | Browser | No | Supabase project URL → real database storage |
| `VITE_SUPABASE_ANON_KEY` | Browser | No | Supabase anon (public, RLS-protected) key |

**Why `VITE_` matters:** any variable starting with `VITE_` is bundled into the JavaScript that
the browser downloads. That is why AI keys must **never** use the `VITE_` prefix - they live only
in `server/index.js` process memory.

### 5a. Enabling live AI (free)

**Option A - Groq (recommended, free tier):**

1. Create a free account at <https://console.groq.com> → **API Keys** → create a key.
2. Put it in `.env` as `AI_API_KEY=your_key_here` (or `GROQ_API_KEY=`).
3. Restart `npm run dev`. The AI server prints `AI mode: LIVE`.

**Option B - OpenAI (paid):** set `OPENAI_API_KEY=sk-...` in `.env`.

**No key?** The chatbot still works in **demo mode**: replies come from the built-in FAQ file
(`shared/knowledge.json`), each reply is labelled `Demo answer (no AI)`, and the UI explains how
to enable real AI. Demo replies are never presented as model output.

### 5b. Enabling Supabase (free)

1. Create a free project at <https://supabase.com>.
2. Open **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.
   (This creates `doctors`, `appointments`, `contact_messages`, RLS policies and seeds 8 doctors.)
3. Open **Settings → API** and copy the **Project URL** and **anon public** key into `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart `npm run dev`. Badges switch from `Demo mode` to `Supabase`.

**Without Supabase:** appointments and contact messages are saved in your browser's
`localStorage`. Limitation: data is device/browser only, disappears if site data is cleared, is
not shared across devices, and nobody is notified. The UI says this explicitly.

---

## 6. Testing

```bash
npm run lint     # ESLint
npm test         # 36 unit + component tests (Vitest)
npm run build    # strict TypeScript check + production build
```

Current results (see `INTERVIEW_GUIDE.md` for the full report):

- ESLint: **0 errors, 0 warnings**
- Vitest: **36/36 tests passing** across 5 files
- `tsc --noEmit && vite build`: **passes**
- HTTP smoke tests of all six routes and the `/api` endpoints were run against the dev server

> On Node < 20.19 the test workers print an `ExperimentalWarning` about `require(ESM)`.
> `vite.config.ts` adds the required `--experimental-require-module` flag automatically.
> Upgrading Node removes the warning.

---

## 7. Project structure

```
mediconnect-ai/
├── index.html                 HTML shell, fonts, favicon
├── vite.config.ts             Vite + Vitest config, /api proxy, vendor chunking
├── tailwind.config.js         Custom brand palette, fonts, shadows, animations
├── eslint.config.js           ESLint 9 flat config (app + node scripts)
├── .env.example               Documented environment template
├── shared/knowledge.json      Single source of truth for clinic info + FAQ answers
├── server/index.js            Dependency-free AI proxy server (key stays server-side)
├── scripts/dev.js             Runs AI server + Vite together for `npm run dev`
├── supabase/schema.sql        Tables, RLS policies, demo doctor seed data
├── src/
│   ├── components/
│   │   ├── layout/            Header, Footer, Layout (skip link + shell)
│   │   ├── home/              Hero, services, featured doctors, AI section, CTA
│   │   ├── chat/              Message bubbles, composer, suggestion chips
│   │   ├── appointment/       Step indicator, doctor/date/details/confirmation steps
│   │   ├── ui/                Button, Alert, Badge, inputs, Avatar, EmptyState...
│   │   └── DoctorCard.tsx     Shared doctor card (+ skeleton)
│   ├── pages/                 Home, Chat, Doctors, Book, About, Contact, 404
│   ├── hooks/                 useChat, useDocumentTitle
│   ├── services/              chat / appointment / contact / doctor services
│   ├── lib/                   validation, dates, calendar (.ics), supabase, storage
│   ├── data/                  doctors, clinic content, time slots
│   └── test/setup.ts          Vitest + Testing Library setup
├── README.md
├── AI_PROMPTS.md              Prompt engineering log for the interview
└── INTERVIEW_GUIDE.md         Architecture, talking points, 2-minute video script
```

---

## 8. How the AI chatbot is wired (security)

```
Browser  --POST /api/chat-->  Vite proxy  -->  server/index.js  -->  Groq/OpenAI
   ^                              (no key)        ^ API key lives here only
   |                                                 |
   +-- <--- { mode: "ai" | "demo", reply, note } <---+
```

- The frontend never sees an API key; it only talks to `/api/chat`.
- The server enforces a system prompt with hard safety rules (no diagnosis, no prescriptions,
  emergency escalation), sanitises and truncates messages, applies a per-IP rate limit
  (30 requests/minute) and a 25s upstream timeout.
- If the key is missing **or** the upstream call fails, the server returns a clearly labelled
  demo answer instead of pretending the model replied.

---

## 9. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Dependencies are not installed yet` | Run `npm install` first |
| Chat replies say `Offline sample` | Start the AI server with `npm run dev` (not `dev:client` alone) |
| Port already in use | Note the new URL Vite prints, or stop the other process |
| `npm run dev` port conflicts on 3001 | Set `PORT=3002` in `.env` **and** update the proxy target in `vite.config.ts` |
| Supabase insert error | Run `supabase/schema.sql`, or remove the two `VITE_SUPABASE_*` lines to return to demo mode |
| Tests fail to start on old Node | Upgrade Node to 20.19+ / 22.12+ |
| Windows build cache issues | Delete `node_modules` and `.tsbuildinfo`, then `npm install` |

---

## 10. Deploying (free tiers)

The frontend is a static site; the AI server needs a Node host.

1. **Frontend** → Vercel / Netlify / GitHub Pages: build command `npm run build`, output `dist`.
2. **AI server** → Render / Railway / Fly.io free plan: start command `node server/index.js`,
   add `AI_API_KEY` (and `PORT`) in the host's environment settings.
3. Point the frontend at the deployed server by replacing the `/api` proxy in `vite.config.ts`
   with a `VITE_API_BASE_URL` fetch base.
4. **Supabase** is already hosted - just set the two `VITE_` variables in your host's env panel.

Never commit `.env`; add host-side secrets only in the hosting dashboard.
