-- =====================================================================
-- MiniMe MVP Database Schema
-- Target: Supabase (Postgres + Supabase Auth + RLS)
-- =====================================================================
-- Run this entire script once in the Supabase SQL Editor.
-- It is idempotent-ish (uses IF NOT EXISTS / DROP ... IF EXISTS where
-- sensible) but is intended for a fresh project / fresh schema setup.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. EXTENSIONS
-- ---------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. PROFILES
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  first_name             text,
  last_name              text,
  notification_enabled   boolean not null default true,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  deleted_at             timestamptz
);

comment on table public.profiles is 'One row per Supabase auth user. Soft-deletable.';

-- ---------------------------------------------------------------------
-- 2. CYCLE PROFILES
-- ---------------------------------------------------------------------
create table if not exists public.cycle_profiles (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  average_cycle_length   integer not null default 28 check (average_cycle_length between 15 and 60),
  last_period_date       date not null,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (user_id)
);

comment on table public.cycle_profiles is 'Tracks each user''s cycle length and last period start date.';

create index if not exists idx_cycle_profiles_user_id on public.cycle_profiles(user_id);

-- ---------------------------------------------------------------------
-- 3. DAILY CHECKINS
-- ---------------------------------------------------------------------
create table if not exists public.daily_checkins (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  checkin_date           date not null default current_date,
  energy                 integer not null check (energy between 1 and 5),
  focus                  integer not null check (focus between 1 and 5),
  mood                   integer not null check (mood between 1 and 5),
  sleep_quality          integer not null check (sleep_quality between 1 and 5),
  stress                 integer not null check (stress between 1 and 5),
  notes                  text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (user_id, checkin_date)
);

comment on table public.daily_checkins is 'One check-in per user per day. notes is an optional free-text journal entry.';

create index if not exists idx_daily_checkins_user_date on public.daily_checkins(user_id, checkin_date desc);

-- ---------------------------------------------------------------------
-- 4. DAILY SCORES
-- ---------------------------------------------------------------------
create table if not exists public.daily_scores (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  checkin_id             uuid references public.daily_checkins(id) on delete cascade,
  score_date             date not null default current_date,
  capacity_score         integer not null check (capacity_score between -1 and 19),
  capacity_percentage    decimal(5,2) not null check (capacity_percentage between 0 and 100),
  energy_category        text not null check (energy_category in ('LOW', 'MEDIUM', 'HIGH')),
  scoring_version         integer not null default 1,
  created_at             timestamptz not null default now(),
  unique (user_id, score_date)
);

comment on table public.daily_scores is 'Derived daily capacity score. scoring_version preserves historical accuracy when the formula changes.';

create index if not exists idx_daily_scores_user_date on public.daily_scores(user_id, score_date desc);

-- ---------------------------------------------------------------------
-- 5. RECOMMENDATIONS
-- ---------------------------------------------------------------------
create table if not exists public.recommendations (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  recommendation_date    date not null default current_date,
  recommendation_text    text not null,
  recommendation_type    text check (recommendation_type in ('Productivity', 'Recovery', 'Self Care')),
  cycle_phase            text check (cycle_phase in ('Menstrual', 'Follicular', 'Ovulation', 'Luteal')),
  rule_version           integer not null default 1,
  created_at             timestamptz not null default now()
);

comment on table public.recommendations is 'Generated lifestyle/wellness recommendations. rule_version protects historical data as rules evolve.';

create index if not exists idx_recommendations_user_date on public.recommendations(user_id, recommendation_date desc);

