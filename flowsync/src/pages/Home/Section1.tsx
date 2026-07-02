import { HiPlay } from "react-icons/hi2";
import { Link } from "react-router";

export default function Section1() {
  return (
    <div className="bg-[#F9F8F6]">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <svg width="34" height="18" viewBox="0 0 34 18" fill="none">
            <path
              d="M2 9C5 2 10 2 15 9C20 16 25 16 32 9"
              stroke="#6554E8"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-semibold text-neutral-800">FlowSync</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link to="/login" className="text-sm font-semibold text-brand">
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-dark sm:px-6"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-12 sm:pt-16">
        <div className="pointer-events-none absolute -left-10 top-0 h-80 w-80 rounded-full bg-brand-light/30 blur-[110px]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-[#DDF5C8] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#61735A]">
            ✦ The future of wellbeing
          </span>

          <h1 className="mt-8 text-[40px] font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl">
            Work with{" "}
            <span className="italic text-brand">your rhythm,</span> not against it.
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-[#5C5967]">
            Plan your day based on your energy levels, mental wellbeing, and cycle phase.
            Achieve peak performance without burnout.
          </p>

          <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4">
            <Link
              to="/signup"
              className="flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-medium text-white shadow-brand transition hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>

            <button className="flex items-center justify-center gap-2 text-brand">
              <HiPlay className="rounded-full border border-current p-[2px]" />
              <span className="font-medium">Learn How It Works</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
