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
  // Real handles — unlike phone/address/email, these are genuinely theirs.
  social: {
    instagram: "https://www.instagram.com/oresunds_vet_vellinge/",
    instagramHandle: "@oresunds_vet_vellinge",
    facebook: "https://www.facebook.com/Oresundvellinge/",
    facebookHandle: "Öresunds Veterinärklinik Vellinge",
  },
} as const;

// Hours and nav labels are translated — see messages/{locale}.json
// ("site.hours" and "nav").
export const navHrefs = ["/services", "/pricing", "/about", "/faq", "/contact"] as const;
