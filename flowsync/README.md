# FlowSync

**Work With Your Flow, Not Against It.**

A cycle-aware productivity and wellness web app. FlowSync takes a woman's menstrual cycle phase, her daily wellness check-in, and her task list, and answers one question: *what should I actually spend my energy on today?*

Rather than asking users to grind at a constant rate and feel guilty when they can't, FlowSync plans the day around the energy they actually have.

> **Not a medical product.** No diagnosis, no fertility prediction, no clinical advice. Cycle phase is used purely as a productivity signal.

---

## Table of contents

- [The core idea](#the-core-idea)
- [The math](#the-math) — capacity score, cycle phase, task ordering
- [Where AI fits (and where it deliberately doesn't)](#where-ai-fits-and-where-it-deliberately-doesnt)
- [Screens](#screens)
- [Architecture](#architecture)
- [Data model](#data-model)
- [Getting started](#getting-started)
- [Design system](#design-system)
- [Project status](#project-status)

---

## The core idea

Three inputs, one output.

| Input | Where it comes from |
|---|---|
| **Cycle phase** | Last period date + average cycle length, computed on the fly |
| **Daily capacity** | A 30-second check-in: energy, focus, stress, mood, sleep |
| **Workload** | The user's own task list, each task tagged with a difficulty |

Out of that comes a **capacity score**, a **day type**, and a **task order** — plus a nudge from **MiniMe**, the companion character who delivers the recommendation in plain language.

The guiding principle: **capacity is a number, phase is a nudge.** Phase never changes the score. It only changes what we suggest doing with it.

---

## The math

All of this is **deterministic and rules-based**. No AI, no model call, no randomness. A user must be able to ask "why did you tell me that?" and get a real answer.

The definition lives in exactly two places, which mirror each other and must be changed together:

- [`src/supabase/backend.sql`](src/supabase/backend.sql) + [`002_schema_alignment.sql`](src/supabase/002_schema_alignment.sql) — the Postgres functions
- [`src/utils/capacity.ts`](src/utils/capacity.ts) and [`src/utils/cycle.ts`](src/utils/cycle.ts) — the client mirror

### 1. Daily capacity score

The check-in collects five values, **each on a 1–5 scale**:

| Input | Direction |
|---|---|
| Energy | higher raises capacity |
| Focus | higher raises capacity |
| Mood | higher raises capacity |
| Sleep quality | higher raises capacity |
| **Stress** | **higher *lowers* capacity** — it's the only negative term |

```
raw        = energy + focus + mood + sleep_quality − stress     → range −1 … 19
percentage = ((raw + 1) / 20) × 100                             → range  0 … 100
```

The raw score bottoms out at −1 (all four positives at 1, stress at 5) and tops out at 19 (all four positives at 5, stress at 1). The `+1` shift maps that cleanly onto 0–100.

### 2. Day type

| Capacity | Day type | What we surface |
|---|---|---|
| **≥ 70** | High Energy Day | Hard tasks, creative work, important decisions |
| **40 – 69** | Balanced Day | Medium tasks, planning, collaboration |
| **< 40** | Low Energy Day | Easy tasks, admin, recovery |

### 3. Cycle day and phase

Cycle day is **1-indexed and wraps** within the user's own cycle length — day 1 is the first day of the period, and someone 46 days past their last period on a 28-day cycle is on day 19, not day 47.

```
cycle_day = ((today − last_period) mod cycle_length) + 1
position  = (cycle_day − 1) / cycle_length          → a fraction, 0 … 1
```

Phase boundaries are expressed as **fractions of the cycle, not fixed day counts**, so a 35-day cycle stretches every phase proportionally instead of squashing everything into a 28-day template.

| Phase | Position in cycle | The nudge |
|---|---|---|
| **Menstrual** 🌙 | 0 – 5/28 | Reflection, planning, lighter tasks |
| **Follicular** 🌱 | 5/28 – 13/28 | Start new projects, think creatively |
| **Ovulation** ☀️ | 13/28 – 16/28 | Communication and collaboration |
| **Luteal** 🍂 | 16/28 – end | Finish things, detail work |

Valid cycle lengths are **15–60 days**. Anything outside that is rejected at both the UI and the database.

### 4. Task ordering

Each task carries a difficulty: **Easy (1), Medium (2), Hard (3)**.

| Day type | Order |
|---|---|
| High Energy | **Hardest first** — spend the peak on what actually needs it |
| Low Energy | **Easiest first** — build momentum, don't set yourself up to fail |
| Balanced | **The user's own manual order** — we have no strong opinion, so don't override theirs |

Ties break on the user's manual drag-and-drop `position`. This function always returns a valid ordering, which is what makes the AI layer safe to add on top.

---

## Where AI fits (and where it deliberately doesn't)

**AI is advisory, never authoritative.** The rules engine above produces a complete, correct result on its own. If the AI is slow, wrong, unavailable, or refuses, the user still gets a working app — they just get the rules-based answer instead.

The provider is **[OpenRouter](https://openrouter.ai)**, which lets us swap the underlying model without touching application code.

### What the AI is for

| Surface | What it does |
|---|---|
| **Task ordering** | Re-ranks the rules-based order using context the rules can't see — deadlines, what the user actually finished last week, how they've reacted to past suggestions |
| **Autocomplete** | Suggests task titles, categories, and difficulty as the user types. Rendered as tappable ghost-text; one tap completes the field |
| **Nudges** | Contextual MiniMe messages that go beyond the fixed rules-based string |

### What the AI is **not** for

The **capacity score** and the **cycle phase**. Those must be reproducible, auditable, and explainable. A number a user's day depends on should not vary between runs.

### The correction loop

When a suggestion misses, the user isn't stuck with it. A second button lets them **bundle extra context** and re-ask. That retry is recorded as a *new* `ai_requests` row whose `retry_of` points at the answer they rejected, with their added context in `extra_context`. That chain — what we suggested, what they rejected, what they had to tell us — is the most valuable training signal in the system.

### Per-user context

`ai_context` is the model's memory of one specific person: preferences, observed patterns, goals, constraints. Every entry carries a `confidence` score, so a weak inference can decay rather than harden into a "fact". It's read before every call and written after.

Isolation is enforced **by the database, not by application trust**: every AI table is under row-level security keyed to `auth.uid()`, so a call acting for user A physically cannot read user B's context, even if the Edge Function has a bug.

### ⚠️ The API key must never reach the browser

This is a Vite SPA. **Everything Vite bundles is readable by the user** — there is no such thing as a secret in this codebase. An OpenRouter key in the frontend is a public key, and anyone can open devtools and drain the account.

So all AI calls route through a **Supabase Edge Function**:

```
Browser ──(user's JWT)──▶ Edge Function ──(OpenRouter key)──▶ OpenRouter ──▶ model
                                │
                                └── reads/writes ai_* tables under the caller's RLS
```

The `VITE_` prefix is the tell. If a value is prefixed `VITE_`, it is public. The OpenRouter key and the Supabase **service-role** key are never `VITE_`-prefixed and never live in this app.

---

## Screens

| # | Screen | Route |
|---|---|---|
| 1 | Landing | `/` |
| 2 | Sign up / Log in | `/signup`, `/login` |
| 3 | Onboarding — welcome (MiniMe intro) | `/onboarding/welcome` |
| 4 | Onboarding — last period date | `/onboarding/cycle` |
| 5 | Onboarding — cycle length (21/28/35/custom) | `/onboarding/cycle-length` |
| 6 | Onboarding — productivity style | `/onboarding/style` |
| 7 | Dashboard — phase, capacity, today's focus | `/app/dashboard` |
| 8 | Tasks — add, filter, drag to reorder | `/app/tasks` |
| 9 | Daily check-in | `/app/checkin` |
| 10 | Evening reflection | `/app/summary` |
| 11 | Insights | `/app/insights` |
| 12 | Notifications | `/app/notifications` |
| 13 | Profile / settings | `/app/profile` |

Everything under `/app/*` is wrapped in an adaptive shell: a **left sidebar on desktop**, a **bottom tab bar in the thumb zone on mobile**.

---

## Architecture

```
React 19 + TypeScript + Vite + Tailwind + react-router v7
                    │
                    ├── src/utils/       the deterministic math (capacity, cycle)
                    ├── src/services/    Supabase client, AI client
                    ├── src/types/       domain types, mirroring the schema
                    │
                    ▼
         Supabase (Postgres + Auth + RLS)
                    │
                    └── Edge Function ──▶ OpenRouter
```

| Layer | Choice |
|---|---|
| UI | React 19, Tailwind 3, react-icons |
| Routing | react-router v7 |
| Charts | Recharts |
| Drag & drop | dnd-kit |
| Dates | date-fns |
| Backend | Supabase — Postgres, Auth, row-level security |
| AI | OpenRouter, called from a Supabase Edge Function |

> **Note:** the written spec says Next.js; the repo is **Vite**. Vite is what's actually here and what builds. Treat the spec as out of date on this point.

---

## Data model

Migrations live in [`src/supabase/`](src/supabase/) and are applied **in order** in the Supabase SQL Editor:

| File | What it does |
|---|---|
| `backend.sql` | Base schema — profiles, cycle profiles, check-ins, scores, tasks, recommendations, feedback, notifications. RLS, triggers, helper functions, views. |
| `002_schema_alignment.sql` | Security fix on the views; wraps `calculate_cycle_day`; adds task difficulty/category/ordering; adds profile name + productivity styles; realigns the feedback enum. |
| `003_ai_layer.sql` | `ai_context`, `ai_suggestions`, `ai_requests` + the effectiveness view. |

Every table is **row-level-security scoped to `auth.uid()`**. All views are created `with (security_invoker = on)` — without it, a Postgres view runs as its *owner* and silently bypasses the RLS on its underlying tables, which would let any logged-in user read everyone else's data.

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in your Supabase URL + anon key
npm run dev
```

Then, in the Supabase SQL Editor, run `backend.sql` → `002_schema_alignment.sql` → `003_ai_layer.sql`, in that order.

| Script | |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck + production build |
| `npm run lint` | Oxlint |
| `npm run preview` | Serve the production build locally |

The Supabase **anon key is public by design** — RLS is what protects the data, not the key.

---

## Design system

Tokens live in [`tailwind.config.js`](tailwind.config.js). Hex mirrors for SVG and Recharts (which can't take class names) live in [`src/constants/colors.ts`](src/constants/colors.ts).

| Token | Use |
|---|---|
| `brand` `#6554E8` | The **only** violet. Primary actions, active states. |
| `brand-dark` / `brand-light` / `brand-soft` / `brand-deep` | Hover, gradients, tinted surfaces, deep contrast blocks |
| `sand` `#F7F6F5` | Page background. `sand-field` for inputs, `sand-deep` for recessed panels |
| `mint` / `blush` | Accent surfaces. Each has an `ink` variant — the text colour that passes contrast **on** that surface |
| `phase-*` | Cycle phase colours: follicular 🟢, ovulation 🟠, luteal 🟣, menstrual 🩷 |

**Never introduce a raw hex in a class name.** If a colour is worth using, it's worth a token — otherwise the palette drifts (the app previously carried five competing violets and six near-identical creams).

---

## Project status

**Working:** the full UI across all 13 screens, responsive from mobile to desktop; the deterministic capacity and cycle math; the complete database schema with RLS.

**Not yet wired:** auth, persistence (screens still hold local state and some placeholder data), and the AI Edge Function. The tables and types are ready for all three.

### Roadmap

Auth + persistence → the AI Edge Function on OpenRouter → the correction loop → real insights from real history. Later: predictive forecasting, smart scheduling, wearable integration, mobile.
