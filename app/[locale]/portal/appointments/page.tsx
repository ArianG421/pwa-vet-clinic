"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { useAppointments } from "@/hooks/use-appointments";
import { usePets } from "@/hooks/use-pets";
import { BookingForm } from "@/components/portal/booking-form";
import { AppointmentList } from "@/components/portal/appointment-list";
import { PawLoader } from "@/components/paw-loader";

export default function AppointmentsPage() {
  const t = useTranslations("portal.appointments");
  const { appointments, categories, services, loaded, error, bookAppointment, cancelAppointment } = useAppointments();
  const { pets, loaded: petsLoaded } = usePets();
  const [formOpen, setFormOpen] = useState(false);

  if (!loaded || !petsLoaded) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <PawLoader label={t("loadingLabel")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t("title")}</h1>
          <p className="mt-2 max-w-md text-sm text-ink-muted">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="cta-bounce inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          <Plus className="h-4 w-4" /> {t("bookVisit")}
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {pets && pets.length === 0 && (
        <p className="mt-6 rounded-2xl bg-accent-50 px-4 py-3 text-sm text-accent-700">
          {t("addPetFirst")}
        </p>
      )}

      <div className="mt-8">
        <AppointmentList appointments={appointments ?? []} onCancel={cancelAppointment} />
      </div>

      {formOpen && (
        <BookingForm
          pets={pets ?? []}
          categories={categories}
          services={services}
          onSubmit={bookAppointment}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
