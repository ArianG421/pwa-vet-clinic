import type { Profile } from "@/lib/supabase/types";

// A customer with no appointment and no active subscription within this
// window is considered inactive — and therefore automatically eligible to
// show up on the Leads list, with no staff action needed to put them there.
export const INACTIVE_AFTER_DAYS = 90;

export type CustomerActivity = {
  profile: Profile;
  lastAppointmentAt: string | null;
  hasActiveSubscription: boolean;
  active: boolean;
};

export function computeCustomerActivity(
  profiles: Profile[],
  appointments: { owner_id: string; requested_at: string }[],
  subscriptions: { owner_id: string; status: string }[]
): CustomerActivity[] {
  const cutoff = Date.now() - INACTIVE_AFTER_DAYS * 24 * 60 * 60 * 1000;

  const lastAppointmentByOwner = new Map<string, string>();
  for (const appointment of appointments) {
    const existing = lastAppointmentByOwner.get(appointment.owner_id);
    if (!existing || new Date(appointment.requested_at) > new Date(existing)) {
      lastAppointmentByOwner.set(appointment.owner_id, appointment.requested_at);
    }
  }

  const activeSubscriptionOwners = new Set(
    subscriptions.filter((s) => s.status === "active").map((s) => s.owner_id)
  );

  return profiles.map((profile) => {
    const lastAppointmentAt = lastAppointmentByOwner.get(profile.id) ?? null;
    const hasActiveSubscription = activeSubscriptionOwners.has(profile.id);
    const recentAppointment = lastAppointmentAt ? new Date(lastAppointmentAt).getTime() >= cutoff : false;

    return {
      profile,
      lastAppointmentAt,
      hasActiveSubscription,
      active: recentAppointment || hasActiveSubscription,
    };
  });
}
