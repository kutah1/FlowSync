import type { ReactNode } from "react";
import { LuCalendarDays, LuTrendingUp, LuShieldCheck } from "react-icons/lu";

type StepItemProps = {
  step: string;
  icon: ReactNode;
  iconBg: string;
  title: string;
  description: string;
};

function StepItem({ step, icon, iconBg, title, description }: StepItemProps) {
  return (
    <div className="rounded-3xl border border-neutral-100 bg-white p-7 shadow-sm">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
        {icon}
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand">
        Step {step}
      </p>
      <h3 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-7 text-neutral-500">{description}</p>
    </div>
  );
}

export default function Steps() {
  return (
    <section className="bg-sand px-6 pb-20">
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
        <StepItem
          step="1"
          icon={<LuCalendarDays className="text-[26px] text-white" />}
          iconBg="bg-brand"
          title="Daily Check-In"
          description="Start your morning with a 30-second prompt. Note your sleep, mood, and energy to set your baseline."
        />
        <StepItem
          step="2"
          icon={<LuTrendingUp className="text-[24px] text-mint-ink" />}
          iconBg="bg-mint"
          title="Understand Your Energy"
          description="FlowSync analyzes your data against cycle phases to predict your high-focus and low-energy windows."
        />
        <StepItem
          step="3"
          icon={<LuShieldCheck className="text-[24px] text-blush-ink" />}
          iconBg="bg-blush"
          title="Prioritize Smarter"
          description="Your tasks are automatically sorted — deep work during peaks, admin during lulls, rest when you need it."
        />
      </div>
    </section>
  );
}
