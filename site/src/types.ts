export interface LinkItem {
  label: string;
  url: string;
}

export interface SiteContent {
  name: string;
  legalName: string;
  tagline: string;
  locationLine: string;
  phone: string;
  email: string;
  social: LinkItem[];
  communityLocations: LinkItem[];
  mapEmbedUrl: string;
  bookingEmbedUrl: string;
  formspreeFormId: string;
  podcastAudioUrl: string;
  podcastBlurb: string;
  artworkCredit: LinkItem;
}

export interface AboutContent {
  heading: string;
  quote: string;
  quoteAuthor: string;
  photo: string;
  bio: string;
}

export interface Service {
  name: string;
  description: string;
  duration: string;
  price: string;
  stripePaymentLink: string;
  active: boolean;
}

export interface ServicesContent {
  heading: string;
  intro: string;
  services: Service[];
}

export interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

export interface TestimonialsContent {
  heading: string;
  testimonials: Testimonial[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  faq: FaqItem[];
}
