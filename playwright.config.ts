import { defineConfig, devices } from "@playwright/test";

// E2E against the production build served with the production headers (docs/DECISIONS.md
// "Stage 5.1 release plan" P4). A separate port keeps it apart from the `preview` launch
// configuration (4173).
const PORT = 4174;
const CI = process.env.CI !== undefined;
const PHONE = { viewport: { width: 375, height: 812 } };

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${String(PORT)}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } }, grepInvert: /@timing/ },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"], ...PHONE }, grepInvert: /@timing/ },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"], ...PHONE }, grepInvert: /@timing/ },
    // Phone-class timing with CPU throttling (open question 17); Chromium only, run on demand.
    { name: "timing", use: { ...devices["Pixel 7"], ...PHONE }, grep: /@timing/ },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${String(PORT)} --strictPort`,
    url: `http://localhost:${String(PORT)}`,
    reuseExistingServer: !CI,
    timeout: 180_000,
  },
});
