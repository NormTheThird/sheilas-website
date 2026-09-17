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
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
