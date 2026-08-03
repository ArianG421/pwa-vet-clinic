export type TeamMember = {
  name: string;
  role: string;
  bio: string;
};

export const team: TeamMember[] = [
  {
    name: "Dr. Elena Cross, DVM",
    role: "Founder & Lead Veterinarian",
    bio: "15 years in small-animal practice with a focus on soft-tissue surgery and orthopedics.",
  },
  {
    name: "Dr. Marcus Ahn, DVM",
    role: "Associate Veterinarian",
    bio: "Special interest in internal medicine, endoscopy, and senior pet wellness.",
  },
  {
    name: "Priya Nandakumar, RVT",
    role: "Lead Veterinary Technician",
    bio: "Runs the diagnostics lab and coordinates surgical anaesthesia and monitoring.",
  },
  {
    name: "Jonas Weber",
    role: "Client Care Coordinator",
    bio: "Your first call for bookings, membership questions, and pre-visit prep.",
  },
];
