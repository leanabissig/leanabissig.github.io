import type { APIRoute } from "astro";
import { profile } from "../data/profile";
import { languages, pagePath } from "../i18n";

// Both language versions, each naming the other as its alternate.
export const GET: APIRoute = () => {
  const url = (path: string) => new URL(path, profile.site).href;
  const alternates = [
    ...languages.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${url(pagePath(l))}"/>`),
    `<xhtml:link rel="alternate" hreflang="x-default" href="${url("/")}"/>`,
  ].join("");
  const entries = languages.map((l) => `<url><loc>${url(pagePath(l))}</loc>${alternates}</url>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
