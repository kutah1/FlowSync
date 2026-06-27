import { HiPlay } from "react-icons/hi2";

export default function Section1() {
  return (
    <div className="min-h-screen bg-[#F9F8F6]">

      {/* Header */}

      <header className="flex items-center justify-between px-6 py-5">

        <div className="flex items-center gap-2">

          <svg width="34" height="18" viewBox="0 0 34 18" fill="none">
            <path
              d="M2 9C5 2 10 2 15 9C20 16 25 16 32 9"
              stroke="#6554E8"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <span className="font-semibold text-neutral-800">
            FlowSync
          </span>

        </div>

        <div className="flex items-center gap-5">

          <button className="font-semibold text-sm text-[#6554E8]">
            Login
          </button>

          <button className="rounded-full bg-[#6554E8] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(101,84,232,.35)]">
            Get Started
          </button>

        </div>

      </header>

      {/* Hero */}

      <section className="relative overflow-hidden px-8 pt-12 pb-20">

        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-[#8A74FF]/30 blur-[110px]" />

        <span className="inline-flex items-center rounded-full bg-[#DDF5C8] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#61735A]">
          ✦ THE FUTURE OF WELLBEING
        </span>

        <h1 className="mt-8 text-[54px] font-bold leading-[1.05] tracking-[-2px] text-[#232323]">

          Work with{" "}
          <span className="italic text-[#6554E8]">
            your rhythm,
          </span>{" "}
          not against it.

        </h1>

        <p className="mt-8 max-w-md text-lg leading-8 text-[#5C5967]">
          Plan your day based on your energy levels,
          mental wellbeing, and cycle phase.
          Achieve peak performance without burnout.
        </p>

        <button className="mt-14 h-16 w-full rounded-full bg-[#6554E8] text-lg font-medium text-white shadow-[0_16px_35px_rgba(101,84,232,.28)] transition hover:translate-y-[-1px]">
          Get Started Free
        </button>

        <button className="mt-12 flex w-full items-center justify-center gap-2 text-[#6554E8]">

          <HiPlay className="rounded-full border border-current p-[2px]" />

          <span className="font-medium">
            Learn How It Works
          </span>

        </button>

      </section>

    </div>
  );
}