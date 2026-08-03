-- Willowbrook Veterinary Clinic — core schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query) once,
-- before rls.sql and seed.sql.

create extension if not exists "pgcrypto";

-- profiles: one row per auth user, extends auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('client', 'staff')),
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up via magic link.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  species text not null,
  breed text,
  dob date,
  notes text,
  created_at timestamptz not null default now()
);

create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  sort_order int not null default 0
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.service_categories(id) on delete cascade,
  name text not null,
  description text,
  price_from numeric(10, 2) not null default 0,
  price_to numeric(10, 2) not null default 0,
  duration_minutes int not null default 30
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id),
  requested_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  amount_charged numeric(10, 2),
  notes text,
  created_at timestamptz not null default now()
);

create table public.subscription_tiers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_monthly numeric(10, 2) not null,
  tagline text,
  features jsonb not null default '[]'::jsonb,
  sort_order int not null default 0
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  tier_id uuid not null references public.subscription_tiers(id),
  status text not null default 'active' check (status in ('active', 'cancelled')),
  started_at timestamptz not null default now()
);

create table public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('earn', 'redeem')),
  points int not null check (points > 0),
  label text not null,
  detail text,
  appointment_id uuid references public.appointments(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Reject a redeem transaction if it would overdraw the member's points balance,
-- so the balance check happens in the database, not just in the UI.
create function public.enforce_loyalty_balance()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  current_balance int;
begin
  if new.type = 'redeem' then
    select coalesce(sum(case when type = 'earn' then points else -points end), 0)
      into current_balance
      from public.loyalty_transactions
      where owner_id = new.owner_id;

    if current_balance < new.points then
      raise exception 'Insufficient loyalty points: balance % is less than requested %', current_balance, new.points;
    end if;
  end if;
  return new;
end;
$$;

create trigger loyalty_balance_check
  before insert on public.loyalty_transactions
  for each row execute function public.enforce_loyalty_balance();

-- Automatically award points when staff mark an appointment completed with a
-- charged amount — 1 point per $1, mirroring the "How you earn points" copy
-- on the client portal.
create function public.award_points_on_completion()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'completed'
     and old.status is distinct from 'completed'
     and new.amount_charged is not null then
    insert into public.loyalty_transactions (owner_id, type, points, label, detail, appointment_id)
    values (
      new.owner_id,
      'earn',
      greatest(floor(new.amount_charged)::int, 0),
      (select name from public.services where id = new.service_id),
      'Visit completed',
      new.id
    );
  end if;
  return new;
end;
$$;

create trigger appointment_completed_award_points
  after update on public.appointments
  for each row execute function public.award_points_on_completion();

create table public.crm_notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete set null,
  staff_id uuid not null references public.profiles(id),
  note text not null,
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
