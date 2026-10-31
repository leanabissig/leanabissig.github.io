// Prints the partnership deck from dist/ to PDF after `astro build`:
// dist/deck/leana-bissig-partnership-de.pdf and -en.pdf. Uses Playwright's
// Chromium (set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH to use an installed Chrome).
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
};
// The pages use root-relative asset paths, so they need a server, not file://.
const server = createServer(async (request, response) => {
  let path = normalize(decodeURIComponent(new URL(request.url, "http://localhost").pathname));
  if (path.endsWith("/")) path += "index.html";
  try {
    const body = await readFile(join(root, path));
    response.writeHead(200, { "Content-Type": types[extname(path)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  for (const lang of ["de", "en"]) {
    await page.goto(`http://127.0.0.1:${port}/deck/${lang}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const path = join(root, "deck", `leana-bissig-partnership-${lang}.pdf`);
    await page.pdf({ path, preferCSSPageSize: true, printBackground: true, tagged: true });
    console.log(`deck: ${path.slice(root.length)}`);
  }
} finally {
  await browser.close();
  server.close();
}
