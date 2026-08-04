// Contact details are a plausible, clearly-fictional placeholder — not the
// real clinic's actual phone/address/email, which weren't asked for here.
export const site = {
  name: "Öresunds Veterinärklinik",
  shortName: "Öresunds Vet",
  phone: "+46 40 123 45 67",
  phoneHref: "tel:+46401234567",
  email: "hello@oresundsvet.example",
  address: {
    line1: "Storgatan 12",
    line2: "235 32 Vellinge",
  },
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
} as const;

// Hours and nav labels are translated — see messages/{locale}.json
// ("site.hours" and "nav").
export const navHrefs = ["/services", "/pricing", "/about", "/contact"] as const;
