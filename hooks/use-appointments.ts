"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Appointment, ServiceCategoryRow, ServiceRow } from "@/lib/supabase/types";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [categories, setCategories] = useState<ServiceCategoryRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    const [{ data: cats }, { data: svcs }] = await Promise.all([
      supabase.from("service_categories").select("*").order("sort_order"),
      supabase.from("services").select("*"),
    ]);
    setCategories(cats ?? []);
    setServices(svcs ?? []);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setAppointments([]);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("appointments")
      .select("*, pets(name), services(name)")
      .order("requested_at", { ascending: false });

    if (fetchError) setError(fetchError.message);
    else setAppointments((data as Appointment[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const bookAppointment = useCallback(
    async (petId: string, serviceId: string, requestedAtIso: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { error: "You must be signed in." };

      const { error: insertError } = await supabase.from("appointments").insert({
        owner_id: user.id,
        pet_id: petId,
        service_id: serviceId,
        requested_at: requestedAtIso,
        status: "pending",
      });

      if (insertError) return { error: insertError.message };
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  const cancelAppointment = useCallback(
    async (id: string) => {
      const { error: updateError } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (updateError) return { error: updateError.message };
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  return {
    appointments,
    categories,
    services,
    loaded: appointments !== null,
    error,
    bookAppointment,
    cancelAppointment,
  };
}
