-- Demo-only seed data for the pitch: populates the CRM leads list with a
-- realistic variety of contact-form inquiries (some already contacted, to
-- show the status workflow), rather than just the one real test lead.
-- Genuinely safe to re-run — clears out its own rows by email first, so it
-- won't duplicate or touch anything else (like the real arianz421 lead).

delete from public.crm_emails
where contact_message_id in (
  select id from public.contact_messages
  where email in (
    'sofia.lindqvist@example.com', 'marcus.holm@example.com', 'anna.bergstrom@example.com',
    'erik.nilsson@example.com', 'linda.karlsson@example.com'
  )
);

delete from public.contact_messages
where email in (
  'sofia.lindqvist@example.com', 'marcus.holm@example.com', 'anna.bergstrom@example.com',
  'erik.nilsson@example.com', 'linda.karlsson@example.com'
);

insert into public.contact_messages (name, email, message, lead_status, created_at) values
  ('Sofia Lindqvist', 'sofia.lindqvist@example.com', 'Hej! Vi har precis flyttat till Vellinge och undrar om ni tar emot nya patienter. Vår hund heter Bruno och är 4 år gammal.', 'none', now() - interval '4 days'),
  ('Marcus Holm', 'marcus.holm@example.com', 'Undrar om ni har lediga tider för kastrering av min katt inom de närmsta veckorna?', 'contacted', now() - interval '9 days'),
  ('Anna Bergström', 'anna.bergstrom@example.com', 'Hej, jag undrar vad det kostar för en hälsokontroll för min kanin samt om ni har möjlighet att ID-märka henne samtidigt.', 'none', now() - interval '15 days'),
  ('Erik Nilsson', 'erik.nilsson@example.com', 'Vi funderar på medlemskap men vill gärna veta mer om vad som ingår innan vi bestämmer oss.', 'none', now() - interval '6 days'),
  ('Linda Karlsson', 'linda.karlsson@example.com', 'Min hund har blivit lite stel i bakbenen på sistone, kan det vara något ortopediskt? Vill gärna boka en konsultation.', 'contacted', now() - interval '20 days');

-- Fake "already reached out" history for the two contacted leads above, so
-- the leads list shows a real-looking last-contacted date, not just a
-- status badge with no activity behind it.
insert into public.crm_emails (contact_message_id, to_email, to_name, subject, body, status, staff_id, created_at)
select
  cm.id,
  cm.email,
  cm.name,
  'Angående din förfrågan',
  'Hej ' || cm.name || ',' || chr(10) || chr(10) || 'Tack för din förfrågan! Vi återkommer gärna med mer information — hör av dig om du har fler frågor under tiden.' || chr(10) || chr(10) || 'Vänliga hälsningar,' || chr(10) || 'Öresunds Veterinärklinik',
  'sent',
  (select id from public.profiles where role = 'staff' limit 1),
  cm.created_at + interval '1 day'
from public.contact_messages cm
where cm.email in ('marcus.holm@example.com', 'linda.karlsson@example.com');