-- ---------------------------------------------------------------------
-- 6. TASKS
-- ---------------------------------------------------------------------
create table if not exists public.tasks (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  title                  text not null,
  description            text,
  estimated_duration     integer check (estimated_duration > 0), -- minutes
  is_completed           boolean not null default false,
  due_date               date,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table public.tasks is 'User-created tasks. estimated_duration (minutes) lets capacity-aware recommendations suggest right-sized work.';

create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_user_due on public.tasks(user_id, due_date);

-- ---------------------------------------------------------------------
-- 7. TASK RECOMMENDATIONS
-- ---------------------------------------------------------------------
create table if not exists public.task_recommendations (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  task_id                uuid not null references public.tasks(id) on delete cascade,
  recommendation_date    date not null default current_date,
  priority_rank          integer,
  reason                 text,
  recommendation_version integer not null default 1,
  created_at             timestamptz not null default now()
);

comment on table public.task_recommendations is 'Which tasks were suggested to a user on a given day, and why. Versioned for historical consistency.';

create index if not exists idx_task_recs_user_date on public.task_recommendations(user_id, recommendation_date desc);
create index if not exists idx_task_recs_task_id on public.task_recommendations(task_id);

-- ---------------------------------------------------------------------
-- 8. DAILY FEEDBACK
-- ---------------------------------------------------------------------
create table if not exists public.daily_feedback (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  feedback_date          date not null default current_date,
  day_rating             text check (day_rating in ('Great', 'Good', 'Okay', 'Bad', 'Terrible')),
  recommendation_helpful boolean,
  feedback_notes         text,
  created_at             timestamptz not null default now(),
  unique (user_id, feedback_date)
);

comment on table public.daily_feedback is 'End-of-day feedback loop. feedback_notes captures qualitative product feedback.';

create index if not exists idx_daily_feedback_user_date on public.daily_feedback(user_id, feedback_date desc);

-- ---------------------------------------------------------------------
-- 9. NOTIFICATIONS
-- ---------------------------------------------------------------------
create table if not exists public.notifications (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  title                  text not null,
  message                text not null,
  type                   text not null check (type in ('Reminder', 'Recommendation', 'System')),
  is_read                boolean not null default false,
  scheduled_for          timestamptz,
  sent_at                timestamptz,
  created_at             timestamptz not null default now()
);

comment on table public.notifications is 'In-app notification history, supports unread badges and future push scheduling.';

create index if not exists idx_notifications_user_id on public.notifications(user_id, created_at desc);
create index if not exists idx_notifications_unread on public.notifications(user_id) where is_read = false;

-- =====================================================================
-- AUTOMATIC updated_at TRIGGER
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_cycle_profiles_updated_at on public.cycle_profiles;
create trigger trg_cycle_profiles_updated_at
  before update on public.cycle_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_daily_checkins_updated_at on public.daily_checkins;
create trigger trg_daily_checkins_updated_at
  before update on public.daily_checkins
  for each row execute function public.set_updated_at();

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- =====================================================================
-- HELPER FUNCTIONS
-- =====================================================================

-- ---------------------------------------------------------------------
-- Cycle day: days elapsed since last period (1-indexed)
-- ---------------------------------------------------------------------
create or replace function public.calculate_cycle_day(
  p_today date,
  p_last_period_date date
)
returns integer
language sql
immutable
as $$
  select (p_today - p_last_period_date) + 1;
$$;

-- ---------------------------------------------------------------------
-- Cycle phase: proportional to average_cycle_length, not fixed to 28 days
-- Phase boundaries (as fraction of cycle): Menstrual 0-5/28, Follicular
-- 5/28-13/28, Ovulation 13/28-16/28, Luteal 16/28-end.
-- ---------------------------------------------------------------------
create or replace function public.calculate_cycle_phase(
  p_today date,
  p_last_period_date date,
  p_average_cycle_length integer default 28
)
returns text
language plpgsql
immutable
as $$
declare
  v_cycle_day integer;
  v_position  numeric;
begin
  v_cycle_day := mod((p_today - p_last_period_date), p_average_cycle_length);
  if v_cycle_day < 0 then
    v_cycle_day := v_cycle_day + p_average_cycle_length;
  end if;

  v_position := v_cycle_day::numeric / p_average_cycle_length;

  if v_position < (5.0 / 28) then
    return 'Menstrual';
  elsif v_position < (13.0 / 28) then
    return 'Follicular';
  elsif v_position < (16.0 / 28) then
    return 'Ovulation';
  else
    return 'Luteal';
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- Capacity score (raw, -1 to 19) and normalized percentage (0-100)
-- Raw = Energy + Focus + Mood + Sleep Quality - Stress
-- Percentage = ((Raw + 1) / 20) * 100
-- ---------------------------------------------------------------------
create or replace function public.calculate_capacity_score(
  p_energy integer,
  p_focus integer,
  p_mood integer,
  p_sleep_quality integer,
  p_stress integer
)
returns integer
language sql
immutable
as $$
  select p_energy + p_focus + p_mood + p_sleep_quality - p_stress;
$$;

create or replace function public.calculate_capacity_percentage(
  p_capacity_score integer
)
returns decimal
language sql
immutable
as $$
  select round(((p_capacity_score + 1)::decimal / 20) * 100, 2);
$$;

-- ---------------------------------------------------------------------
-- Energy category from percentage
-- ---------------------------------------------------------------------
create or replace function public.calculate_energy_category(
  p_capacity_percentage decimal
)
returns text
language sql
immutable
as $$
  select case
    when p_capacity_percentage < 40 then 'LOW'
    when p_capacity_percentage < 70 then 'MEDIUM'
    else 'HIGH'
  end;
$$;

-- =====================================================================
-- VIEWS
-- =====================================================================

-- ---------------------------------------------------------------------
-- Current cycle status per user
-- ---------------------------------------------------------------------
create or replace view public.v_current_cycle as
select
  cp.user_id,
  cp.last_period_date,
  cp.average_cycle_length,
  public.calculate_cycle_day(current_date, cp.last_period_date)            as cycle_day,
  public.calculate_cycle_phase(current_date, cp.last_period_date, cp.average_cycle_length) as cycle_phase
from public.cycle_profiles cp;

-- ---------------------------------------------------------------------
-- Daily summary: checkin + score + cycle phase for a given day
-- ---------------------------------------------------------------------
create or replace view public.v_daily_summary as
select
  dc.user_id,
  dc.checkin_date,
  dc.energy,
  dc.focus,
  dc.mood,
  dc.sleep_quality,
  dc.stress,
  dc.notes,
  ds.capacity_score,
  ds.capacity_percentage,
  ds.energy_category,
  cp.average_cycle_length,
  public.calculate_cycle_phase(dc.checkin_date, cp.last_period_date, cp.average_cycle_length) as cycle_phase
from public.daily_checkins dc
left join public.daily_scores ds
  on ds.user_id = dc.user_id and ds.checkin_id = dc.id
left join public.cycle_profiles cp
  on cp.user_id = dc.user_id;

-- ---------------------------------------------------------------------
-- User dashboard: latest profile, cycle, and score snapshot
-- ---------------------------------------------------------------------
create or replace view public.v_user_dashboard as
select
  p.id                         as user_id,
  p.first_name,
  p.last_name,
  cc.cycle_day,
  cc.cycle_phase,
  ds.capacity_percentage       as latest_capacity_percentage,
  ds.energy_category           as latest_energy_category,
  ds.score_date                as latest_score_date
from public.profiles p
left join public.v_current_cycle cc on cc.user_id = p.id
left join lateral (
  select capacity_percentage, energy_category, score_date
  from public.daily_scores
  where user_id = p.id
  order by score_date desc
  limit 1
) ds on true
where p.deleted_at is null;

-- ---------------------------------------------------------------------
-- Productivity insights: helpful-recommendation rate and task completion
-- ---------------------------------------------------------------------
create or replace view public.v_productivity_insights as
select
  user_id,
  count(*) filter (where recommendation_helpful is true)  as helpful_count,
  count(*) filter (where recommendation_helpful is false) as not_helpful_count,
  count(*)                                                as total_feedback
from public.daily_feedback
group by user_id;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles             enable row level security;
alter table public.cycle_profiles       enable row level security;
alter table public.daily_checkins       enable row level security;
alter table public.daily_scores         enable row level security;
alter table public.recommendations      enable row level security;
alter table public.tasks                enable row level security;
alter table public.task_recommendations enable row level security;
alter table public.daily_feedback       enable row level security;
alter table public.notifications        enable row level security;

-- profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- generic per-table policies (user_id based)
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'cycle_profiles', 'daily_checkins', 'daily_scores', 'recommendations',
    'tasks', 'task_recommendations', 'daily_feedback', 'notifications'
  ])
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

-- =====================================================================
-- AUTO-CREATE PROFILE ON SIGNUP (optional but recommended)
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, created_at, updated_at)
  values (new.id, now(), now())
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- SEED DATA (sample, safe to remove)
-- =====================================================================
-- NOTE: This assumes a user already exists in auth.users.
-- Replace the UUID below with a real auth.users.id from your project
-- before running this section, or comment it out entirely.
--
-- insert into public.cycle_profiles (user_id, average_cycle_length, last_period_date)
-- values ('00000000-0000-0000-0000-000000000000', 28, current_date - 10);
--
-- insert into public.daily_checkins (user_id, checkin_date, energy, focus, mood, sleep_quality, stress, notes)
-- values ('00000000-0000-0000-0000-000000000000', current_date, 4, 3, 4, 3, 2, 'Had an exam today.');
--
-- insert into public.tasks (user_id, title, estimated_duration)
-- values
--   ('00000000-0000-0000-0000-000000000000', 'Write project proposal', 180),
--   ('00000000-0000-0000-0000-000000000000', 'Reply to emails', 15);

-- =====================================================================
-- END OF SCRIPT
-- =====================================================================

