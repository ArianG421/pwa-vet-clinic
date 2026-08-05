"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ServiceCategoryRow, ServiceRow, SubscriptionTierRow } from "@/lib/supabase/types";

// Best-effort — the price write already succeeded by the time this runs;
// a failed cache-clear just means Ask AI answers with the old price until
// the next server restart, not a broken save.
function invalidateAssistantIndex() {
  fetch("/api/assistant/invalidate", { method: "POST" }).catch(() => {});
}

export function useCrmPricing() {
  const [categories, setCategories] = useState<ServiceCategoryRow[] | null>(null);
  const [services, setServices] = useState<ServiceRow[] | null>(null);
  const [tiers, setTiers] = useState<SubscriptionTierRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    const [
      { data: categoryData, error: categoryError },
      { data: serviceData, error: serviceError },
      { data: tierData, error: tierError },
    ] = await Promise.all([
      supabase.from("service_categories").select("*").order("sort_order"),
      supabase.from("services").select("*"),
      supabase.from("subscription_tiers").select("*").order("sort_order"),
    ]);

    const firstError = categoryError ?? serviceError ?? tierError;
    if (firstError) {
      setError(firstError.message);
      return;
    }
    setCategories(categoryData ?? []);
    setServices(serviceData ?? []);
    setTiers(tierData ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const updateServicePrice = useCallback(
    async (id: string, priceFrom: number, priceTo: number) => {
      const { error: updateError } = await supabase
        .from("services")
        .update({ price_from: priceFrom, price_to: priceTo })
        .eq("id", id);
      if (updateError) return { error: updateError.message };
      invalidateAssistantIndex();
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  const updateTierPrice = useCallback(
    async (id: string, priceMonthly: number) => {
      const { error: updateError } = await supabase
        .from("subscription_tiers")
        .update({ price_monthly: priceMonthly })
        .eq("id", id);
      if (updateError) return { error: updateError.message };
      invalidateAssistantIndex();
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  return {
    categories,
    services,
    tiers,
    loaded: categories !== null && services !== null && tiers !== null,
    error,
    updateServicePrice,
    updateTierPrice,
  };
}
