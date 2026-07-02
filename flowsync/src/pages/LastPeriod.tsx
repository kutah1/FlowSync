import { useState } from "react";
import { useNavigate } from "react-router";
import Calendar from "../components/Calendar";
import Button from "../components/ui/Button";
import OnboardingLayout from "../components/layout/OnboardingLayout";

export default function LastPeriod() {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      step={2}
      totalSteps={4}
      backTo="/onboarding/welcome"
      onSkip={() => navigate("/onboarding/style")}
      footer={
        <div className="space-y-1">
          <Button fullWidth size="lg" onClick={() => navigate("/onboarding/cycle-length")}>
            Continue
          </Button>
          <button
            onClick={() => navigate("/onboarding/style")}
            className="w-full py-3 text-sm text-neutral-500 hover:text-neutral-700"
          >
            I don't track my cycle
          </button>
        </div>
      }
    >
      <div className="mt-6">
        <h1 className="text-3xl font-bold leading-tight text-neutral-900">
          When did your last
          <br />
          period start?
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-neutral-500">
          This helps us calculate your current phase and sync your productivity schedule.
        </p>

        <div className="mt-7">
          <Calendar value={date} onChange={setDate} />
        </div>
      </div>
    </OnboardingLayout>
  );
}
