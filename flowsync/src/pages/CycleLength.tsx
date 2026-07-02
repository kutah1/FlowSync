import { useState } from "react";
import {
  IoCalendarOutline,
  IoInformationCircleOutline,
  IoCreateOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import OnboardingLayout from "../components/layout/OnboardingLayout";

export default function CycleLength() {
  const [selected, setSelected] = useState(28);
  const navigate = useNavigate();

  const options = [
    { value: 21, title: "21 days", subtitle: "Short", icon: <IoCalendarOutline size={22} /> },
    { value: 28, title: "28 days", subtitle: "Typical", icon: <IoCalendarOutline size={22} /> },
    { value: 35, title: "35 days", subtitle: "Long", icon: <IoCalendarOutline size={22} /> },
    { value: 0, title: "Custom", subtitle: "Other", icon: <IoCreateOutline size={22} /> },
  ];

  return (
    <OnboardingLayout
      step={3}
      totalSteps={4}
      backTo="/onboarding/cycle"
      onSkip={() => navigate("/onboarding/style")}
      footer={
        <div className="space-y-3">
          <Button fullWidth size="lg" onClick={() => navigate("/onboarding/style")}>
            Continue →
          </Button>
          <p className="text-center text-[10px] tracking-wider text-neutral-400">
            ENCRYPTION SECURED • PRIVACY FIRST
          </p>
        </div>
      }
    >
      <div className="mt-6 text-center">
        <h1 className="text-3xl font-bold leading-tight text-neutral-900">
          What's your average
          <br />
          cycle length?
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-neutral-500">
          This helps us predict your high-focus and recovery phases with greater accuracy.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        {options.map((item) => {
          const active = selected === item.value;
          return (
            <button
              key={item.title}
              onClick={() => setSelected(item.value)}
              aria-pressed={active}
              className={`rounded-3xl border p-5 text-left transition-all duration-200 ${
                active
                  ? "border-brand bg-brand text-white shadow-brand scale-[1.02]"
                  : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300"
              }`}
            >
              <div
                className={`mb-6 flex h-10 w-10 items-center justify-center rounded-xl ${
                  active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className={`text-sm ${active ? "text-white/80" : "text-neutral-400"}`}>
                {item.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-6 flex gap-3 rounded-2xl bg-green-50 p-4">
        <IoInformationCircleOutline size={22} className="mt-0.5 shrink-0 text-green-600" />
        <p className="text-sm leading-6 text-neutral-600">
          Don't worry if you're not sure! Most people fall within{" "}
          <strong>25–30 days.</strong> You can adjust this later in settings.
        </p>
      </div>
    </OnboardingLayout>
  );
}
