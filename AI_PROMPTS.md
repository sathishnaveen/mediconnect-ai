# AI_PROMPTS.md - Prompt Engineering Log

**Project:** MediConnect AI
**Purpose:** Interview submission - documents how AI prompting was used to plan, build, test and
debug the project, and how each revision improved the result.

Every stage below follows the same pattern: **Initial prompt → Revision → Why the revision was
better → Result**. Prompts are reproduced as they were given to the AI coding assistant.

---

## Stage 1 - Project planning

### Initial prompt

> "I want to build an AI-powered healthcare website for a job interview. It should have doctors,
> an AI chatbot and appointment booking. What should I build?"

**Problem with this prompt:** vague, no constraints, no success criteria. The answer was a generic
list of ideas with no way to judge whether the result was good enough.

### Revision 1

> "Act as a senior full-stack developer. I must submit a healthcare website for an AI Growth &
> Automation Associate interview. Scope it precisely:
> - 6 pages: Home, AI Assistant, Find a Doctor, Book Appointment, About, Contact
> - Stack: React + TypeScript + Vite + Tailwind, optional Supabase
> - Chatbot must never diagnose or prescribe and must be honest about demo vs live AI
> - Everything must run with `npm install && npm run dev` on Windows
> Return a file-by-file build plan with dependencies, ordered steps, and a definition of done."

**Why better:** role, audience, constraints, hard limits and an explicit deliverable format.
**Result:** a concrete file map (pages, components, services, server, shared knowledge file) and a
definition of done that later became the acceptance checklist.

### Revision 2 (risk-first)

> "Before writing code, list the risks of this project: exposed API keys, fake-looking demo data,
> broken buttons, unvalidated forms, Supabase not configured. For each risk, give the technical
> mitigation you would implement."

**Why better:** switching from *what to build* to *what can go wrong* surfaced the honesty
requirements (demo labelling), the server-side key proxy and the localStorage fallback - the three
features that differentiate this project.

**Result:** the mode badges (`AI-generated` / `Demo answer (no AI)`), `server/index.js` proxy, and
the "demo mode" notices on booking and contact pages.

---

## Stage 2 - Website generation (UI/UX)

### Initial prompt

> "Make a modern healthcare website in blue and white with a hero, navigation and cards."

**Problem:** "modern" is subjective; the output risked looking like a generic template.

### Revision 1

