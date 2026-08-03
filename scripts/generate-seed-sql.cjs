const fs = require("node:fs");
const path = require("node:path");

const { serviceCategories } = require("../lib/data/services.ts");
const { planTiers } = require("../lib/data/plans.ts");

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function jsonbArray(items) {
  return `'${JSON.stringify(items).replace(/'/g, "''")}'::jsonb`;
}

const lines = [];
lines.push("-- Generated from lib/data/services.ts and lib/data/plans.ts — do not hand-edit.");
lines.push("-- Re-run `node scripts/generate-seed-sql.cjs` after changing that source data.");
lines.push("");
lines.push("truncate table public.services, public.service_categories, public.subscription_tiers restart identity cascade;");
lines.push("");

serviceCategories.forEach((cat, i) => {
  lines.push(
    `insert into public.service_categories (slug, name, description, icon, sort_order) values (${sqlString(cat.slug)}, ${sqlString(cat.name)}, ${sqlString(cat.description)}, ${sqlString(cat.icon)}, ${i});`
  );
});
lines.push("");

serviceCategories.forEach((cat) => {
  cat.services.forEach((service) => {
    lines.push(
      `insert into public.services (category_id, name, description, price_from, price_to, duration_minutes) select id, ${sqlString(service.name)}, ${sqlString(service.description)}, ${service.priceFrom}, ${service.priceTo}, ${service.durationMinutes} from public.service_categories where slug = ${sqlString(cat.slug)};`
    );
  });
});
lines.push("");

planTiers.forEach((plan, i) => {
  lines.push(
    `insert into public.subscription_tiers (slug, name, price_monthly, tagline, features, sort_order) values (${sqlString(plan.slug)}, ${sqlString(plan.name)}, ${plan.priceMonthly}, ${sqlString(plan.tagline)}, ${jsonbArray(plan.features)}, ${i});`
  );
});
lines.push("");

const outPath = path.join(__dirname, "..", "supabase", "seed.sql");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join("\n") + "\n");
console.log(`Wrote ${outPath} (${serviceCategories.length} categories, ${serviceCategories.reduce((n, c) => n + c.services.length, 0)} services, ${planTiers.length} plans)`);
