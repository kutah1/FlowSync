-- =====================================================================
-- 002 — Schema alignment + security fixes
-- Builds on backend.sql (001). Run AFTER backend.sql, in the Supabase
-- SQL Editor. Safe to re-run (idempotent).
-- =====================================================================
-- Fixes, in order:
--   A. RLS bypass on the v_* views (security_invoker)          [SECURITY]
--   B. calculate_cycle_day never wraps past the cycle length   [BUG]
--   C. tasks: no difficulty / category / ordering / time bucket
--   D. profiles: nowhere to store name or productivity styles
--   E. daily_feedback.day_rating enum didn't match the UI
--   F. task_recommendations: no model/version or accept signal
-- =====================================================================


-- ---------------------------------------------------------------------
-- A. SECURITY — make views honour the caller's RLS.
--
-- A Postgres view executes with its OWNER's privileges, so the RLS
-- policies on the underlying tables are evaluated as the owner, not the
-- caller. Without security_invoker, any authenticated user could select
-- from v_user_dashboard and read EVERY user's cycle day and capacity.
-- security_invoker = on (PG15+) makes the view run as the caller, so the
-- existing per-user policies apply.
-- ---------------------------------------------------------------------
alter view public.v_current_cycle          set (security_invoker = on);
alter view public.v_daily_summary          set (security_invoker = on);
alter view public.v_user_dashboard         set (security_invoker = on);
alter view public.v_productivity_insights  set (security_invoker = on);


-- ---------------------------------------------------------------------
-- B. BUG — cycle day must wrap within the cycle length.
--
-- The old version was (today - last_period) + 1 with no modulo, so a user
-- 46 days past their last period got "Day 47 of 28". It also disagreed
-- with calculate_cycle_phase, which already wrapped correctly.
--
-- Now: 1-indexed and wrapped. Cycle length must be > 0 (the UI's "Custom"
-- option used to be able to submit 0 — see CycleLength.tsx).
-- ---------------------------------------------------------------------
create or replace function public.calculate_cycle_day(
  p_today date,
  p_last_period_date date,
  p_average_cycle_length integer default 28
)
returns integer
language plpgsql
immutable
as $$
declare
  v_offset integer;
begin
  if p_average_cycle_length is null or p_average_cycle_length <= 0 then
    return null;
  end if;

  v_offset := mod((p_today - p_last_period_date), p_average_cycle_length);
  if v_offset < 0 then
    v_offset := v_offset + p_average_cycle_length;
  end if;

  return v_offset + 1;  -- 1-indexed: the first day of the period is Day 1
end;
$$;

