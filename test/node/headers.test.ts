import { describe, expect, it } from "vitest";
import { ASSET_CACHE_CONTROL, CONTENT_SECURITY_POLICY, renderCloudflareHeaders } from "../../platform/headers";

describe("security headers", () => {
  it("keeps the CSP same-origin without inline or eval allowances", () => {
    expect(CONTENT_SECURITY_POLICY).toContain("default-src 'self'");
    expect(CONTENT_SECURITY_POLICY).toContain("frame-ancestors 'none'");
    expect(CONTENT_SECURITY_POLICY).not.toMatch(/unsafe-inline|unsafe-eval|https:|\*/);
  });

  it("renders a valid Cloudflare _headers file", () => {
    const lines = renderCloudflareHeaders().split("\n");
    const rules = lines.filter((line) => line !== "" && !line.startsWith(" ") && !line.startsWith("#"));

    expect(rules).toEqual(["/*", "/assets/*"]);
    expect(lines.every((line) => line.length <= 2000)).toBe(true);
    expect(lines).toContain("  X-Content-Type-Options: nosniff");
    // Only the content-hashed files under /assets/ may be cached for long.
    expect(lines.slice(lines.indexOf("/assets/*"))).toEqual(["/assets/*", `  Cache-Control: ${ASSET_CACHE_CONTROL}`, ""]);
  });
});
