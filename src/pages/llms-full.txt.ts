import type { APIRoute } from "astro";
import { llmsFullTxt } from "../llms";

export const GET: APIRoute = () =>
  new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
