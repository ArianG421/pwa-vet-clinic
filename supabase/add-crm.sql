-- Staff CRM: customer email visibility + lead tracking + outreach log.
-- Run after schema.sql, rls.sql, add-service-slug.sql (and seed.sql, if not
-- already run). Safe to re-run: uses if not exists / if exists guards.

-- profiles has no email today (it only lives in auth.users, which isn't
-- reachable from the client without a service-role key). Sync it via the
-- existing signup trigger instead of adding that key to the app.
alter table public.profiles add column if not exists email text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  return new;
end;
$$;

-- One-time backfill for profiles created before this migration.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

-- lead_status is NOT how someone becomes a lead (that's computed live from
-- inactivity / contact-form submission) — it's staff's working status on an
-- already-surfaced lead, so a handled one stops reappearing.
alter table public.profiles
  add column if not exists lead_status text not null default 'none'
  check (lead_status in ('none', 'contacted', 'converted', 'dismissed'));

alter table public.contact_messages
  add column if not exists lead_status text not null default 'none'
  check (lead_status in ('none', 'contacted', 'converted', 'dismissed'));

create policy "contact_messages_update_staff" on public.contact_messages
  for update using (public.is_staff());

create table if not exists public.crm_emails (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  contact_message_id uuid references public.contact_messages(id) on delete set null,
  to_email text not null,
  to_name text,
  subject text not null,
  body text not null,
  status text not null check (status in ('sent', 'failed')),
  error_message text,
  staff_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.crm_emails enable row level security;

create policy "crm_emails_staff_only" on public.crm_emails
  for all using (public.is_staff())
  with check (public.is_staff());
