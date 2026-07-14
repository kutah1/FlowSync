/**
 * Hex mirrors of the Tailwind theme tokens, for contexts that can't take a
 * class name — SVG `stroke`/`fill` and Recharts props.
 * Keep in sync with `tailwind.config.js`.
 */

export const BRAND = "#6554E8";
export const BRAND_DARK = "#5041C4";
export const BRAND_SOFT = "#F2F0FF";

export const SAND = "#F7F6F5";

/** Chart gridlines / inactive track. */
export const GRID = "#EDEBE8";

export const PHASE = {
  menstrual: "#EC4899",
  follicular: "#22C55E",
  ovulation: "#F59E0B",
  luteal: "#8B5CF6",
} as const;

export type Phase = keyof typeof PHASE;
