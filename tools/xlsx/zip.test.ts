import { describe, expect, it } from "vitest";
import { buildZip } from "./testZip.ts";
import { readZipEntries } from "./zip.ts";

describe("readZipEntries", () => {
  it("reads deflated entries", () => {
    const entries = readZipEntries(buildZip({ "a.txt": "hello", "dir/b.xml": "<x>日本語</x>" }));

    expect(entries.get("a.txt")?.toString()).toBe("hello");
    expect(entries.get("dir/b.xml")?.toString()).toBe("<x>日本語</x>");
  });

  it("rejects corrupted data", () => {
    const zip = buildZip({ "a.txt": "hello hello hello" });
    zip[35] = (zip[35] ?? 0) ^ 0xff;

    expect(() => readZipEntries(zip)).toThrow();
  });

  it("rejects non-ZIP input", () => {
    expect(() => readZipEntries(Buffer.from("not a zip file at all, just text"))).toThrow(/end of central directory/);
  });
});
