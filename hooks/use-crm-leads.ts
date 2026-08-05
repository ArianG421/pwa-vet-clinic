"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { computeCustomerActivity } from "@/lib/crm-activity";
import type { ContactMessageRow, CrmEmailRow, LeadStatus, Profile } from "@/lib/supabase/types";

export type LeadSource = "customer" | "inquiry";

export type Lead = {
  source: LeadSource;
  id: string;
  name: string;
  email: string;
  leadStatus: LeadStatus;
  since: string;
  lastAppointmentAt: string | null;
  profileId: string | null;
  contactMessageId: string | null;
  message: string | null;
};

// A lead stays on the list until staff move it past "contacted" — nothing
// ever writes 'none'/'contacted' to *add* someone here, that happens
// automatically from inactivity or a contact-form submission.
const WORKING_STATUSES: LeadStatus[] = ["none", "contacted"];

export function useCrmLeads() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [emailLog, setEmailLog] = useState<CrmEmailRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    const [
      { data: profiles, error: profilesError },
      { data: appointments },
      { data: subscriptions },
      { data: contactMessages, error: contactError },
      { data: emails },
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("role", "client"),
      supabase.from("appointments").select("owner_id, requested_at"),
      supabase.from("subscriptions").select("owner_id, status"),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("crm_emails").select("*").order("created_at", { ascending: false }),
    ]);

    if (profilesError) {
      setError(profilesError.message);
      return;
    }
    if (contactError) {
      setError(contactError.message);
      return;
    }

    const activity = computeCustomerActivity((profiles as Profile[]) ?? [], appointments ?? [], subscriptions ?? []);

    const customerLeads: Lead[] = activity
      .filter((c) => !c.active && WORKING_STATUSES.includes(c.profile.lead_status))
      .map((c) => ({
        source: "customer",
        id: c.profile.id,
        name: c.profile.full_name ?? c.profile.email ?? c.profile.id,
        email: c.profile.email ?? "",
        leadStatus: c.profile.lead_status,
        since: c.lastAppointmentAt ?? c.profile.created_at,
        lastAppointmentAt: c.lastAppointmentAt,
        profileId: c.profile.id,
        contactMessageId: null,
        message: null,
      }));

    const inquiryLeads: Lead[] = ((contactMessages as ContactMessageRow[]) ?? [])
      .filter((m) => WORKING_STATUSES.includes(m.lead_status))
      .map((m) => ({
        source: "inquiry",
        id: m.id,
        name: m.name,
        email: m.email,
        leadStatus: m.lead_status,
        since: m.created_at,
        lastAppointmentAt: null,
        profileId: null,
        contactMessageId: m.id,
        message: m.message,
      }));

    setLeads(
      [...customerLeads, ...inquiryLeads].sort(
        (a, b) => new Date(a.since).getTime() - new Date(b.since).getTime()
      )
    );
    setEmailLog((emails as CrmEmailRow[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const setLeadStatus = useCallback(
    async (lead: Lead, status: LeadStatus) => {
      const table = lead.source === "customer" ? "profiles" : "contact_messages";
      const { error: updateError } = await supabase.from(table).update({ lead_status: status }).eq("id", lead.id);
      if (updateError) return { error: updateError.message };
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  const sendEmail = useCallback(
    async (lead: Lead, subject: string, body: string) => {
      const res = await fetch("/api/crm/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: lead.email,
          toName: lead.name,
          subject,
          body,
          profileId: lead.profileId,
          contactMessageId: lead.contactMessageId,
        }),
      });
      const json = await res.json().catch(() => ({ error: "Unexpected response from the server." }));
      await load();
      if (!res.ok) return { error: (json.error as string) ?? "Send failed." };
      return { error: null };
    },
    [load]
  );

  const emailsFor = useCallback(
    (lead: Lead) =>
      emailLog.filter(
        (e) =>
          (lead.profileId && e.profile_id === lead.profileId) ||
          (lead.contactMessageId && e.contact_message_id === lead.contactMessageId)
      ),
    [emailLog]
  );

  return { leads, loaded: leads !== null, error, setLeadStatus, sendEmail, emailsFor, reload: load };
}
