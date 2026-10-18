/**
 * Security headers for every static response (docs/ARCHITECTURE.md "Security
 * and privacy"). Defined once here and rendered into the hosting platform's
 * format at build time, so moving to another host only needs a new renderer.
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
};

/** Cloudflare static assets `_headers` format: a URL pattern followed by indented `Name: Value` lines. */
export function renderCloudflareHeaders(headers: Readonly<Record<string, string>> = SECURITY_HEADERS): string {
  const lines = Object.entries(headers).map(([name, value]) => `  ${name}: ${value}`);
  return ["# Generated from platform/headers.ts. Do not edit.", "/*", ...lines, ""].join("\n");
}
