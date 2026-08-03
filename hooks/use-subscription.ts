"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SubscriptionRow, SubscriptionTierRow } from "@/lib/supabase/types";

export function useSubscription() {
  const [tiers, setTiers] = useState<SubscriptionTierRow[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionRow | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data: tierData } = await supabase.from("subscription_tiers").select("*").order("sort_order");
    setTiers(tierData ?? []);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSubscription(null);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*, subscription_tiers(*)")
      .eq("status", "active")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) setError(fetchError.message);
    setSubscription((data as SubscriptionRow | null) ?? null);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const subscribe = useCallback(
    async (tierId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { error: "You must be signed in." };

      const { error: insertError } = await supabase.from("subscriptions").insert({
        owner_id: user.id,
        tier_id: tierId,
        status: "active",
      });

      if (insertError) return { error: insertError.message };
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  const cancelSubscription = useCallback(
    async (id: string) => {
      const { error: updateError } = await supabase.from("subscriptions").update({ status: "cancelled" }).eq("id", id);
      if (updateError) return { error: updateError.message };
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  return { tiers, subscription, loaded: subscription !== undefined, error, subscribe, cancelSubscription };
}
