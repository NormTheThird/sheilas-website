import { lazy, Suspense, type ReactElement } from "react";
import { site } from "./content";
import { HomePage } from "./pages/HomePage";
import { TestimonialsPage } from "./pages/TestimonialsPage";
import { FaqPage } from "./pages/FaqPage";
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
// "/" is the redesigned site; the ported WordPress theme lives under /archive/,
// which CloudFront gates with a password (see infra/HostingStack.cs).
const publicRoutes: Route[] = [
  {
    path: "/",
    title: `${site.name} – Ayurvedic Yoga Therapy | ${site.locationLine}`,
    description:
      "Sheila Norman is an Ayurvedic Yoga Therapist, BodyTalk Access Technician and yin yoga teacher offering individual and group yoga lessons.",
    element: () => <V3Page />,
    standalone: true,
  },
  {
    path: "/archive/",
    title: `${site.name} – Ayurvedic Yoga Therapy | ${site.locationLine}`,
    description:
      "Sheila Norman is an Ayurvedic Yoga Therapist, BodyTalk Access Technician and yin yoga teacher offering individual and group yoga lessons.",
    element: () => <HomePage />,
  },
  {
    path: "/archive/testimonials/",
    title: `Testimonials – ${site.name}`,
    description: "What students say about yoga lessons and Ayurvedic practices with Sheila Norman.",
    element: () => <TestimonialsPage />,
  },
  {
    path: "/archive/faq/",
    title: `FAQ – ${site.name}`,
    description:
      "Frequently asked questions about yoga lessons, Ayurvedic Yoga Therapy assessments, yin yoga and BodyTalk Access with Sheila Norman.",
    element: () => <FaqPage />,
  },
];

// Concepts still being discussed with Sheila. They only exist on the dev
// server: never prerendered, and the pages are loaded lazily inside this
// dev-only branch so neither their code nor their CSS reaches the production
// build. Open http://localhost:5173/v2/ after `npm run dev` to look at one.
function previewRouteList(): Route[] {
  const V2Page = lazy(() => import("./pages/V2Page").then((m) => ({ default: m.V2Page })));
  return [
    {
      path: "/v2/",
      title: `Gentle yoga for a sore back, stress and sleep – ${site.name} | ${site.locationLine}`,
      description:
        "One-on-one stretching, breathing and relaxation with Sheila Norman for people who have never done yoga. No experience needed.",
      element: () => (
        <Suspense fallback={null}>
          <V2Page />
        </Suspense>
      ),
      standalone: true,
    },
  ];
}

const previewRoutes: Route[] = import.meta.env.DEV ? previewRouteList() : [];

export const routes: Route[] = [...publicRoutes, ...previewRoutes];

export function matchRoute(pathname: string): Route {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return routes.find((r) => r.path === normalized) ?? routes[0];
}
