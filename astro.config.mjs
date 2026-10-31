// @ts-check
import { defineConfig } from "astro/config";

// Static output for GitHub Pages: / (German) and /en/ (English).
export default defineConfig({
  site: "https://leanabissig.ch",
  build: { format: "directory" },
  devToolbar: { enabled: false },
});
