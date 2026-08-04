// Names aren't translated; role/bio live in messages/{locale}.json under
// "about.team.members" as a raw array aligned by index with this one.

export const teamFacts = [
  { slug: "elena-cross" },
  { slug: "marcus-ahn" },
  { slug: "priya-nandakumar" },
  { slug: "jonas-weber" },
] as const;

export type TeamMember = { slug: string; name: string; role: string; bio: string };

export function getTeam(t: (key: string) => string): TeamMember[] {
  return teamFacts.map((member) => ({
    ...member,
    name: t(`members.${member.slug}.name`),
    role: t(`members.${member.slug}.role`),
    bio: t(`members.${member.slug}.bio`),
  }));
}
