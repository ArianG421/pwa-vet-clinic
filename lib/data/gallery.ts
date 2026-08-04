// Photography sourced from Unsplash (unsplash.com/license — free for commercial
// and personal use, no permission required). Stored locally in /public/images/gallery
// so the PWA keeps working offline and the demo never depends on an external host.
//
// Facts only (image paths) — translatable eyebrow/title/body/alt text lives in
// messages/{locale}.json under "home.hero.slides.<slug>" and "home.infoPager.cards.<slug>".

export const heroSlideFacts = [
  { slug: "vetExamDachshund", src: "/images/gallery/vet-exam-dachshund.jpg" },
  { slug: "puppiesTugOfWar", src: "/images/gallery/puppies-tug-of-war.jpg" },
  { slug: "vetInjectionDog", src: "/images/gallery/vet-injection-dog.jpg" },
  { slug: "whiteCatBlueEyes", src: "/images/gallery/white-cat-blue-eyes.jpg" },
  { slug: "beaglePuppyBall", src: "/images/gallery/beagle-puppy-ball.jpg" },
  { slug: "goldenRetrieverBokeh", src: "/images/gallery/golden-retriever-bokeh.jpg" },
  { slug: "orangeTabbyFace", src: "/images/gallery/orange-tabby-face.jpg" },
  { slug: "labPuppiesContainer", src: "/images/gallery/lab-puppies-container.jpg" },
] as const;

export type HeroSlide = { slug: string; src: string; alt: string; eyebrow: string; title: string; body: string };

export function getHeroSlides(t: (key: string) => string): HeroSlide[] {
  return heroSlideFacts.map((slide) => ({
    ...slide,
    alt: t(`slides.${slide.slug}.alt`),
    eyebrow: t(`slides.${slide.slug}.eyebrow`),
    title: t(`slides.${slide.slug}.title`),
    body: t(`slides.${slide.slug}.body`),
  }));
}

export const infoCardFacts = [
  { slug: "labPuppiesContainer", src: "/images/gallery/lab-puppies-container.jpg" },
  { slug: "vetExamTable", src: "/images/gallery/vet-exam-table.jpg" },
  { slug: "orangeTabbyFace", src: "/images/gallery/orange-tabby-face.jpg" },
  { slug: "rabbitGrassField", src: "/images/gallery/rabbit-grass-field.jpg" },
  { slug: "whiteCatBlueEyes", src: "/images/gallery/white-cat-blue-eyes.jpg" },
] as const;

export type InfoCard = { slug: string; src: string; alt: string; title: string; body: string };

export function getInfoCards(t: (key: string) => string): InfoCard[] {
  return infoCardFacts.map((card) => ({
    ...card,
    alt: t(`cards.${card.slug}.alt`),
    title: t(`cards.${card.slug}.title`),
    body: t(`cards.${card.slug}.body`),
  }));
}
