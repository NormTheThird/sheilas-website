import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Mirrors the CloudFront password prompt on /archive/ in the dev server so
// it can be tried locally. On when ARCHIVE_PASSWORD is set, otherwise the
// archive is open (the production gate lives in infra/HostingStack.cs).
function archiveGate(): Plugin {
  const password = process.env.ARCHIVE_PASSWORD;
  return {
    name: "archive-gate",
    configureServer(server) {
      if (!password) {
        server.config.logger.info(
          "archive gate off — set ARCHIVE_PASSWORD to try the /archive/ password locally",
        );
        return;
      }
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (url !== "/archive" && !/^\/archive[/?]/.test(url)) return next();
        const [scheme, encoded] = (req.headers.authorization ?? "").split(" ");
        const decoded =
          scheme === "Basic" && encoded ? Buffer.from(encoded, "base64").toString("utf8") : "";
        const colon = decoded.indexOf(":");
        if (colon >= 0 && decoded.slice(colon + 1) === password) return next();
        res.statusCode = 401;
        res.setHeader("WWW-Authenticate", 'Basic realm="Yes Yoga One archive"');
        res.setHeader("Cache-Control", "no-store");
        res.end("Password required");
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), archiveGate()],
  server: {
    fs: {
      // Content JSON lives one level up, in /content
      allow: [".."],
    },
  },
});
