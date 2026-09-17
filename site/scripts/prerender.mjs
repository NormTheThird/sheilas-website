// Prerenders every route into dist/<route>/index.html so the deployed site is
// plain static HTML (indexable, fast first paint) that React then hydrates.
// Runs after `vite build` (client) and `vite build --ssr` (server bundle).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(root, "../dist");
const distSsr = path.resolve(root, "../dist-ssr");

const template = await readFile(path.join(dist, "index.html"), "utf-8");
const { render, routes } = await import(
  new URL(`file://${path.join(distSsr, "entry-server.js").replace(/\\/g, "/")}`)
);

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

for (const route of routes) {
  const html = template
    .replace("<!--page-title-->", escapeHtml(route.title))
    .replace("<!--page-description-->", escapeHtml(route.description))
    .replace("<!--app-html-->", render(route.path));
  const outDir = path.join(dist, route.path);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), html);
  console.log(`prerendered ${route.path}`);
}

await rm(distSsr, { recursive: true, force: true });
