import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

/** Rounded white surface used across the app (Gestalt grouping). */
export default function Card({
  children,
  padded = true,
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        "rounded-3xl bg-white border border-neutral-100 shadow-sm",
        padded ? "p-5 sm:p-6" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
