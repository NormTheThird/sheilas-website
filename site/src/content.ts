import siteJson from "../../content/site.json";
import aboutJson from "../../content/about.json";
import servicesJson from "../../content/services.json";
import testimonialsJson from "../../content/testimonials.json";
import faqJson from "../../content/faq.json";
import type {
  AboutContent,
  FaqContent,
  ServicesContent,
  SiteContent,
  TestimonialsContent,
} from "./types";

export const site: SiteContent = siteJson;
export const about: AboutContent = aboutJson;
export const services: ServicesContent = servicesJson;
export const testimonials: TestimonialsContent = testimonialsJson;
export const faq: FaqContent = faqJson;
