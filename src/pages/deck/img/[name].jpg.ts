import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { APIRoute } from "astro";
import sharp from "sharp";
import { championships } from "../../../data/championships";

// JPEG copies of the deck's photos and coins. Chrome puts JPEGs into the PDF as
// they are but stores WebP uncompressed, which made each PDF about 7 MB.
// Coins and patch are laid onto the page colour, so they need no transparency.
const publicDir = join(process.cwd(), "public");
const images: Record<string, { src: string; height: number }> = {
  "bike-portrait": { src: "/assets/onepager/images/bike-portrait-1200.webp", height: 1800 },
  "after-race": { src: "/assets/onepager/images/after-race-1200.webp", height: 1800 },
  ...Object.fromEntries(
    championships.map((item) => [item.front.split("/").pop()!.replace(".webp", ""), { src: item.front, height: 320 }]),
  ),
};

export function getStaticPaths() {
  return Object.keys(images).map((name) => ({ params: { name } }));
}

export const GET: APIRoute = async ({ params }) => {
  const image = images[params.name!]!;
  const body = await sharp(await readFile(join(publicDir, image.src)))
    .flatten({ background: "#f7f7f2" })
    .resize({ height: image.height, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(body), { headers: { "Content-Type": "image/jpeg" } });
};
