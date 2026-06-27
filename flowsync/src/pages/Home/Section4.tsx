import {
  LuCalendarDays,
  LuTrendingUp,
  LuShieldCheck,
} from "react-icons/lu";

type StepItemProps = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
};

function StepItem({
  icon,
  iconBg,
  title,
  description,
}: StepItemProps) {
  return (
    <div className="mt-24">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
      >
        {icon}
      </div>

      <h2 className="mt-8 text-3xl font-semibold tracking-tight text-gray-900">
        {title}
      </h2>

      <p className="mt-5 text-lg leading-8 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function Steps() {
  return (
    <section className="bg-[#F8F7F5] px-5 py-10">
      <div className="mx-auto max-w-sm">
        {/* Step 1 */}
        <StepItem
          icon={
            <LuCalendarDays className="text-[26px] text-white" />
          }
          iconBg="bg-violet-600"
          title="1. Daily Check-In"
          description="Start your morning with a 30-second prompt. Note your sleep quality, mood, and physical energy to set your baseline."
        />

        {/* Step 2 */}
        <StepItem
          icon={
            <LuTrendingUp className="text-[24px] text-[#5D715B]" />
          }
          iconBg="bg-[#D7F0CB]"
          title="2. Understand Your Energy"
          description="FlowSync analyzes your data against historic trends and cycle phases to predict your high-focus and low-energy windows."
        />

        {/* Step 3 */}
        <StepItem
          icon={
            <LuShieldCheck className="text-[24px] text-[#5B4257]" />
          }
          iconBg="bg-[#F8D8EB]"
          title="3. Prioritize Smarter"
          description="Your tasks are automatically sorted. Deep work during peaks, admin during lulls, and rest when you need it most."
        />
      </div>
    </section>
  );
}
