import { describe, expect, it } from "vitest";
import { fixtureCalc, fixtureFetch, fixtureText, fixtureUrls } from "./bundleFixtures";
import { loadCalcBundle, loadTextBundle, type Fetch } from "./loadContent";

const serving =
  (body: unknown): Fetch =>
  () =>
    Promise.resolve(Response.json(body));

describe("loadCalcBundle", () => {
  it("returns a valid bundle", async () => {
    expect(await loadCalcBundle(fixtureUrls.calc, fixtureFetch)).toEqual({ ok: true, value: fixtureCalc });
  });

  it("reports an unreachable bundle as a network error", async () => {
    const result = await loadCalcBundle("/calc.json", () => Promise.reject(new TypeError("Failed to fetch")));
    expect(result).toMatchObject({ ok: false, kind: "network" });
  });

  it("reports an error status as an HTTP error", async () => {
    expect(await loadCalcBundle("/missing.json", fixtureFetch)).toMatchObject({ ok: false, kind: "http", detail: "/missing.json: HTTP 404" });
  });

  it("reports a body that is not JSON as invalid", async () => {
    expect(await loadCalcBundle("/calc.json", () => Promise.resolve(new Response("<html>")))).toMatchObject({ ok: false, kind: "invalid" });
  });

  it("reports a bundle with the wrong shape or schema version as invalid", async () => {
    expect(await loadCalcBundle("/calc.json", serving({ ...fixtureCalc, schemaVersion: 2 }))).toMatchObject({ ok: false, kind: "invalid" });
    expect(await loadCalcBundle("/calc.json", serving({ ...fixtureCalc, recipes: [{ id: "x" }] }))).toMatchObject({ ok: false, kind: "invalid" });
  });
});

describe("loadTextBundle", () => {
  it("returns a text bundle that matches the calculation bundle", async () => {
    expect(await loadTextBundle(fixtureUrls.text.es, "es", fixtureCalc, fixtureFetch)).toEqual({ ok: true, value: fixtureText("es") });
  });

  it("rejects a bundle for another locale or another content version", async () => {
    expect(await loadTextBundle("/text-es.json", "es", fixtureCalc, serving(fixtureText("en")))).toMatchObject({ ok: false, kind: "invalid" });
    const other = { ...fixtureText("es"), contentVersion: "2026-10-19.1" };
    expect(await loadTextBundle("/text-es.json", "es", fixtureCalc, serving(other))).toMatchObject({ ok: false, kind: "invalid" });
  });

  it("rejects a bundle that misses texts for the calculation bundle", async () => {
    const calc = { ...fixtureCalc, foods: [...fixtureCalc.foods, { id: "salmon", composition: { raw: "10134" }, allergens: [] }] };
    expect(await loadTextBundle("/text-ja.json", "ja", calc, serving(fixtureText("ja")))).toMatchObject({ ok: false, kind: "invalid", detail: "/text-ja.json: foods.salmon" });
  });
});
