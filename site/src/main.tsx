import { hydrateRoot, createRoot } from "react-dom/client";
import { App } from "./App";
import { matchRoute } from "./routes";

const container = document.getElementById("root")!;
const app = <App path={window.location.pathname} />;

// Prod titles are baked in by the prerenderer; this covers the dev server.
if (document.title.includes("<!--")) {
  document.title = matchRoute(window.location.pathname).title;
}

// Prerendered pages hydrate; the bare dev-server template mounts fresh.
// (The dev template holds only an <!--app-html--> comment, which is a child
// node but not an element, so check for elements specifically.)
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
