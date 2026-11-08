// Applies the stored theme choice before the first paint (ADR-042). A classic same-origin
// file, because the CSP allows no inline script. test/node/theme-init.test.ts keeps the key
// and the values equal to those of src/theme/themePreference.ts.
try {
  const theme = localStorage.getItem("recipe-discovery.theme");
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch {
  // Storage may be unavailable; the page then follows the OS setting.
}
