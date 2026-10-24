/**
 * The repository content as the browser receives it, served to the app through a
 * stubbed fetch, so UI tests run the real engines on real recipes. The 20 validation
 * recipes keep the reviewed exceptional states (few candidates, relaxations) stable as
 * the library grows.
 */
import { buildCalcBundle, buildTextBundle } from "../../tools/content/bundle.ts";
import { validationBundleInput } from "../../tools/content/repository.ts";
import type { ContentUrls } from "../../src/content/useContent.ts";

const input = validationBundleInput();
const bodies: Record<string, unknown> = {
  "/calc.json": buildCalcBundle(input),
  "/text-ja.json": buildTextBundle(input, "ja"),
  "/text-en.json": buildTextBundle(input, "en"),
  "/text-es.json": buildTextBundle(input, "es"),
};

export const repositoryUrls: ContentUrls = { calc: "/calc.json", text: { ja: "/text-ja.json", en: "/text-en.json", es: "/text-es.json" } };

export function repositoryFetch(url: string): Promise<Response> {
  const body = bodies[url];
  return Promise.resolve(body === undefined ? new Response("Not found", { status: 404 }) : Response.json(body));
}
