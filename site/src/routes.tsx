import type { ReactElement } from "react";
import { site } from "./content";
import { HomePage } from "./pages/HomePage";
import { TestimonialsPage } from "./pages/TestimonialsPage";
import { FaqPage } from "./pages/FaqPage";
import { V2Page } from "./pages/V2Page";
import { V3Page } from "./pages/V3Page";

export interface Route {
  path: string;
  title: string;
  description: string;
  element: () => ReactElement;
  /** true = the page brings its own header/footer instead of the classic Layout */
  standalone?: boolean;
}

// Each route is prerendered to its own index.html — no client-side router,
// so S3 + CloudFront can serve every page without server rewrites.
export const routes: Route[] = [
  {
    path: "/",
    title: `${site.name} – Ayurvedic Yoga Therapy | ${site.locationLine}`,
    description:
      "Sheila Norman is an Ayurvedic Yoga Therapist, BodyTalk Access Technician and yin yoga teacher offering individual and group yoga lessons.",
    element: () => <HomePage />,
  },
  {
    path: "/testimonials/",
    title: `Testimonials – ${site.name}`,
    description: "What students say about yoga lessons and Ayurvedic practices with Sheila Norman.",
    element: () => <TestimonialsPage />,
  },
  {
    path: "/faq/",
    title: `FAQ – ${site.name}`,
    description:
      "Frequently asked questions about yoga lessons, Ayurvedic Yoga Therapy assessments, yin yoga and BodyTalk Access with Sheila Norman.",
    element: () => <FaqPage />,
  },
  {
    path: "/v2/",
    title: `${site.name} – Ayurvedic Yoga Therapy | ${site.locationLine}`,
    description:
      "Sheila Norman is an Ayurvedic Yoga Therapist, BodyTalk Access Technician and yin yoga teacher offering individual and group yoga lessons.",
    element: () => <V2Page />,
    standalone: true,
  },
  {
    path: "/v3/",
    title: `${site.name} – Ayurvedic Yoga Therapy | ${site.locationLine}`,
    description:
      "Sheila Norman is an Ayurvedic Yoga Therapist, BodyTalk Access Technician and yin yoga teacher offering individual and group yoga lessons.",
    element: () => <V3Page />,
    standalone: true,
  },
];

export function matchRoute(pathname: string): Route {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return routes.find((r) => r.path === normalized) ?? routes[0];
}
