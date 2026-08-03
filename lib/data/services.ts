export type ServiceItem = {
  name: string;
  description: string;
  priceFrom: number;
  priceTo: number;
  durationMinutes: number;
};

export type ServiceCategory = {
  slug: string;
  name: string;
  icon: string;
  summary: string;
  description: string;
  services: ServiceItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "surgery",
    name: "Surgery & Procedures",
    icon: "Scissors",
    summary: "From routine spays to complex soft-tissue surgery.",
    description:
      "Our surgical suite is equipped for everything from routine sterilizations to complex soft-tissue and emergency procedures, with full pre-anaesthetic screening and dedicated post-op monitoring for every patient.",
    services: [
      { name: "Spay / Neuter", description: "Routine sterilization with pre-anaesthetic bloodwork and take-home pain plan.", priceFrom: 220, priceTo: 420, durationMinutes: 90 },
      { name: "Soft-Tissue Surgery", description: "Mass removals, wound repair, and abdominal procedures.", priceFrom: 450, priceTo: 1800, durationMinutes: 120 },
      { name: "Post-Op Care Plan", description: "Suture check, pain management review, and recovery monitoring.", priceFrom: 60, priceTo: 120, durationMinutes: 30 },
    ],
  },
  {
    slug: "preventive-care",
    name: "Primary & Preventive Care",
    icon: "ShieldPlus",
    summary: "Vaccinations, wellness exams, and puppy & kitten checks.",
    description:
      "The foundation of a long, healthy life — core and lifestyle vaccinations, wellness exams, parasite prevention, microchipping, and health certificates for travel or breed registration.",
    services: [
      { name: "Wellness Exam", description: "Full nose-to-tail check-up with a licensed veterinarian.", priceFrom: 55, priceTo: 90, durationMinutes: 30 },
      { name: "Vaccination Package", description: "Core + lifestyle vaccines tailored to age and risk.", priceFrom: 40, priceTo: 150, durationMinutes: 20 },
      { name: "Puppy & Kitten Starter Visit", description: "First-visit exam, deworming, and vaccine schedule planning.", priceFrom: 70, priceTo: 110, durationMinutes: 40 },
      { name: "Microchipping & ID", description: "Permanent ID chip with registry enrollment.", priceFrom: 35, priceTo: 55, durationMinutes: 15 },
    ],
  },
  {
    slug: "dental",
    name: "Dental Services",
    icon: "Sparkles",
    summary: "Tartar removal, dental X-rays, and extractions.",
    description:
      "Dental disease affects most pets by age three. We offer ultrasonic scaling and polishing, full-mouth dental radiographs, and extractions under monitored anaesthesia.",
    services: [
      { name: "Dental Cleaning & Polish", description: "Ultrasonic scaling and polishing under anaesthesia.", priceFrom: 280, priceTo: 550, durationMinutes: 90 },
      { name: "Dental X-Rays", description: "Full-mouth radiographs to catch disease below the gumline.", priceFrom: 90, priceTo: 150, durationMinutes: 30 },
      { name: "Tooth Extraction", description: "Simple to surgical extractions with pain management.", priceFrom: 120, priceTo: 400, durationMinutes: 60 },
    ],
  },
  {
    slug: "diagnostics",
    name: "Laboratory & Diagnostics",
    icon: "FlaskConical",
    summary: "In-house bloodwork, urinalysis, and rapid test panels.",
    description:
      "Our in-house lab returns most bloodwork and urinalysis results within the hour, so treatment decisions don't wait on a courier.",
    services: [
      { name: "Bloodwork Panel", description: "Complete blood count and chemistry panel, in-house results.", priceFrom: 90, priceTo: 220, durationMinutes: 45 },
      { name: "Urinalysis", description: "Screening for kidney, bladder, and metabolic issues.", priceFrom: 45, priceTo: 80, durationMinutes: 30 },
      { name: "Rapid Test Panels", description: "Parvo, heartworm, tick-borne disease, and FeLV/FIV screening.", priceFrom: 40, priceTo: 95, durationMinutes: 20 },
    ],
  },
  {
    slug: "imaging",
    name: "Imaging",
    icon: "ScanLine",
    summary: "Digital radiography and ultrasound on site.",
    description:
      "Digital X-ray and ultrasound equipment on site means faster, clearer answers for injuries, swallowed objects, and internal medicine cases — no referral wait.",
    services: [
      { name: "Digital Radiography", description: "High-resolution X-ray imaging with same-day read.", priceFrom: 110, priceTo: 260, durationMinutes: 30 },
      { name: "Abdominal Ultrasound", description: "Non-invasive imaging for organs and soft tissue.", priceFrom: 180, priceTo: 350, durationMinutes: 45 },
    ],
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    icon: "Bone",
    summary: "ACL injuries, fracture repair, and spinal care.",
    description:
      "From cranial cruciate ligament injuries to fracture stabilization and spinal cases, our orthopedic service pairs surgical expertise with a structured rehab plan.",
    services: [
      { name: "Orthopedic Consultation", description: "Lameness exam with imaging referral plan.", priceFrom: 85, priceTo: 140, durationMinutes: 40 },
      { name: "Cruciate (ACL) Repair", description: "Surgical stabilization for cranial cruciate ligament injuries.", priceFrom: 1800, priceTo: 3800, durationMinutes: 150 },
      { name: "Fracture Repair", description: "Stabilization and fixation for fractures.", priceFrom: 900, priceTo: 3200, durationMinutes: 150 },
    ],
  },
  {
    slug: "endoscopy",
    name: "Endoscopy",
    icon: "Search",
    summary: "Minimally invasive scoping for scopes & swallowed objects.",
    description:
      "Bronchoscopy and gastroscopy let us investigate chronic coughing, swallowing difficulty, or a suspected foreign body without open surgery in many cases.",
    services: [
      { name: "Gastroscopy", description: "Camera-guided exam of the oesophagus and stomach.", priceFrom: 450, priceTo: 950, durationMinutes: 60 },
      { name: "Bronchoscopy", description: "Airway scoping for chronic cough or breathing issues.", priceFrom: 450, priceTo: 950, durationMinutes: 60 },
      { name: "Foreign Body Retrieval", description: "Non-surgical removal of swallowed objects where possible.", priceFrom: 500, priceTo: 1100, durationMinutes: 75 },
    ],
  },
  {
    slug: "emergency",
    name: "Emergency Care",
    icon: "Siren",
    summary: "Acute stabilization and urgent treatment.",
    description:
      "Accidents don't wait for an appointment. We prioritize acute cases for same-day stabilization and treatment, with an after-hours line for existing clients.",
    services: [
      { name: "Emergency Exam", description: "Priority triage and stabilization exam.", priceFrom: 120, priceTo: 180, durationMinutes: 30 },
      { name: "Overnight Monitoring", description: "Hospitalization with continuous monitoring.", priceFrom: 200, priceTo: 450, durationMinutes: 720 },
      { name: "After-Hours Consultation", description: "Phone triage line for existing clients.", priceFrom: 0, priceTo: 45, durationMinutes: 15 },
    ],
  },
];

export function getCategory(slug: string) {
  return serviceCategories.find((c) => c.slug === slug);
}
