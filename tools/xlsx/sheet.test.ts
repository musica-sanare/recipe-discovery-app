import { describe, expect, it } from "vitest";
import { buildZip } from "./testZip.ts";
import { columnIndex, parseSharedStrings, parseSheetRows, readWorksheet } from "./sheet.ts";

const SHARED = `<sst><si><t>食品名</t><rPh sb="0" eb="3"><t>ショクヒンメイ</t></rPh></si><si><r><t>A</t></r><r><t xml:space="preserve"> &amp; B</t></r></si></sst>`;
const SHEET = `<worksheet><sheetData>
<row r="1"><c r="A1" t="s"><v>0</v></c><c r="C1" t="s"><v>1</v></c></row>
<row r="2"><c r="B2"><v>64.900000000000006</v></c><c r="C2" t="inlineStr"><is><t>(Tr)</t></is></c><c r="D2"/></row>
<row r="3"/>
</sheetData></worksheet>`;

describe("SpreadsheetML parsing", () => {
  it("drops phonetic runs and joins rich text", () => {
    expect(parseSharedStrings(SHARED)).toEqual(["食品名", "A & B"]);
  });

  it("returns dense rows with blanks for missing cells", () => {
    expect(parseSheetRows(SHEET, parseSharedStrings(SHARED))).toEqual([["食品名", "", "A & B"], ["", "64.900000000000006", "(Tr)", ""], []]);
  });

  it("converts column letters", () => {
    expect(columnIndex("A1")).toBe(0);
    expect(columnIndex("Z9")).toBe(25);
    expect(columnIndex("AA10")).toBe(26);
    expect(columnIndex("BJ12")).toBe(61);
  });

  it("reads a worksheet by tab name through the workbook relations", () => {
    const xlsx = buildZip({
      "xl/workbook.xml": `<workbook><sheets><sheet name="表全体" sheetId="1" r:id="rId9"/><sheet name="other" sheetId="2" r:id="rId2"/></sheets></workbook>`,
      "xl/_rels/workbook.xml.rels": `<Relationships><Relationship Id="rId9" Type="x" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="x" Target="worksheets/sheet2.xml"/></Relationships>`,
      "xl/sharedStrings.xml": SHARED,
      "xl/worksheets/sheet1.xml": SHEET,
      "xl/worksheets/sheet2.xml": "<worksheet><sheetData/></worksheet>",
    });

    expect(readWorksheet(xlsx, "表全体")[0]).toEqual(["食品名", "", "A & B"]);
    expect(() => readWorksheet(xlsx, "missing")).toThrow(/Worksheet not found/);
  });
});
