"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import type { Pet, ServiceCategoryRow, ServiceRow } from "@/lib/supabase/types";

function nextBusinessDayIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const totalMinutes = 9 * 60 + i * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

export function BookingForm({
  pets,
  categories,
  services,
  onSubmit,
  onClose,
}: {
  pets: Pet[];
  categories: ServiceCategoryRow[];
  services: ServiceRow[];
  onSubmit: (petId: string, serviceId: string, requestedAtIso: string) => Promise<{ error: string | null }>;
  onClose: () => void;
}) {
  const [petId, setPetId] = useState(pets[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const servicesInCategory = useMemo(() => services.filter((s) => s.category_id === categoryId), [services, categoryId]);
  const [serviceId, setServiceId] = useState(servicesInCategory[0]?.id ?? "");
  const [date, setDate] = useState(nextBusinessDayIso());
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCategoryChange(id: string) {
    setCategoryId(id);
    const first = services.find((s) => s.category_id === id);
    setServiceId(first?.id ?? "");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!petId || !serviceId) {
      setError("Add a pet before booking an appointment.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const requestedAtIso = new Date(`${date}T${time}:00`).toISOString();
    const result = await onSubmit(petId, serviceId, requestedAtIso);
    setSubmitting(false);
    if (result.error) setError(result.error);
    else onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Book an appointment</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {pets.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">
            You'll need to add a pet before booking. Head to the Pets tab first.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="booking-pet" className="text-sm font-medium text-ink">Pet</label>
              <select
                id="booking-pet"
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="booking-category" className="text-sm font-medium text-ink">Category</label>
              <select
                id="booking-category"
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="booking-service" className="text-sm font-medium text-ink">Service</label>
              <select
                id="booking-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              >
                {servicesInCategory.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} (${s.price_from}–${s.price_to})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="booking-date" className="text-sm font-medium text-ink">Date</label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  min={nextBusinessDayIso()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                />
              </div>
              <div>
                <label htmlFor="booking-time" className="text-sm font-medium text-ink">Time</label>
                <select
                  id="booking-time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Request appointment
            </button>
            <p className="text-center text-xs text-ink-muted">We'll confirm by email — this creates a pending request.</p>
          </form>
        )}
      </div>
    </div>
  );
}
