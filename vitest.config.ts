import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Node by default; UI tests opt into jsdom with a per-file environment comment.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}", "shared/**/*.test.ts", "domain/**/*.test.ts", "tools/**/*.test.ts", "test/node/**/*.test.ts", "test/ui/**/*.test.tsx"],
    restoreMocks: true,
  },
});
