/** Minimal valid bundles for UI and loader tests (not imported by the app). */
import type { BundleVersions, CalcBundle, TextBundle } from "../../shared/bundle";
import type { Locale } from "../../shared/locales";
import type { ContentUrls } from "./useContent";

export const fixtureVersions: BundleVersions = {
  schemaVersion: 1,
  contentVersion: "2026-10-18.1",
  composition: { workbookUpdated: "2026-03-27", workbookSha256: "0".repeat(64), cookingSha256: "1".repeat(64) },
};

export const fixtureCalc: CalcBundle = { ...fixtureVersions, foods: [], compositionFoods: [], rates: [], recipes: [] };

export const fixtureText = (locale: Locale): TextBundle => ({ ...fixtureVersions, locale, foods: {}, recipes: {} });

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