> "Design MediConnect AI as a premium healthcare product, not a template:
> - Palette: brand blue (#2563eb) + white + slate neutrals, one accent for warnings
> - Type: Plus Jakarta Sans for headings, Inter for body, clear scale (14/16/20/36/48/60px)
> - Components: sticky translucent header, card system with soft shadows, chip filters,
>   gradient hero with a floating chat-preview card, full-width CTA banner, 4-column footer
> - Every page must show loading, empty and error states
> - Fully responsive at 360px, 768px and 1440px, keyboard accessible, semantic HTML
> Return Tailwind classes and component props, not generic advice."

**Why better:** gave concrete tokens (colors, type scale, breakpoints) and named the states that
had to exist, so the design could be reviewed objectively.

### Revision 2 (accessibility + honesty pass)

> "Review the design for accessibility and trust: label every form input with a real `<label>`,
> add a skip-to-content link, use `aria-current` on navigation, `role='alert'` on errors,
> `aria-live` on the chat log, and visually mark all fictional doctor data as demo content."

**Result:** the accessibility layer you see in the code (labels, `aria-describedby`, live regions,
focus rings) plus `Demo profile` badges and the "sample data" notices.

---

## Stage 3 - Chatbot development

### Initial prompt

> "Add a chatbot that answers healthcare questions using an AI API."

**Problem:** no safety rules, no fallback, no key handling - exactly the kind of prompt that
leaks secrets or produces dangerous output.

### Revision 1 (product requirements)

> "Build the chatbot as a *clinic information assistant*, not a medical AI:
> - Answers ONLY: services, specialties, hours, location, fees, telemedicine, booking steps
> - Never diagnoses, never prescribes, never claims to be a doctor
> - Escalates anything emergency-sounding to 'call 911 / nearest ER'
> - API key lives in a Node server; the browser only calls `/api/chat`
> - If no key is configured, return FAQ answers and label them 'Demo answer (no AI)'
> - Show a medical disclaimer above the chat and label every message by mode
> Return the system prompt, endpoint contract and fallback behaviour."

**Why better:** defined behaviour, failure modes and labelling - not just "use an AI API".

### Revision 2 (system prompt iteration)

The system prompt shipped in `server/index.js` went through three rounds:

1. *First draft:* "You are a helpful healthcare AI." → **rejected**: invited diagnosis.
2. *Second draft:* added a rules list → **better**, but rules were buried in a long paragraph.
3. *Final:* short imperative rules, labelled `HARD SAFETY RULES`, clinic facts injected
   programmatically from `shared/knowledge.json`, and a required emergency line.

> "Compress this system prompt to short imperative rules, put safety rules under their own
> heading, inject clinic facts from a JSON file instead of hard-coding them, and force the model
> to include the exact emergency sentence when a request sounds urgent. Keep it under ~250 words
> so it costs little per request."

**Why better:** shorter prompts follow instructions more reliably, structured sections reduce
rule-skipping, and moving clinic facts to JSON created one source of truth used by both the
server demo mode and the frontend.

**Result:** the final system prompt with `CLINIC FACTS` and `Appointment booking steps` injected
at runtime; the same JSON powers the offline FAQ matcher.

### Revision 3 (evaluation prompt)

> "Write 10 test questions for this assistant covering: services, booking, hours, scope limits,
> prescriptions, emergencies and nonsense input. For each, state the expected behaviour and
> whether a demo reply must be labelled."

**Result:** the FAQ keyword set and the expectations mirrored in `src/lib/knowledge.test.ts`
(e.g. "Can you prescribe medicine?" must map to the refusal answer).

---

## Stage 4 - Appointment booking

### Initial prompt

> "Let users book appointments with a doctor, a date and a time."

### Revision 1 (flow + failure modes)

> "Design the booking flow as a 4-step wizard: doctor → date/time → details → confirmation.
> Requirements:
> - auto-select the next open date, block Sundays, disable past slots and slots already booked
> - block double-booking the same doctor/date/time with a clear error
> - validate name and email inline with `aria-invalid` + `aria-describedby`
> - store in Supabase when configured, otherwise localStorage with an explicit demo-mode warning
> - never ask for medical data; show a confirmation screen with a reference number and a
>   downloadable `.ics` calendar file
> - loading, empty and error states for the slot grid
> Return the state machine and the service function signatures first."

**Why better:** produced a state machine before UI, which prevented half-finished states (e.g.
the empty "select a date" state and the slot-retry path).

### Revision 2

> "What can go wrong in this flow that would embarrass me in an interview?"

**Answer (implemented):** empty-slot UI with no data, a stale slot another user booked, blocked
localStorage, Supabase table missing, and a "Retry" button that does nothing. Each has a real
error message today - the last one was caught during testing and fixed by adding a
`slotsReloadKey` that re-runs the slot query.

---

## Stage 5 - Testing

### Initial prompt

> "Write tests for the project."

### Revision 1

> "Write tests that would fail if the important behaviour broke, not tests that just render:
> 1. form validation (empty and valid contact/booking forms)
> 2. demo FAQ matching, including the 'can you prescribe medicine?' refusal
> 3. appointment service: stores a booking, reports booked slots, blocks double booking
> 4. date helpers: Sundays are never offered
> 5. a component test asserting the DoctorCard links point to the right routes
> Keep them fast and deterministic - no network."

**Why better:** tests tied to acceptance criteria instead of coverage numbers.
**Result:** 36 tests, all passing, none touching the network.

### Revision 2 (after failures)

> "Two tests failed: one asserted a weekday I assumed, one used a text query that matched twice.
> Are these bugs in the app or in the tests? Explain, then fix only the tests."

**Result:** confirmed the app logic was correct (Nov 1 2026 really is a Sunday; the DOM really
contains two matching nodes) and tightened the assertions instead of weakening the app.

---

## Stage 6 - Debugging (real issues from this build)

| # | What happened | Prompt used | Why the prompt worked |
| --- | --- | --- | --- |
| 1 | `tsc` failed with 30+ syntax errors from one line | "Build fails at `src/data/doctors.ts(113)`. Give me the smallest possible fix and explain why the error count was misleading." | Asking for the *smallest* fix avoided rewriting a file that was 99% correct (a curly apostrophe inside a single-quoted string). |
| 2 | `npm install` crashed: `Cannot read properties of null (reading 'edgesOut')` | "npm arborist throws `edgesOut` while installing vitest. What is the real cause and give me ranked workarounds that don't break the project." | Ranked, low-risk options led to installing vitest 4 with `--legacy-peer-deps` instead of `--force`. |
| 3 | Vitest printed `test.poolOptions was removed in Vitest 4` | "Vitest 4 removed poolOptions. Find where `execArgv` lives now - read the installed package source, don't guess from blog posts." | Telling the AI to read the *installed* source produced the correct answer (`test.execArgv`) from `node_modules/vitest`. |
| 4 | Tests crashed: `require() of ES Module @csstools/css-calc not supported` | "jsdom dependency fails with ERR_REQUIRE_ESM on Node 20.18. Give me a fix that works automatically for other people too - no manual environment variables." | The "no manual env vars" constraint produced the version-detecting `execArgv` in `vite.config.ts`. |
| 5 | Chat "Retry" button did nothing | "Review the booking slot retry path. Does `setDate(sameValue)` re-run the effect? If not, propose the minimal fix." | Asking a yes/no question about a suspected bug made verification fast and the fix minimal. |

**Pattern used for every debugging prompt:** *symptom → exact error text → what I already tried →
constraint on the fix → ask for the smallest change.*

---

## Prompt principles I would take into the role

1. **State constraints before asking for code** - platform, budget, honesty rules and "must run
   with these two commands" remove most bad outputs.
2. **Ask for a plan and a definition of done first** - reviewing a plan is cheaper than
   reviewing 40 files.
3. **Ask "what can go wrong"** - this produced the demo-mode disclosures, which are the most
   interview-relevant feature of the project.
4. **Iterate prompts in the same thread with an explicit reason for the change** - the system
   prompt improved three times only because each revision named *why* the previous one failed.
5. **Make the AI honest about testing** - "tell me exactly which tests ran and which could not be
   performed" prevents inflated claims.
6. **Prefer "read the installed source" over "what is the current best practice"** when debugging
   against fast-moving tools (Vitest 4, ESLint 9).
