// Real contact details, given explicitly for this pitch.
export const site = {
  name: "Öresunds Veterinärklinik",
  shortName: "Öresunds Vet",
  phone: "+46 40 – 61 61 260",
  phoneHref: "tel:+46406161260",
  email: "info@oresundsveterinarklinik.se",
  address: {
    line1: "Kompanigatan 27",
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