-- The old 2-arg signature is now wrong (it can't wrap without the length).
-- Drop it so no caller can silently pick it up.
drop function if exists public.calculate_cycle_day(date, date);

-- v_current_cycle referenced the 2-arg form — rebuild it against the new one.
create or replace view public.v_current_cycle
  with (security_invoker = on) as
select
  cp.user_id,
  cp.last_period_date,
  cp.average_cycle_length,
  public.calculate_cycle_day(current_date, cp.last_period_date, cp.average_cycle_length)   as cycle_day,
  public.calculate_cycle_phase(current_date, cp.last_period_date, cp.average_cycle_length) as cycle_phase
from public.cycle_profiles cp;


-- ---------------------------------------------------------------------
-- C. TASKS — the recommendation engine sorts by difficulty, but the
--    column didn't exist. Category, manual ordering (drag-and-drop), and
--    the Day/Week/Month/Year bucket were all collected by the UI and had
--    nowhere to go either.
-- ---------------------------------------------------------------------
alter table public.tasks
  add column if not exists difficulty  text    not null default 'Medium',
  add column if not exists category    text,
  add column if not exists time_bucket text    not null default 'day',
  add column if not exists position    integer not null default 0;

comment on column public.tasks.difficulty  is 'Easy | Medium | Hard. Drives capacity-aware ordering: hard-first on a high-capacity day, easy-first on a low one.';
comment on column public.tasks.time_bucket is 'Cumulative horizon: a "day" task also appears under week/month/year.';
comment on column public.tasks.position    is 'User''s manual drag-and-drop order. Lower sorts first. Ties broken by created_at.';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'tasks_difficulty_check') then
    alter table public.tasks
      add constraint tasks_difficulty_check check (difficulty in ('Easy', 'Medium', 'Hard'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'tasks_time_bucket_check') then
    alter table public.tasks
      add constraint tasks_time_bucket_check check (time_bucket in ('day', 'week', 'month', 'year'));
  end if;
end $$;

create index if not exists idx_tasks_user_open
  on public.tasks (user_id, position, created_at)
  where is_completed = false;


-- ---------------------------------------------------------------------
-- D. PROFILES — signup collects a single "Name", and the Productivity
--    Style onboarding step (Work / School / Business / Creative /
--    Personal) had nowhere to be stored at all.
-- ---------------------------------------------------------------------
alter table public.profiles
  add column if not exists display_name       text,
  add column if not exists productivity_styles text[] not null default '{}';

comment on column public.profiles.display_name        is 'What the user typed at signup. first_name/last_name remain optional.';
comment on column public.profiles.productivity_styles is 'Onboarding step 3. Multi-select; MiniMe tailors suggestions to these.';

-- Backfill display_name for rows created before this migration.
update public.profiles
   set display_name = nullif(trim(coalesce(first_name, '') || ' ' || coalesce(last_name, '')), '')
 where display_name is null;


-- ---------------------------------------------------------------------
-- E. DAILY FEEDBACK — the enum was Great/Good/Okay/Bad/Terrible, but the
--    Daily Summary screen asks "how did today go vs. what you expected?"
--    That is the signal the recommendation engine actually needs: it
--    tells us whether the capacity score was too high or too low.
-- ---------------------------------------------------------------------
alter table public.daily_feedback
  drop constraint if exists daily_feedback_day_rating_check;

-- Migrate any existing rows onto the new vocabulary before re-constraining.
update public.daily_feedback
   set day_rating = case day_rating
                      when 'Great'    then 'better'
                      when 'Good'     then 'better'
                      when 'Okay'     then 'as_expected'
                      when 'Bad'      then 'harder'
                      when 'Terrible' then 'harder'
                      else day_rating
                    end
 where day_rating in ('Great', 'Good', 'Okay', 'Bad', 'Terrible');

alter table public.daily_feedback
  add constraint daily_feedback_day_rating_check
  check (day_rating in ('better', 'as_expected', 'harder'));

comment on column public.daily_feedback.day_rating is
  'How the day went vs. the predicted capacity: better | as_expected | harder. Feeds calibration of the capacity score.';


-- ---------------------------------------------------------------------
-- F. TASK RECOMMENDATIONS — record WHO produced an ordering and whether
--    the user accepted it. Without the accept signal there is no way for
--    the AI to learn an individual's preferences over time.
-- ---------------------------------------------------------------------
alter table public.task_recommendations
  add column if not exists source     text not null default 'rules',
  add column if not exists model      text,
  add column if not exists accepted   boolean,
  add column if not exists responded_at timestamptz;

comment on column public.task_recommendations.source   is 'rules | ai — which engine produced this ordering.';
comment on column public.task_recommendations.model    is 'Model id when source = ai (e.g. claude-opus-4-8). Null for rules.';
comment on column public.task_recommendations.accepted is 'Did the user keep this order? null = no response yet. The learning signal.';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'task_recs_source_check') then
    alter table public.task_recommendations
      add constraint task_recs_source_check check (source in ('rules', 'ai'));
  end if;
end $$;


-- ---------------------------------------------------------------------
-- G. CAPACITY — one canonical definition.
--
-- There were three competing formulas (this file's, MoodTracker.tsx's,
-- and the written spec's). This is now THE definition; src/utils/capacity.ts
-- mirrors it exactly and both must change together.
--
--   raw        = energy + focus + mood + sleep - stress      (range -1..19)
--   percentage = ((raw + 1) / 20) * 100                      (range  0..100)
--   category   = LOW < 40 <= MEDIUM < 70 <= HIGH
--
-- calculate_capacity_score / _percentage / _energy_category are unchanged
-- from backend.sql — restated here only so the thresholds are documented
-- in one place alongside the client mirror.
-- ---------------------------------------------------------------------
comment on function public.calculate_capacity_score(integer, integer, integer, integer, integer) is
  'CANONICAL. energy + focus + mood + sleep_quality - stress. Mirrored in src/utils/capacity.ts — change both together.';
comment on function public.calculate_energy_category(decimal) is
  'CANONICAL thresholds: LOW < 40, MEDIUM 40-69, HIGH >= 70. Mirrored in src/utils/capacity.ts.';

-- =====================================================================
-- END 002
-- =====================================================================
