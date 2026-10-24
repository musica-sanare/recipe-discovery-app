import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { renderCloudflareHeaders, SECURITY_HEADERS } from "./platform/headers.ts";

function securityHeaders(): Plugin {
  return {
    name: "security-headers",
    apply: "build",
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "_headers", source: renderCloudflareHeaders() });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), securityHeaders()],
  build: {
    // Content bundles are fetched; a data: URL would be blocked by `connect-src 'self'`.
    assetsInlineLimit: (filePath) => (filePath.endsWith(".json") ? false : undefined),
    // Licenses of the bundled dependencies, linked from the about page (docs/DECISIONS.md "Stage 5.3").
    license: { fileName: "third-party-licenses.txt" },
  },
  // The dev server is left without CSP because React Fast Refresh injects an
  // inline script; `vite preview` serves the production build with the same
  // headers as production.
  preview: { headers: { ...SECURITY_HEADERS } },
});
