-- Adds a slug to `services`, mirroring the one `service_categories` already
-- has. Needed so the portal can translate DB-driven service names (shown in
-- the booking form) back to Swedish by looking up the row's slug in
-- messages/sv.json, the same way category names already work.
--
-- Run this AFTER schema.sql/rls.sql/seed.sql have already been applied once.
-- Safe to run again: adding the column is idempotent, and seed.sql already
-- truncates + reinserts services, so just re-run seed.sql afterward to
-- populate the new column.

alter table public.services add column if not exists slug text;
