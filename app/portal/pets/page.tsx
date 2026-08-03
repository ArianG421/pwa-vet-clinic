"use client";

import { useState } from "react";
import { Cat, Dog, Plus, Rabbit, PawPrint, Pencil, Trash2 } from "lucide-react";
import { usePets } from "@/hooks/use-pets";
import { PetForm } from "@/components/portal/pet-form";
import { PawLoader } from "@/components/paw-loader";
import type { Pet } from "@/lib/supabase/types";

const SPECIES_ICON: Record<string, typeof Dog> = { Dog, Cat, Rabbit };

function ageFromDob(dob: string | null) {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) years--;
  if (years < 1) {
    const totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + months;
    return `${Math.max(totalMonths, 0)} mo`;
  }
  return `${years} yr${years === 1 ? "" : "s"}`;
}

export default function PetsPage() {
  const { pets, loaded, error, addPet, updatePet, deletePet } = usePets();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<Pet | null>(null);

  function openAdd() {
    setEditingPet(undefined);
    setFormOpen(true);
  }

  function openEdit(pet: Pet) {
    setEditingPet(pet);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    await deletePet(pendingDelete.id);
    setPendingDelete(null);
  }

  if (!loaded) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <PawLoader label="Fetching your pets…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Pets</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Your pets</h1>
          <p className="mt-2 max-w-md text-sm text-ink-muted">
            Keep profiles up to date so the clinic has what it needs before every visit.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="cta-bounce inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          <Plus className="h-4 w-4" /> Add a pet
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {pets && pets.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-black/10 py-16 text-center">
          <PawPrint className="h-8 w-8 text-brand-300" />
          <p className="font-semibold text-ink">No pets yet</p>
          <p className="max-w-xs text-sm text-ink-muted">Add your first pet to start booking appointments and tracking their care.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {pets?.map((pet) => {
            const Icon = SPECIES_ICON[pet.species] ?? PawPrint;
            const age = ageFromDob(pet.dob);
            return (
              <div key={pet.id} className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{pet.name}</p>
                      <p className="text-xs text-ink-muted">
                        {pet.species}{pet.breed ? ` · ${pet.breed}` : ""}{age ? ` · ${age}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${pet.name}`}
                      onClick={() => openEdit(pet)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-brand-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${pet.name}`}
                      onClick={() => setPendingDelete(pet)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {pet.notes && <p className="mt-3 text-sm text-ink-muted">{pet.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <PetForm
          pet={editingPet}
          onClose={() => setFormOpen(false)}
          onSubmit={editingPet ? (input) => updatePet(editingPet.id, input) : addPet}
        />
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-xl">
            <p className="font-semibold text-ink">Remove {pendingDelete.name}?</p>
            <p className="mt-2 text-sm text-ink-muted">This can't be undone.</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="flex-1 rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-ink-muted hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
