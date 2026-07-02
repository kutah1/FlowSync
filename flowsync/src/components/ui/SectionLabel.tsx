import type { ReactNode } from "react";

/** Uppercase eyebrow label for grouping sections (Gestalt similarity). */
export default function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={[
        "text-[11px] font-semibold uppercase tracking-widest text-neutral-400",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}
