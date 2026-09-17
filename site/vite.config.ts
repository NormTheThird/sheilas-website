import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Content JSON lives one level up, in /content
      allow: [".."],
    },
  },
});
