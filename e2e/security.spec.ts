import { CONTENT_SECURITY_POLICY, SECURITY_HEADERS } from "../platform/headers.ts";
import { expect, test } from "./support.ts";

// Production headers on documents and assets served by `npm run preview` (ADR-018,
// docs/en/ARCHITECTURE.md §8). Cloudflare serves the same values from `dist/_headers`.
test("every response carries the security headers", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const assets = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => new URL(entry.name).pathname));
  const paths = ["/", "/about", "/recipes/beef_potato_tomato_stew", "/third-party-licenses.txt", ...assets];
  expect(assets.some((path) => path.endsWith(".js"))).toBe(true);
  expect(assets.some((path) => path.endsWith(".css"))).toBe(true);
  expect(assets.some((path) => path.endsWith(".json"))).toBe(true);
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const headers = response.headers();
    expect(headers["content-security-policy"], path).toBe(CONTENT_SECURITY_POLICY);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) expect(headers[name.toLowerCase()], `${path} ${name}`).toBe(value);
  }
});
