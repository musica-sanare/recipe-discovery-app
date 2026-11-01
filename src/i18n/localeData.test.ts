import { describe, expect, it } from "vitest";
import { LEXICONS } from "../../shared/freeText/lexicon/index";
import { SUPPORTED_LOCALES } from "../../shared/locales";
import { createTestI18n } from "../testing/i18n";
import { BOOT_MESSAGES } from "./bootMessages";
import { hasLocaleData, lexiconOf, loadLocaleData } from "./localeData";
import { resources } from "./resources";

describe("per-locale UI data (ADR-039)", () => {
  it.each(SUPPORTED_LOCALES)("loads the %s catalog and word list as the static indexes hold them", async (locale) => {
    const data = await loadLocaleData(locale);
    expect(data.messages).toBe(resources[locale].translation);
    expect(data.lexicon).toBe(LEXICONS[locale]);
    expect(data.lexicon.locale).toBe(locale);
  });

  it("finds a locale's word list through a copy of the instance, as useTranslation returns", () => {
    const instance = createTestI18n("ja", { only: true });
    const copy = Object.create(Object.getPrototypeOf(instance) as object, Object.getOwnPropertyDescriptors(instance)) as typeof instance;
    expect(lexiconOf(copy, "ja")).toBe(LEXICONS.ja);
    expect(hasLocaleData(copy, "fr")).toBe(false);
    expect(() => lexiconOf(copy, "fr")).toThrow();
  });

  it.each(SUPPORTED_LOCALES)("keeps the %s boot messages equal to the catalog", (locale) => {
    const { content } = resources[locale].translation;
    expect(BOOT_MESSAGES[locale]).toEqual({ error: content.error, retry: content.retry });
  });
});
