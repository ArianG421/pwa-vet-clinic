export const site = {
  name: "Willowbrook Veterinary Clinic",
  shortName: "Willowbrook Vet",
  phone: "+1 (555) 016-2840",
  phoneHref: "tel:+15550162840",
  email: "hello@willowbrookvet.example",
  address: {
    line1: "482 Willowbrook Lane",
    line2: "Maple Ridge, ON L3B 4K1",
  },
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
} as const;

// Hours and nav labels are translated — see messages/{locale}.json
// ("site.hours" and "nav").
export const navHrefs = ["/services", "/pricing", "/about", "/contact"] as const;
