-- Row-Level Security policies — run after schema.sql.
-- Single-clinic app, so policies are role-based (client vs staff) rather
-- than tenant-scoped.

create function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  );
$$;

alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.subscription_tiers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.loyalty_transactions enable row level security;
alter table public.crm_notes enable row level security;
alter table public.contact_messages enable row level security;

-- profiles
create policy "profiles_select_own_or_staff" on public.profiles
  for select using (id = auth.uid() or public.is_staff());
create policy "profiles_update_own_or_staff" on public.profiles
  for update using (id = auth.uid() or public.is_staff());

-- pets
create policy "pets_all_owner_or_staff" on public.pets
  for all using (owner_id = auth.uid() or public.is_staff())
  with check (owner_id = auth.uid() or public.is_staff());

-- service_categories / services / subscription_tiers: public read, staff write
create policy "service_categories_public_read" on public.service_categories
  for select using (true);
create policy "service_categories_staff_write" on public.service_categories
  for insert with check (public.is_staff());
create policy "service_categories_staff_update" on public.service_categories
  for update using (public.is_staff());
create policy "service_categories_staff_delete" on public.service_categories
  for delete using (public.is_staff());

create policy "services_public_read" on public.services
  for select using (true);
create policy "services_staff_write" on public.services
  for insert with check (public.is_staff());
create policy "services_staff_update" on public.services
  for update using (public.is_staff());
create policy "services_staff_delete" on public.services
  for delete using (public.is_staff());

create policy "subscription_tiers_public_read" on public.subscription_tiers
  for select using (true);
create policy "subscription_tiers_staff_write" on public.subscription_tiers
  for insert with check (public.is_staff());
create policy "subscription_tiers_staff_update" on public.subscription_tiers
  for update using (public.is_staff());

-- appointments: owner books/cancels their own, staff manage all.
-- (Column-level restrictions — e.g. clients can only cancel, not mark
-- "completed" or set amount_charged — are enforced in the app UI, not RLS.)
create policy "appointments_select_owner_or_staff" on public.appointments
  for select using (owner_id = auth.uid() or public.is_staff());
create policy "appointments_insert_owner_or_staff" on public.appointments
  for insert with check (owner_id = auth.uid() or public.is_staff());
create policy "appointments_update_owner_or_staff" on public.appointments
  for update using (owner_id = auth.uid() or public.is_staff());

-- subscriptions
create policy "subscriptions_select_owner_or_staff" on public.subscriptions
  for select using (owner_id = auth.uid() or public.is_staff());
create policy "subscriptions_insert_owner_or_staff" on public.subscriptions
  for insert with check (owner_id = auth.uid() or public.is_staff());
create policy "subscriptions_update_owner_or_staff" on public.subscriptions
  for update using (owner_id = auth.uid() or public.is_staff());

-- loyalty_transactions: members can read their own history and redeem their
-- own points; "earn" rows are only ever written by the trigger (security
-- definer, bypasses RLS) or by staff.
create policy "loyalty_select_owner_or_staff" on public.loyalty_transactions
  for select using (owner_id = auth.uid() or public.is_staff());
create policy "loyalty_insert_redeem_own_or_staff" on public.loyalty_transactions
  for insert with check (
    (owner_id = auth.uid() and type = 'redeem') or public.is_staff()
  );

-- crm_notes: staff-only, clients never see internal notes about themselves.
create policy "crm_notes_staff_only" on public.crm_notes
  for all using (public.is_staff())
  with check (public.is_staff());

-- contact_messages: anyone (including anonymous visitors) can submit the
-- public contact form; only staff can read submissions.
create policy "contact_messages_insert_public" on public.contact_messages
  for insert with check (true);
create policy "contact_messages_select_staff" on public.contact_messages
  for select using (public.is_staff());
