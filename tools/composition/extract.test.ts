import { describe, expect, it } from "vitest";
import { NUTRIENT_IDS } from "../../shared/composition.ts";
import { extractFoods, listFoods } from "./extract.ts";

// Mirrors the MEXT layout: Japanese headers with ideographic spaces, an
// identifier row, then food rows. Columns are deliberately out of order.
const ids = ["", "", "", "成分識別子", "REFUSE", "ENERC", ...NUTRIENT_IDS.slice().reverse(), "VITK "];
const header = ["食　品　群", "食　品　番　号", "索　引　番　号", "食　品　名"];

function foodRow(code: string, name: string, values: Partial<Record<string, string>>): string[] {
  return ids.map((id, index) => {
    if (index === 0) return code.slice(0, 2);
    if (index === 1) return code;
    if (index === 2) return "0001";
    if (index === 3) return name;
    return values[id.trim()] ?? "1.0";
  });
}

const rows = [
  ["", "", "", "", "", "", "更新日"],
  header,
  ids,
  foodRow("11220", "にわとり　むね　皮なし　生", { REFUSE: "0", ENERC_KCAL: "105", "PROT-": "23.3", PROTCAA: "(19.2)", FATNLEA: "-" }),
  foodRow("01088", "こめ　めし", { "FIB-": "Tr" }),
  ["", "", "", "注：説明行"],
];

describe("extractFoods", () => {
  it("locates columns by identifiers and headers and keeps notations", () => {
    const [rice, chicken] = extractFoods(rows, ["11220", "01088"]);

    expect(rice?.code).toBe("01088");
    expect(rice?.nutrients["FIB-"]).toEqual({ value: 0, notation: "trace" });
    expect(chicken).toMatchObject({
      code: "11220",
      nameJa: "にわとり むね 皮なし 生",
      refuse: { value: 0, notation: "zero" },
      nutrients: {
        ENERC_KCAL: { value: 105, notation: "measured" },
        "PROT-": { value: 23.3, notation: "measured" },
        PROTCAA: { value: 19.2, notation: "estimated" },
        FATNLEA: { value: null, notation: "unmeasured" },
      },
    });
  });

  it("fails on unknown codes", () => {
    expect(() => extractFoods(rows, ["99999"])).toThrow(/99999/);
  });

  it("fails on an unrecognized value with the food and column", () => {
    const bad = [...rows, foodRow("06263", "ブロッコリー", { "FAT-": "*" })];
    expect(() => extractFoods(bad, ["06263"])).toThrow(/Food 06263, column \d+: Unrecognized/);
  });

  it("fails when a required identifier is missing", () => {
    const noProtein = rows.map((row) => row.map((cell) => (cell === "PROT-" ? "" : cell)));
    expect(() => extractFoods(noProtein, ["11220"])).toThrow(/PROT-/);
  });

  it("lists food rows only", () => {
    expect(listFoods(rows).map((food) => food.code)).toEqual(["11220", "01088"]);
  });
});
