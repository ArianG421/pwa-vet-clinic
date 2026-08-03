export const site = {
  name: "Willowbrook Veterinary Clinic",
  shortName: "Willowbrook Vet",
  tagline: "Compassionate, modern care for every member of the family.",
  description:
    "Willowbrook Veterinary Clinic offers preventive care, surgery, dental, diagnostics, and emergency services for dogs, cats, and small pets — with online booking and a member portal.",
  phone: "+1 (555) 016-2840",
  phoneHref: "tel:+15550162840",
  email: "hello@willowbrookvet.example",
  address: {
    line1: "482 Willowbrook Lane",
    line2: "Maple Ridge, ON L3B 4K1",
  },
  hours: [
    { label: "Monday – Friday", value: "8:00 AM – 6:00 PM" },
    { label: "Saturday", value: "9:00 AM – 2:00 PM" },
    { label: "Sunday", value: "Closed (Emergency line active)" },
  ],
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Membership" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
