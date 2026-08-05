-- Owner profile details (name/face/contact info) + avatar photo storage.
-- Run after add-crm.sql. Safe to re-run: uses if not exists guards.

alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists emergency_contact_name text;
alter table public.profiles add column if not exists emergency_contact_phone text;
alter table public.profiles add column if not exists preferred_contact text
  not null default 'email' check (preferred_contact in ('email', 'phone', 'sms'));

-- Public bucket so avatar <img> tags can load without a signed URL; write
-- access is still locked down below to the owner (or staff) only.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

-- Files are stored at "<user-id>/avatar.<ext>" — the folder name is what's
-- checked against auth.uid(), same pattern as the owner_id checks elsewhere.
create policy "avatars_owner_or_staff_insert" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff())
  );

create policy "avatars_owner_or_staff_update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff())
  );

create policy "avatars_owner_or_staff_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff())
  );
