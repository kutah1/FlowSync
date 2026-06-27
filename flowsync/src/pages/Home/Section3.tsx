import { LuCalendarDays } from "react-icons/lu";

export default function HarmonySteps() {
  return (
    <section className="min-h-screen bg-[#F8F7F5] px-6 py-10">
      <div className="mx-auto max-w-sm">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl font-bold leading-tight text-gray-900">
            Harmony in three
            <br />
            steps
          </h1>

          <p className="mt-5 text-[17px] leading-7 text-gray-500">
            Our unique synchronization engine aligns your task list with your
            biological peak periods for effortless productivity.
          </p>
        </div>

        {/* Step */}
        <div className="mt-24">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-sm">
            <LuCalendarDays className="text-2xl text-white" />
          </div>

          <h2 className="mt-8 text-3xl font-semibold text-gray-900">
            1. Daily Check-In
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-500">
            Start your morning with a 30-second prompt.
            <br />
            Note your sleep quality, mood, and physical energy to set your
            baseline.
          </p>
        </div>
      </div>
    </section>
  );
}
