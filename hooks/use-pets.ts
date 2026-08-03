"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Pet } from "@/lib/supabase/types";

export type PetInput = {
  name: string;
  species: string;
  breed: string;
  dob: string;
  notes: string;
};

export function usePets() {
  const [pets, setPets] = useState<Pet[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setPets([]);
      return;
    }
    const { data, error: fetchError } = await supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: true });

    if (fetchError) setError(fetchError.message);
    else setPets(data ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const addPet = useCallback(
    async (input: PetInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { error: "You must be signed in." };

      const { error: insertError } = await supabase.from("pets").insert({
        owner_id: user.id,
        name: input.name,
        species: input.species,
        breed: input.breed || null,
        dob: input.dob || null,
        notes: input.notes || null,
      });

      if (insertError) return { error: insertError.message };
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  const updatePet = useCallback(
    async (id: string, input: PetInput) => {
      const { error: updateError } = await supabase
        .from("pets")
        .update({
          name: input.name,
          species: input.species,
          breed: input.breed || null,
          dob: input.dob || null,
          notes: input.notes || null,
        })
        .eq("id", id);

      if (updateError) return { error: updateError.message };
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  const deletePet = useCallback(
    async (id: string) => {
      const { error: deleteError } = await supabase.from("pets").delete().eq("id", id);
      if (deleteError) return { error: deleteError.message };
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  return { pets, loaded: pets !== null, error, addPet, updatePet, deletePet };
}
