import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

// Module boundaries (docs/en/ARCHITECTURE.md "Layers and responsibilities").
const BUILD_AND_PLATFORM = ["**/tools/**", "**/platform/**", "**/test/**"];
const UI_PACKAGES = ["react", "react-*", "react/*", "react-dom/*", "i18next", "i18next/*"];

// The engines are pure: no UI, i18n, platform, or build-time code, and no locale.
const DOMAIN_FORBIDDEN_IMPORTS = [
  { group: ["**/src/**", ...BUILD_AND_PLATFORM], message: "The domain must not depend on UI, build, or platform code." },
  { group: UI_PACKAGES, message: "The domain must not depend on UI or i18n packages." },
];
const SHARED_FORBIDDEN_IMPORTS = [
  { group: ["**/src/**", "**/domain/**", ...BUILD_AND_PLATFORM], message: "Shared code must not depend on other layers." },
  { group: UI_PACKAGES, message: "Shared code must not depend on UI or i18n packages." },
];
// Content is data: it may use shared types only.
const CONTENT_FORBIDDEN_IMPORTS = [
  { group: ["**/src/**", "**/domain/**", ...BUILD_AND_PLATFORM], message: "Content may import shared types only." },
  { group: UI_PACKAGES, message: "Content must not depend on UI or i18n packages." },
];
const UI_FORBIDDEN_IMPORTS = [{ group: [...BUILD_AND_PLATFORM], message: "UI code must not import build-time or platform code." }];
// The app loads one locale's catalog and word list at a time (ADR-039); the static indexes are for tests.
const UI_APP_FORBIDDEN_IMPORTS = [
  ...UI_FORBIDDEN_IMPORTS,
  { group: ["**/i18n/resources", "**/freeText/lexicon/index", "**/freeText/lexicon/index.ts"], message: "App code loads locale data through src/i18n/localeData.ts." },
];

export default tseslint.config(
  { ignores: ["dist", "coverage", "node_modules"] },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat["recommended-latest"], reactRefresh.configs.vite],
    languageOptions: { globals: globals.browser },
    rules: { "no-restricted-imports": ["error", { patterns: UI_APP_FORBIDDEN_IMPORTS }] },
  },
  {
    files: ["src/**/*.test.{ts,tsx}", "src/testing/**/*.ts"],
    rules: { "no-restricted-imports": ["error", { patterns: UI_FORBIDDEN_IMPORTS }] },
  },
  {
    files: ["domain/**/*.ts"],
    rules: { "no-restricted-imports": ["error", { patterns: DOMAIN_FORBIDDEN_IMPORTS }] },
  },
  {
    files: ["content/**/*.ts"],
    rules: { "no-restricted-imports": ["error", { patterns: CONTENT_FORBIDDEN_IMPORTS }] },
  },
  {
    files: ["shared/**/*.ts"],
    rules: { "no-restricted-imports": ["error", { patterns: SHARED_FORBIDDEN_IMPORTS }] },
  },
  {
    files: ["*.config.{js,ts}", "platform/**/*.ts", "tools/**/*.ts", "test/node/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
  {
    // E2E: Node test files whose callbacks also run in the browser.
    files: ["e2e/**/*.ts"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    // UI integration tests: jsdom with the repository content built in Node.
    files: ["test/ui/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
