// Names aren't translated (identical value in both locale files); role/bio
// live in messages/{locale}.json under "about.team.members", aligned by
// slug. Real names/titles from oresundsveterinarklinik.se's "Våra
// medarbetare" page (the pitch target) — no photos, per instruction. `tier`
// controls how the about page groups the roster: "vet" gets a fuller card
// with a bio derived only from what their real title actually states nothing
// fabricated beyond that; "support" is name + role only, grouped by
// department, so 17 real people don't turn the page into a wall of
// near-identical cards.

export type TeamMember = { slug: string; name: string; tier: "vet" | "nurse" | "care" | "operations" };

export const teamFacts: TeamMember[] = [
  // Veterinarians
  { slug: "johanna-wadstrom", name: "Johanna Wadström", tier: "vet" },
  { slug: "yaacob-sharon", name: "Yaacob Sharon", tier: "vet" },
  { slug: "elina-thern", name: "Elina Thern", tier: "vet" },
  { slug: "dragan-panic", name: "Dragan Panic", tier: "vet" },
  { slug: "elisabet-kinnby", name: "Elisabet Kinnby", tier: "vet" },
  { slug: "katrine-lindegaard", name: "Katrine Lindegaard", tier: "vet" },
  { slug: "josefine-lofgren", name: "Josefine Löfgren", tier: "vet" },
  // Veterinary nurses
  { slug: "malin-freij", name: "Malin Freij", tier: "nurse" },
  { slug: "martina-ljunggren", name: "Martina Ljunggren", tier: "nurse" },
  { slug: "ellen-herrlin-vuris", name: "Ellen Herrlin Vuris", tier: "nurse" },
  // Animal care team
  { slug: "emelie-stavenheim", name: "Emelie Stavenheim", tier: "care" },
  { slug: "paulina-engbe", name: "Paulina Engbe", tier: "care" },
  { slug: "emma-anna-panic", name: "Emma-Anna Panic", tier: "care" },
  { slug: "linn-hanssen", name: "Linn Hanssen", tier: "care" },
  // Clinic operations
  { slug: "caroline-dahlgren", name: "Caroline Dahlgren", tier: "operations" },
  { slug: "ellinor-wernquist", name: "Ellinor Wernquist", tier: "operations" },
  { slug: "annika-eriksson", name: "Annika Eriksson", tier: "operations" },
  { slug: "peter-kanne", name: "Peter Kanne", tier: "operations" },
];

export type TeamMemberText = TeamMember & { role: string; bio?: string };

export function getTeam(t: (key: string) => string): TeamMemberText[] {
  return teamFacts.map((member) => ({
    ...member,
    role: t(`members.${member.slug}.role`),
    bio: member.tier === "vet" ? t(`members.${member.slug}.bio`) : undefined,
  }));
}

export function getTeamByTier(t: (key: string) => string) {
  const team = getTeam(t);
  return {
    vets: team.filter((m) => m.tier === "vet"),
    nurses: team.filter((m) => m.tier === "nurse"),
    care: team.filter((m) => m.tier === "care"),
    operations: team.filter((m) => m.tier === "operations"),
  };
}
