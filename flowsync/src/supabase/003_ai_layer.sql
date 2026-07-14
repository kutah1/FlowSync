-- =====================================================================
-- 003 — AI layer
-- Run AFTER 002_schema_alignment.sql. Safe to re-run.
-- =====================================================================
-- The split, deliberately:
--   * The CAPACITY SCORE and CYCLE PHASE stay rules-based and deterministic
--     (backend.sql + 002). No AI. They must be reproducible and explainable.
--   * AI is used only for ORDERING tasks and for SUGGESTING text. It is
--     always advisory — the rules engine produces a valid ordering on its
--     own, and the AI result is stored alongside it, never instead of it.
--
-- Every table here is per-user and RLS-scoped. The AI must never see one
-- user's data while acting for another; that is enforced by the database,
-- not by application trust.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. AI CONTEXT — the per-individual memory.
--
-- Durable facts the assistant has learned about this specific user, so it
-- has context "across board" without re-deriving it every call. Written
-- by the Edge Function after a session; read on every AI call.
--
-- Keep entries SHORT and factual. Never store credentials here — rows are
-- replayed verbatim into future model context.
-- ---------------------------------------------------------------------
create table if not exists public.ai_context (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  kind         text not null check (kind in ('preference', 'pattern', 'goal', 'constraint')),
  content      text not null check (char_length(content) <= 2000),
  -- Confidence lets weak inferences decay instead of hardening into "facts".
  confidence   numeric(3,2) not null default 0.50 check (confidence between 0 and 1),
  source       text not null default 'inferred' check (source in ('inferred', 'stated')),
  last_used_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.ai_context is
  'Per-user memory the assistant reads before every call. "stated" = the user told us; "inferred" = we guessed from behaviour.';

create index if not exists idx_ai_context_user on public.ai_context (user_id, kind);


-- ---------------------------------------------------------------------
-- 2. AI SUGGESTIONS — the autocomplete surface.
--
-- The UI shows these as tappable ghost-text options. Tapping one completes
-- the field (accepted = true). Ignoring them is also signal (accepted =
-- false), which is how we learn when the AI is unhelpful.
--
-- `surface` says WHERE the suggestion appears, so one table serves task
-- autocomplete, category guesses, and reflection prompts.
-- ---------------------------------------------------------------------
create table if not exists public.ai_suggestions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  request_id   uuid,  -- FK added after ai_requests exists (below)
  surface      text not null check (surface in ('task_title', 'task_category', 'task_difficulty', 'reflection')),
  -- What the user had typed when we generated this (may be '').
  input_prefix text not null default '',
  suggestion   text not null,
  rank         integer not null default 0,
  accepted     boolean,
  responded_at timestamptz,
  created_at   timestamptz not null default now()
);

comment on table public.ai_suggestions is
  'Autocomplete-style options rendered in the UI. accepted: true = tapped, false = dismissed, null = no response yet.';

create index if not exists idx_ai_suggestions_user_surface
  on public.ai_suggestions (user_id, surface, created_at desc);


-- ---------------------------------------------------------------------
-- 3. AI REQUESTS — one row per model call.
--
-- Audit + cost tracking + the retry chain. When the first answer is wrong
-- and the user hits "give it more context", the retry is a NEW row whose
-- retry_of points at the original. That chain is the training signal for
-- what the model was missing.
-- ---------------------------------------------------------------------
create table if not exists public.ai_requests (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  purpose       text not null check (purpose in ('task_order', 'autocomplete', 'nudge')),
  -- OpenRouter model slug, e.g. 'anthropic/claude-sonnet-4.5'. Stored per row
  -- so we can swap models without losing the ability to compare their results.
  model         text not null,
  -- The user-supplied extra context from the "not quite right — here's more"
  -- button. Null on a first attempt.
  extra_context text,
  retry_of      uuid references public.ai_requests(id) on delete set null,
  status        text not null default 'pending' check (status in ('pending', 'ok', 'error', 'refused')),
  error_message text,
  input_tokens  integer,
  output_tokens integer,
  latency_ms    integer,
  created_at    timestamptz not null default now()
);

comment on table public.ai_requests is
  'One row per OpenRouter call. retry_of chains a re-ask to the answer the user rejected; extra_context is what they added.';
comment on column public.ai_requests.status is
  'refused = the model declined to answer, which is distinct from an error = transport/HTTP failure. Different recovery paths.';

create index if not exists idx_ai_requests_user  on public.ai_requests (user_id, created_at desc);
create index if not exists idx_ai_requests_retry on public.ai_requests (retry_of) where retry_of is not null;

-- Now that ai_requests exists, wire the suggestion -> request link.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ai_suggestions_request_fk') then
    alter table public.ai_suggestions
      add constraint ai_suggestions_request_fk
      foreign key (request_id) references public.ai_requests(id) on delete set null;
  end if;
end $$;


-- ---------------------------------------------------------------------
-- 4. updated_at trigger for ai_context (reuses the function from 001)
-- ---------------------------------------------------------------------
drop trigger if exists trg_ai_context_updated_at on public.ai_context;
create trigger trg_ai_context_updated_at
  before update on public.ai_context
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
--
-- Same per-user policy shape as 001. This is what guarantees the AI acting
-- for user A can never read user B's context, even if the Edge Function
-- has a bug — it queries with the caller's JWT, not the service key.
-- ---------------------------------------------------------------------
alter table public.ai_context     enable row level security;
alter table public.ai_suggestions enable row level security;
alter table public.ai_requests    enable row level security;

do $$
declare
  t text;
begin
  for t in select unnest(array['ai_context', 'ai_suggestions', 'ai_requests'])
  loop
    execute format('drop policy if exists "Users can select own rows" on public.%I;', t);
    execute format('create policy "Users can select own rows" on public.%I for select using (auth.uid() = user_id);', t);

    execute format('drop policy if exists "Users can insert own rows" on public.%I;', t);
    execute format('create policy "Users can insert own rows" on public.%I for insert with check (auth.uid() = user_id);', t);

    execute format('drop policy if exists "Users can update own rows" on public.%I;', t);
    execute format('create policy "Users can update own rows" on public.%I for update using (auth.uid() = user_id);', t);

    execute format('drop policy if exists "Users can delete own rows" on public.%I;', t);
    execute format('create policy "Users can delete own rows" on public.%I for delete using (auth.uid() = user_id);', t);
  end loop;
end $$;


-- ---------------------------------------------------------------------
-- 6. HELPER VIEW — how well is the AI actually doing, per user?
--
-- Answers "should we keep paying for this": acceptance rate on suggested
-- orderings and on autocomplete.
-- ---------------------------------------------------------------------
create or replace view public.v_ai_effectiveness
  with (security_invoker = on) as
select
  s.user_id,
  s.surface,
  count(*)                                        as shown,
  count(*) filter (where s.accepted is true)      as accepted,
  count(*) filter (where s.accepted is false)     as dismissed,
  round(
    100.0 * count(*) filter (where s.accepted is true)
    / nullif(count(*) filter (where s.accepted is not null), 0),
    1
  )                                               as accept_rate_pct
from public.ai_suggestions s
group by s.user_id, s.surface;

-- =====================================================================
-- END 003
-- =====================================================================
