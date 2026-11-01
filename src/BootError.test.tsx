// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SUPPORTED_LOCALES } from "../shared/locales";
import { BootError } from "./BootError";
import { BOOT_MESSAGES } from "./i18n/bootMessages";
import { axeViolations } from "./testing/axe";

afterEach(() => {
  cleanup();
});

describe("first-load failure (ADR-039 D4)", () => {
  it.each(SUPPORTED_LOCALES)("shows the error and a retry in %s without a catalog", async (locale) => {
    const onRetry = vi.fn();
    render(<BootError locale={locale} onRetry={onRetry} />);

    expect(screen.getByRole("alert").textContent).toContain(BOOT_MESSAGES[locale].error);
    expect(screen.getByRole("main").getAttribute("lang")).toBe(locale);
    fireEvent.click(screen.getByRole("button", { name: BOOT_MESSAGES[locale].retry }));
    expect(onRetry).toHaveBeenCalledOnce();
    expect(await axeViolations()).toEqual([]);
  });
});
