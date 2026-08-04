"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { computeCustomerActivity, type CustomerActivity } from "@/lib/crm-activity";
import type { Profile } from "@/lib/supabase/types";

// Read-only: active/inactive is computed live from appointments and
// subscriptions, never stored, so there's nothing here for staff to set.
export function useCrmCustomers() {
  const [customers, setCustomers] = useState<CustomerActivity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    const [
      { data: profiles, error: profilesError },
      { data: appointments },
      { data: subscriptions },
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("role", "client"),
      supabase.from("appointments").select("owner_id, requested_at"),
      supabase.from("subscriptions").select("owner_id, status"),
    ]);

    if (profilesError) {
      setError(profilesError.message);
      return;
    }

    setCustomers(computeCustomerActivity((profiles as Profile[]) ?? [], appointments ?? [], subscriptions ?? []));
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  return { customers, loaded: customers !== null, error, reload: load };
}
