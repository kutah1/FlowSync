import { FiHeart } from "react-icons/fi";
import { PiFlowerLotusThin } from "react-icons/pi";
import { LinkButton } from "../components/ui/Button";
import MiniMe from "../components/MiniMe";
import OnboardingLayout from "../components/layout/OnboardingLayout";

export default function WelcomeScreen() {
  return (
    <OnboardingLayout
      step={1}
      totalSteps={4}
      footer={
        <LinkButton to="/onboarding/cycle" fullWidth size="lg">
          Continue
        </LinkButton>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {/* Avatar with floating chips */}
        <div className="relative mt-6">
          <div className="absolute -right-10 top-0 flex items-center gap-1 rounded-full bg-white px-3 py-2 shadow-lg">
            <PiFlowerLotusThin className="text-brand" />
            <span className="text-sm font-medium text-brand">RK</span>
          </div>
          <div className="absolute -left-8 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
            <FiHeart size={14} className="text-pink-400" />
          </div>

          <MiniMe size={128} />
        </div>

        <h1 className="mt-12 text-4xl font-bold leading-tight text-neutral-900">
          Hi Sarah 👋
          <br />
          I'm MiniMe.
        </h1>

        <p className="mt-5 max-w-xs text-[15px] leading-7 text-neutral-500">
          I'll help you decide what deserves your
          <span className="font-semibold text-brand"> energy </span>
          today — so your tasks match your natural rhythm.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-brand">
        <PiFlowerLotusThin />
        <span className="text-sm font-medium">FlowSync</span>
      </div>
    </OnboardingLayout>
  );
}
