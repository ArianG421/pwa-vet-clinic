// Merges the language-neutral facts (lib/data/services.ts, lib/data/plans.ts)
// with the English display text (messages/en.json) to produce the SQL seed —
// the DB stores canonical English content; the portal translates it back to
// Swedish at render time by looking up each row's slug in messages/sv.json.
const fs = require("node:fs");
const path = require("node:path");

const { serviceCategoryFacts } = require("../lib/data/services.ts");
const { planTierFacts } = require("../lib/data/plans.ts");
const en = require("../messages/en.json");

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function jsonbArray(items) {
  return `'${JSON.stringify(items).replace(/'/g, "''")}'::jsonb`;
}

const lines = [];
lines.push("-- Generated from lib/data/services.ts, lib/data/plans.ts, and messages/en.json —");
lines.push("-- do not hand-edit. Re-run `node --experimental-strip-types scripts/generate-seed-sql.cjs`");
lines.push("-- after changing that source data.");
lines.push("");
lines.push("truncate table public.services, public.service_categories, public.subscription_tiers restart identity cascade;");
lines.push("");

serviceCategoryFacts.forEach((cat, i) => {
  const text = en.services.categories[cat.slug];
  lines.push(
    `insert into public.service_categories (slug, name, description, icon, sort_order) values (${sqlString(cat.slug)}, ${sqlString(text.name)}, ${sqlString(text.description)}, ${sqlString(cat.icon)}, ${i});`
  );
});
lines.push("");

serviceCategoryFacts.forEach((cat) => {
  const catText = en.services.categories[cat.slug];
  cat.services.forEach((service) => {
    const text = catText.services[service.slug];
    lines.push(
      `insert into public.services (category_id, slug, name, description, price_from, price_to, duration_minutes) select id, ${sqlString(service.slug)}, ${sqlString(text.name)}, ${sqlString(text.description)}, ${service.priceFrom}, ${service.priceTo}, ${service.durationMinutes} from public.service_categories where slug = ${sqlString(cat.slug)};`
    );
  });
});
lines.push("");

planTierFacts.forEach((plan, i) => {
  const text = en.plans.tiers[plan.slug];
  lines.push(
    `insert into public.subscription_tiers (slug, name, price_monthly, tagline, features, sort_order) values (${sqlString(plan.slug)}, ${sqlString(text.name)}, ${plan.priceMonthly}, ${sqlString(text.tagline)}, ${jsonbArray(text.features)}, ${i});`
  );
});
lines.push("");

const outPath = path.join(__dirname, "..", "supabase", "seed.sql");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join("\n") + "\n");
console.log(
  `Wrote ${outPath} (${serviceCategoryFacts.length} categories, ${serviceCategoryFacts.reduce((n, c) => n + c.services.length, 0)} services, ${planTierFacts.length} plans)`
);
