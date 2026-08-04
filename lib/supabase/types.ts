export type Pet = {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
  dob: string | null;
  notes: string | null;
  created_at: string;
};

export type LeadStatus = "none" | "contacted" | "converted" | "dismissed";

export type Profile = {
  id: string;
  role: "client" | "staff";
  full_name: string | null;
  email: string | null;
  phone: string | null;
  lead_status: LeadStatus;
  created_at: string;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  lead_status: LeadStatus;
  created_at: string;
};

export type CrmEmailRow = {
  id: string;
  profile_id: string | null;
  contact_message_id: string | null;
  to_email: string;
  to_name: string | null;
  subject: string;
  body: string;
  status: "sent" | "failed";
  error_message: string | null;
  staff_id: string;
  created_at: string;
};

export type ServiceCategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
};

export type ServiceRow = {
  id: string;
  category_id: string;
  slug: string | null;
  name: string;
  description: string | null;
  price_from: number;
  price_to: number;
  duration_minutes: number;
};

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  pet_id: string;
  owner_id: string;
  service_id: string;
  requested_at: string;
  status: AppointmentStatus;
  amount_charged: number | null;
  notes: string | null;
  created_at: string;
  pets?: { name: string } | null;
  services?: { name: string; slug: string | null } | null;
};

export type SubscriptionTierRow = {
  id: string;
  slug: string;
  name: string;
  price_monthly: number;
  tagline: string | null;
  features: string[];
  sort_order: number;
};

export type SubscriptionStatus = "active" | "cancelled";

export type SubscriptionRow = {
  id: string;
  owner_id: string;
  tier_id: string;
  status: SubscriptionStatus;
  started_at: string;
  subscription_tiers?: SubscriptionTierRow | null;
};
