"use client";

import { useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import type { Pet } from "@/lib/supabase/types";
import type { PetInput } from "@/hooks/use-pets";

const SPECIES_OPTIONS = ["Dog", "Cat", "Rabbit", "Bird", "Other"];

export function PetForm({
  pet,
  onSubmit,
  onClose,
}: {
  pet?: Pet;
  onSubmit: (input: PetInput) => Promise<{ error: string | null }>;
  onClose: () => void;
}) {
  const [name, setName] = useState(pet?.name ?? "");
  const [species, setSpecies] = useState(pet?.species ?? "Dog");
  const [breed, setBreed] = useState(pet?.breed ?? "");
  const [dob, setDob] = useState(pet?.dob ?? "");
  const [notes, setNotes] = useState(pet?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await onSubmit({ name, species, breed, dob, notes });
    setSubmitting(false);
    if (result.error) setError(result.error);
    else onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{pet ? "Edit pet" : "Add a pet"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="pet-name" className="text-sm font-medium text-ink">Name</label>
            <input
              id="pet-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pet-species" className="text-sm font-medium text-ink">Species</label>
              <select
                id="pet-species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              >
                {SPECIES_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pet-breed" className="text-sm font-medium text-ink">Breed</label>
              <input
                id="pet-breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pet-dob" className="text-sm font-medium text-ink">Date of birth</label>
            <input
              id="pet-dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>

          <div>
            <label htmlFor="pet-notes" className="text-sm font-medium text-ink">Notes</label>
            <textarea
              id="pet-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, temperament, anything the clinic should know"
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-ink-muted hover:bg-surface-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {pet ? "Save changes" : "Add pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
