import type { ReactNode } from "react";
import type { BarGeometry } from "../views/nutritionBar";
import { NutrientBar } from "./NutrientBar";

/**
 * One nutrient in a `dl` (ADR-041 D4): the label and the value on one line, the bar when a
 * target is set, and the notes below (range, status, target). The `dd` shares the row's
 * grid through `subgrid`, so the value sits next to the label without leaving the `dd`.
 */
export function NutrientLine({ label, value, bar, fill, size, children }: { readonly label: string; readonly value: string; readonly bar: BarGeometry | undefined; readonly fill: string; readonly size: "card" | "detail"; readonly children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto_auto] gap-x-3 gap-y-1">
      <dt className="col-start-1 row-start-1 self-baseline font-bold">{label}</dt>
      <dd className="col-span-2 col-start-1 row-span-3 row-start-1 m-0 grid grid-cols-subgrid grid-rows-subgrid">
        <span className={`col-start-2 row-start-1 self-baseline text-right font-extrabold tabular-nums leading-tight ${size === "card" ? "text-xl" : "text-2xl"}`}>{value}</span>
        {bar !== undefined && (
          <div className="col-span-2 row-start-2">
            <NutrientBar geometry={bar} fill={fill} />
          </div>
        )}
        <span className="col-span-2 row-start-3 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[0.8125rem]">{children}</span>
      </dd>
    </div>
  );
}
