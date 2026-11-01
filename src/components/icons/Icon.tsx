import type { Fill, Shape } from "./iconData";
import { ICONS, LOGO, type IconName } from "./iconData";
import { ILLUSTRATIONS, type IllustrationName } from "./illustrationData";

/** Full class names, so that Tailwind generates every fill (docs/en/UI_DESIGN.md §5). */
const FILL_CLASS: Readonly<Record<Fill, string>> = {
  mint: "fill-mint",
  butter: "fill-butter",
  sky: "fill-sky",
  peach: "fill-peach",
  ink: "fill-current",
  surface: "fill-surface",
  primary: "fill-primary",
  accent: "fill-accent",
  sun: "fill-sun",
};

function Shapes({ shapes }: { readonly shapes: readonly Shape[] }) {
  return shapes.map((shape, index) => (
    <path
      // Shapes are static data in a fixed order, so the index is a stable key.
      key={index}
      d={shape.d}
      className={[shape.fill === undefined ? "fill-none" : FILL_CLASS[shape.fill], shape.stroke === false ? "stroke-none" : shape.knockout === true ? "stroke-surface" : ""].join(" ").trim()}
      {...(shape.dashed === true ? { strokeDasharray: "2.6 2.4" } : {})}
    />
  ));
}

/**
 * An original two-tone icon (ADR-037 D3). Without a label it is decorative and hidden from
 * assistive technology; with a label it is an image with that accessible name.
 */
export function Icon({ name, label, size = 24, className = "" }: { readonly name: IconName; readonly label?: string; readonly size?: number; readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={`inline-block shrink-0 ${className}`.trim()}
      {...(label === undefined ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
    >
      <Shapes shapes={ICONS[name]} />
    </svg>
  );
}

/** A decorative illustration (ADR-037 D4); always hidden from assistive technology. */
export function Illustration({ name, className = "" }: { readonly name: IllustrationName; readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 240 150"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden="true"
      className={`block h-auto max-w-full ${className}`.trim()}
    >
      <Shapes shapes={ILLUSTRATIONS[name]} />
    </svg>
  );
}

/** The header logo (docs/en/UI_DESIGN.md §5); decorative, next to the product name in text. */
export function Logo({ size = 28, className = "" }: { readonly size?: number; readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`.trim()}
    >
      <Shapes shapes={LOGO} />
    </svg>
  );
}
