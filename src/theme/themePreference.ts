/**
 * The theme choice and its persistence (ADR-042). "system" is the absence of a stored value,
 * so it stores nothing; storage failures are ignored and the choice then lasts for this page.
 * `public/theme-init.js` applies the stored value before the first paint.
 */
export const THEME_STORAGE_KEY = "recipe-discovery.theme";
export const THEME_CHOICES = ["system", "light", "dark"] as const;
export type ThemeChoice = (typeof THEME_CHOICES)[number];

type PreferenceStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function browserStorage(): PreferenceStorage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return (THEME_CHOICES as readonly unknown[]).includes(value);
}

export function readStoredTheme(storage: PreferenceStorage | undefined = browserStorage()): ThemeChoice {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function storeTheme(choice: ThemeChoice, storage: PreferenceStorage | undefined = browserStorage()): void {
  try {
    if (choice === "system") storage?.removeItem(THEME_STORAGE_KEY);
    else storage?.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Storage may be unavailable (private mode, disabled storage); the choice then lasts for this page only.
  }
}

/** `data-theme` overrides the OS setting in `src/styles.css`; without it the page follows the OS. */
export function applyTheme(choice: ThemeChoice, root: { readonly dataset: Record<string, string | undefined> }): void {
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
}
