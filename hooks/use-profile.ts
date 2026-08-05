"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PreferredContact, Profile } from "@/lib/supabase/types";

export type ProfileInput = {
  full_name: string;
  phone: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  preferred_contact: PreferredContact;
};

const MAX_AVATAR_BYTES = 3 * 1024 * 1024;

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setProfile(null);
      setLoaded(true);
      return;
    }
    const { data, error: fetchError } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (fetchError) setError(fetchError.message);
    else setProfile(data as Profile);
    setLoaded(true);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const updateProfile = useCallback(
    async (input: ProfileInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { error: "You must be signed in." };

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: input.full_name || null,
          phone: input.phone || null,
          address: input.address || null,
          emergency_contact_name: input.emergency_contact_name || null,
          emergency_contact_phone: input.emergency_contact_phone || null,
          preferred_contact: input.preferred_contact,
        })
        .eq("id", user.id);

      if (updateError) return { error: updateError.message };
      await load();
      return { error: null };
    },
    [supabase, load]
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return { error: "Please choose an image file." };
      if (file.size > MAX_AVATAR_BYTES) return { error: "Image must be smaller than 3 MB." };

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { error: "You must be signed in." };

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (uploadError) return { error: uploadError.message };

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
      // Cache-bust: the path is stable, so a re-upload needs a fresh URL to
      // avoid the browser (or CDN) serving the previous photo.
      const avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
      if (updateError) return { error: updateError.message };

      await load();
      return { error: null };
    },
    [supabase, load]
  );

  return { profile, loaded, error, updateProfile, uploadAvatar };
}
