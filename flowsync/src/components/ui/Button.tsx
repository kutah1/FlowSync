import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";

type Variant = "primary" | "secondary" | "ghost" | "soft";
type Size = "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-brand hover:bg-brand-dark active:scale-[0.99]",
  secondary:
    "bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50",
  ghost: "bg-transparent text-brand hover:bg-brand-soft",
  soft: "bg-brand-soft text-brand hover:bg-[#E7E3FF]",
};

const sizes: Record<Size, string> = {
  // min 44px touch targets
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

function classes({
  variant = "primary",
  size = "lg",
  fullWidth,
  className = "",
}: BaseProps) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Button that navigates (renders an <a> via react-router Link). */
export function LinkButton({ to, ...props }: BaseProps & { to: string }) {
  const { leftIcon, rightIcon, children } = props;
  return (
    <Link to={to} className={classes(props)}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
}

/** Standard action button. */
export default function Button({
  leftIcon,
  rightIcon,
  children,
  variant,
  size,
  fullWidth,
  className,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classes({ variant, size, fullWidth, className, children })}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
