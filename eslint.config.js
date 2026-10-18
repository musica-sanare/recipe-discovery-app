import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

// Module boundaries (docs/ARCHITECTURE.md "Layers and responsibilities").
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
const UI_FORBIDDEN_IMPORTS = [{ group: BUILD_AND_PLATFORM, message: "UI code must not import build-time or platform code." }];

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
    rules: { "no-restricted-imports": ["error", { patterns: UI_FORBIDDEN_IMPORTS }] },
  },
  {
    files: ["domain/**/*.ts"],
    rules: { "no-restricted-imports": ["error", { patterns: DOMAIN_FORBIDDEN_IMPORTS }] },
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
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
