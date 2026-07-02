import type { ReactNode } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router";
import StepIndicator from "../ui/StepIndicator";

interface Props {
  step: number;
  totalSteps: number;
  /** where the back arrow goes; omit to hide back */
  backTo?: string;
  /** optional skip action shown top-right */
  onSkip?: () => void;
  children: ReactNode;
  /** sticky footer (usually the primary CTA) */
  footer: ReactNode;
}

/** Consistent frame for every onboarding step: soft gradient, top progress, sticky footer. */
export default function OnboardingLayout({
  step,
  totalSteps,
  backTo,
  onSkip,
  children,
  footer,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-soft via-white to-sand">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 pb-6 pt-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          {backTo ? (
            <button
              onClick={() => navigate(backTo)}
              aria-label="Back"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-neutral-600 shadow-sm hover:bg-white"
            >
              <FiArrowLeft />
            </button>
          ) : (
            <div className="w-10" />
          )}

          <StepIndicator total={totalSteps} current={step} />

          {onSkip ? (
            <button
              onClick={onSkip}
              className="text-sm font-medium text-neutral-400 hover:text-neutral-600"
            >
              Skip
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col">{children}</div>

        {/* Sticky footer */}
        <div className="pt-6">{footer}</div>
      </div>
    </div>
  );
}
