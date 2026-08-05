"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, ShieldAlert, User, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PawLoader } from "@/components/paw-loader";
import type { CustomerActivity } from "@/lib/crm-activity";
import type { Pet } from "@/lib/supabase/types";

export function CustomerProfileModal({
  customer,
  onClose,
}: {
  customer: CustomerActivity;
  onClose: () => void;
}) {
  const t = useTranslations("crm.customers.profileModal");
  const [pets, setPets] = useState<Pet[] | null>(null);
  const supabase = createClient();
  const { profile } = customer;

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("pets")
      .select("*")
      .eq("owner_id", profile.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!cancelled) setPets((data as Pet[]) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [supabase, profile.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{t("title")}</h2>
          <button type="button" onClick={onClose} aria-label={t("close")} className="text-ink-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-50 text-brand-700">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-7 w-7" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{profile.full_name || t("unnamed")}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                customer.active ? "bg-brand-50 text-brand-700" : "bg-accent-50 text-accent-700"
              }`}
            >
              {customer.active ? t("statusActive") : t("statusInactive")}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-2.5 rounded-2xl bg-surface-muted p-4 text-sm">
          <p className="flex items-center gap-2 text-ink">
            <Mail className="h-3.5 w-3.5 shrink-0 text-ink-muted" /> {profile.email || t("notProvided")}
          </p>
          <p className="flex items-center gap-2 text-ink">
            <Phone className="h-3.5 w-3.5 shrink-0 text-ink-muted" /> {profile.phone || t("notProvided")}
          </p>
          <p className="flex items-center gap-2 text-ink">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-muted" /> {profile.address || t("notProvided")}
          </p>
          <p className="flex items-start gap-2 text-ink">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" />
            <span>
              {t("emergencyContact")}:{" "}
              {profile.emergency_contact_name || profile.emergency_contact_phone
                ? [profile.emergency_contact_name, profile.emergency_contact_phone].filter(Boolean).join(" — ")
                : t("notProvided")}
            </span>
          </p>
          <p className="text-xs text-ink-muted">
            {t("preferredContact")}: {t(`preferredContactOptions.${profile.preferred_contact}`)}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-ink">{t("pets")}</p>
          {pets === null ? (
            <div className="mt-2"><PawLoader size="sm" label="" /></div>
          ) : pets.length === 0 ? (
            <p className="mt-1.5 text-xs text-ink-muted">{t("noPets")}</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {pets.map((pet) => (
                <span key={pet.id} className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-ink-muted">
                  {pet.name} · {pet.species}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
