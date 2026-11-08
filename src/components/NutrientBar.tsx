import type { BarGeometry } from "../views/nutritionBar";

/**
 * A nutrition bar (ADR-041 D4): the target band in the nutrient's pastel with edges in
 * `muted`, the estimate range as a line, and the value as a dot. Decorative: the texts next
 * to it say the same, so it is hidden from assistive technology, in forced colors, and in print.
 */
export function NutrientBar({ geometry, fill }: { readonly geometry: BarGeometry; readonly fill: string }) {
  const { band, bandEdges, range, value } = geometry;
  return (
    <div aria-hidden="true" className="relative h-3.5 rounded-full bg-surface-muted forced-colors:hidden print:hidden">
      <div
        className={`absolute inset-y-0 rounded-full border-muted ${fill} ${bandEdges.start ? "border-l-2" : ""} ${bandEdges.end ? "border-r-2" : ""}`}
        style={{ left: `${String(band.from)}%`, width: `${String(band.to - band.from)}%` }}
      />
      {range !== undefined && <div className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-text" style={{ left: `${String(range.from)}%`, width: `${String(range.to - range.from)}%` }} />}
      <div className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text ring-2 ring-surface" style={{ left: `${String(value)}%` }} />
    </div>
  );
}
