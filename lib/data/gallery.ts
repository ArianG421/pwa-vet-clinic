// Photography sourced from Unsplash (unsplash.com/license — free for commercial
// and personal use, no permission required). Stored locally in /public/images/gallery
// so the PWA keeps working offline and the demo never depends on an external host.

export type HeroSlide = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
};

export const heroSlides: HeroSlide[] = [
  {
    src: "/images/gallery/vet-exam-dachshund.jpg",
    alt: "A veterinarian gently examining a dachshund on an exam table",
    eyebrow: "Thorough, unhurried exams",
    title: "Every visit gets a full nose-to-tail check",
    body: "No rushing, no guessing — just a vet who takes the time to look closely.",
  },
  {
    src: "/images/gallery/puppies-tug-of-war.jpg",
    alt: "Three puppies playing tug-of-war with a stick outdoors",
    eyebrow: "Endearing, every time",
    title: "Happy, healthy, and a little bit wild",
    body: "Preventive care today means more zoomies and tug-of-war tomorrow.",
  },
  {
    src: "/images/gallery/vet-injection-dog.jpg",
    alt: "A veterinarian giving a small dog an injection",
    eyebrow: "Fear-free handling",
    title: "Vaccinations, without the drama",
    body: "Low-stress techniques keep even the most nervous patients calm.",
  },
  {
    src: "/images/gallery/white-cat-blue-eyes.jpg",
    alt: "A close-up of a fluffy white cat with blue eyes",
    eyebrow: "Cats welcome, calmly",
    title: "A separate, quieter space just for cats",
    body: "No barking waiting rooms — just a calmer visit from door to door.",
  },
  {
    src: "/images/gallery/beagle-puppy-ball.jpg",
    alt: "A beagle puppy playing with a ball in the grass",
    eyebrow: "Prices that don't bite",
    title: "Membership plans start at $19/month",
    body: "Spread the cost of routine care across the year — cancel any time.",
  },
  {
    src: "/images/gallery/golden-retriever-bokeh.jpg",
    alt: "A golden retriever in soft outdoor light",
    eyebrow: "For every stage of life",
    title: "From first vaccine to golden years",
    body: "Care that grows and adjusts with your pet, at every age.",
  },
  {
    src: "/images/gallery/orange-tabby-face.jpg",
    alt: "Close-up of an orange tabby cat's face",
    eyebrow: "In-house diagnostics",
    title: "Answers in under an hour, most days",
    body: "On-site bloodwork and imaging mean less waiting and less worrying.",
  },
  {
    src: "/images/gallery/lab-puppies-container.jpg",
    alt: "Yellow labrador puppies in a green container",
    eyebrow: "Same-week appointments",
    title: "Members skip the wait",
    body: "Priority booking means less time on hold, more time together.",
  },
];

export type InfoCard = {
  src: string;
  alt: string;
  title: string;
  body: string;
};

export const infoCards: InfoCard[] = [
  {
    src: "/images/gallery/lab-puppies-container.jpg",
    alt: "Yellow labrador puppies",
    title: "Priced for peace of mind",
    body: "Membership plans start at just $19/month — no surprise bills for the basics your pet needs every year.",
  },
  {
    src: "/images/gallery/vet-exam-table.jpg",
    alt: "A veterinarian examining a dog on an exam table",
    title: "Same-week appointments",
    body: "Members get priority booking, so a check-up doesn't mean a two-week wait.",
  },
  {
    src: "/images/gallery/orange-tabby-face.jpg",
    alt: "An orange tabby cat's face",
    title: "In-house diagnostics",
    body: "Bloodwork and imaging results in under an hour, most days — answers while you wait.",
  },
  {
    src: "/images/gallery/rabbit-grass-field.jpg",
    alt: "A rabbit sitting in a grass field",
    title: "Loved like family",
    body: "From the first wag to the quietest purr, every patient gets the care we'd want for our own pets.",
  },
  {
    src: "/images/gallery/white-cat-blue-eyes.jpg",
    alt: "A fluffy white cat with blue eyes",
    title: "24/7 peace of mind",
    body: "Because worry about a limping dog or an off-food cat doesn't wait for office hours.",
  },
];
