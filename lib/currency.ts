// SEK throughout, regardless of display language — the clinic prices in
// kronor whether the site is shown in English or Swedish. sv-SE grouping
// (space-separated thousands) is the correct convention for the currency,
// independent of the active UI locale.
export function formatKr(amount: number): string {
  return `${amount.toLocaleString("sv-SE")} kr`;
}
