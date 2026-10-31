import { de, type Texts } from "./de";
import { en } from "./en";

export type Lang = "de" | "en";
export const languages: readonly Lang[] = ["de", "en"];

/** Text that differs by language, or one string used for both. */
export type Localized = string | Record<Lang, string>;

export const texts: Record<Lang, Texts> = { de, en };

export function local(value: Localized, lang: Lang): string {
  return typeof value === "string" ? value : value[lang];
}

/** Page address of a language version. */
export function pagePath(lang: Lang): string {
  return lang === "de" ? "/" : "/en/";
}
