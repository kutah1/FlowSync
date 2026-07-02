import { useState } from "react";
import {
  IoBriefcaseOutline,
  IoSchoolOutline,
  IoStorefrontOutline,
  IoColorPaletteOutline,
  IoHeartOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import OnboardingLayout from "../components/layout/OnboardingLayout";

const styles = [
  { label: "Work", icon: IoBriefcaseOutline },
  { label: "School", icon: IoSchoolOutline },
  { label: "Business", icon: IoStorefrontOutline },
  { label: "Creative projects", icon: IoColorPaletteOutline },
  { label: "Personal tasks", icon: IoHeartOutline },
];

export default function ProductivityStyle() {
  const [selected, setSelected] = useState<string[]>(["Work"]);
  const navigate = useNavigate();

  const toggle = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );

  return (
    <OnboardingLayout
      step={4}
      totalSteps={4}
      backTo="/onboarding/cycle-length"
      onSkip={() => navigate("/app/dashboard")}
      footer={
        <Button
          fullWidth
          size="lg"
          disabled={selected.length === 0}
          onClick={() => navigate("/app/dashboard")}
        >
          Finish Setup →
        </Button>
      }
    >
      <div className="mt-6">
        <h1 className="text-3xl font-bold leading-tight text-neutral-900">
          What do you want to
          <br />
          focus on?
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-neutral-500">
          Pick anything that fits — MiniMe tailors suggestions to your world. You can change
          this anytime.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {styles.map(({ label, icon: Icon }) => {
            const active = selected.includes(label);
            return (
              <button
                key={label}
                onClick={() => toggle(label)}
                aria-pressed={active}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    active ? "bg-brand text-white" : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  <Icon size={20} />
                </span>
                <span className="font-medium">{label}</span>
                <span
                  className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${
                    active ? "border-brand bg-brand text-white" : "border-neutral-300 text-transparent"
                  }`}
                >
                  ✓
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </OnboardingLayout>
  );
}
