/** Minimal valid bundles for UI and loader tests (not imported by the app). */
import type { BundleVersions, CalcBundle, TextBundle } from "../../shared/bundle";
import type { Locale } from "../../shared/locales";
import type { ContentUrls } from "./useContent";

export const fixtureVersions: BundleVersions = {
  schemaVersion: 1,
  contentVersion: "2026-10-18.1",
  composition: { workbookUpdated: "2026-03-27", workbookSha256: "0".repeat(64), cookingSha256: "1".repeat(64) },
};

export const fixtureCalc: CalcBundle = {
  ...fixtureVersions,
  foods: [
    { id: "chicken_breast", composition: { raw: "11220" }, allergens: [{ allergen: "chicken", confidence: "contains" }], proteinGroup: "chicken" },
    { id: "chicken_thigh", composition: { raw: "11224" }, allergens: [{ allergen: "chicken", confidence: "contains" }], proteinGroup: "chicken" },
    { id: "egg", composition: { raw: "12004" }, allergens: [{ allergen: "egg", confidence: "contains" }], proteinGroup: "egg" },
    { id: "potato", composition: { raw: "02063" }, allergens: [] },
  ],
  compositionFoods: [],
  rates: [],
  recipes: [],
};

const FOOD_TEXTS: Readonly<Record<Locale, TextBundle["foods"]>> = {
  ja: {
    chicken_breast: { name: "鶏むね肉（皮なし）", aliases: ["鶏むね", "とりむね"] },
    chicken_thigh: { name: "鶏もも肉（皮なし）", aliases: ["鶏もも"] },
    egg: { name: "卵", aliases: ["たまご", "玉子"] },
    potato: { name: "じゃがいも", aliases: ["ジャガイモ", "馬鈴薯"] },
  },
  en: {
    chicken_breast: { name: "Chicken breast, skinless", aliases: ["chicken breast"] },
    chicken_thigh: { name: "Chicken thigh, skinless", aliases: ["chicken thigh"] },
    egg: { name: "Egg", aliases: [] },
    potato: { name: "Potato", aliases: [] },
  },
  es: {
    chicken_breast: { name: "Pechuga de pollo sin piel", aliases: ["pechuga"] },
    chicken_thigh: { name: "Muslo de pollo sin piel", aliases: ["contramuslo"] },
    egg: { name: "Huevo", aliases: [] },
    potato: { name: "Patata", aliases: ["papa"] },
  },
};

export const fixtureText = (locale: Locale): TextBundle => ({ ...fixtureVersions, locale, foods: FOOD_TEXTS[locale], recipes: {} });

export const fixtureUrls: ContentUrls = { calc: "/calc.json", text: { ja: "/text-ja.json", en: "/text-en.json", es: "/text-es.json" } };

/** A fetch that serves the fixture bundles at `fixtureUrls`. */
export function fixtureFetch(url: string): Promise<Response> {
  const bodies: Record<string, unknown> = {
    [fixtureUrls.calc]: fixtureCalc,
    [fixtureUrls.text.ja]: fixtureText("ja"),
    [fixtureUrls.text.en]: fixtureText("en"),
    [fixtureUrls.text.es]: fixtureText("es"),
  };
  const body = bodies[url];
  return Promise.resolve(body === undefined ? new Response("Not found", { status: 404 }) : Response.json(body));
}
