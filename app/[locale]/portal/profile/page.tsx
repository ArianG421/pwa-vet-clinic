"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Camera, Loader2, PawPrint, User } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useProfile } from "@/hooks/use-profile";
import { usePets } from "@/hooks/use-pets";
import { PawLoader } from "@/components/paw-loader";
import type { PreferredContact } from "@/lib/supabase/types";

export default function ProfilePage() {
  const t = useTranslations("portal.profile");
  const { profile, loaded, error, updateProfile, uploadAvatar } = useProfile();
  const { pets, loaded: petsLoaded } = usePets();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [preferredContact, setPreferredContact] = useState<PreferredContact>("email");

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setPhone(profile.phone ?? "");
    setAddress(profile.address ?? "");
    setEmergencyName(profile.emergency_contact_name ?? "");
    setEmergencyPhone(profile.emergency_contact_phone ?? "");
    setPreferredContact(profile.preferred_contact);
  }, [profile]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setAvatarUploading(true);
    setAvatarError(null);
    const result = await uploadAvatar(file);
    setAvatarUploading(false);
    if (result.error) setAvatarError(result.error);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    const result = await updateProfile({
      full_name: fullName,
      phone,
      address,
      emergency_contact_name: emergencyName,
      emergency_contact_phone: emergencyPhone,
      preferred_contact: preferredContact,
    });
    setSaving(false);
    if (result.error) setSaveError(result.error);
    else setSaved(true);
  }

  if (!loaded) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <PawLoader label={t("loadingLabel")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-md text-sm text-ink-muted">{t("subtitle")}</p>

      {(error || avatarError) && <p className="mt-4 text-sm text-red-600">{error ?? avatarError}</p>}

      <div className="mt-8 flex items-center gap-5 rounded-2xl border border-black/5 bg-surface p-5">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-brand-50 text-brand-700">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            aria-label={t("changePhoto")}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-white shadow-sm hover:bg-brand-800 disabled:opacity-60"
          >
            {avatarUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{profile?.full_name || t("unnamed")}</p>
          <p className="text-xs text-ink-muted">{profile?.email}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="mt-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 disabled:opacity-60"
          >
            {t("changePhoto")}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-black/5 bg-surface p-5 sm:p-6">
        <div>
          <label htmlFor="profile-name" className="text-sm font-medium text-ink">{t("fullName")}</label>
          <input
            id="profile-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div>
          <label htmlFor="profile-phone" className="text-sm font-medium text-ink">{t("phone")}</label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div>
          <label htmlFor="profile-address" className="text-sm font-medium text-ink">{t("address")}</label>
          <input
            id="profile-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">{t("preferredContact")}</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {(["email", "phone", "sms"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPreferredContact(option)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                  preferredContact === option
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-black/10 text-ink-muted hover:border-brand-300"
                }`}
              >
                {t(`preferredContactOptions.${option}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-emergency-name" className="text-sm font-medium text-ink">{t("emergencyContactName")}</label>
            <input
              id="profile-emergency-name"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label htmlFor="profile-emergency-phone" className="text-sm font-medium text-ink">{t("emergencyContactPhone")}</label>
            <input
              id="profile-emergency-phone"
              type="tel"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>

        {saveError && <p className="text-sm text-red-600">{saveError}</p>}
        {saved && <p className="text-sm font-medium text-brand-700">{t("saved")}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("save")}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-black/5 bg-surface p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <PawPrint className="h-4 w-4 text-brand-700" />
          <p className="text-sm font-semibold text-ink">{t("yourPets")}</p>
        </div>
        {!petsLoaded ? (
          <div className="mt-3"><PawLoader size="sm" label="" /></div>
        ) : pets && pets.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {pets.map((pet) => (
              <span key={pet.id} className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-ink-muted">
                {pet.name} · {pet.species}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-ink-muted">{t("noPetsYet")}</p>
        )}
        <Link href="/portal/pets" className="mt-3 inline-block text-xs font-semibold text-brand-700 hover:text-brand-800">
          {t("managePets")}
        </Link>
      </div>
    </div>
  );
}
