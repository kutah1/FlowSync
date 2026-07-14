import { FiGlobe, FiShare2 } from "react-icons/fi";
import { Link } from "react-router";

export default function LandingCard() {
  return (
    <div className="bg-gradient-to-b from-blush/40 via-white to-sand">
      {/* Final CTA */}
      <section className="px-6 py-20 text-center sm:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
            Ready to find your
            <br />
            natural frequency?
          </h1>

          <p className="mx-auto mt-6 max-w-content text-[15px] leading-7 text-neutral-500 sm:text-lg sm:leading-8">
            Join 50,000+ humans working smarter, not harder.
          </p>

          {/* Stacked on mobile, side by side once there's room */}
          <div className="mx-auto mt-10 flex w-full max-w-md flex-col gap-4 sm:max-w-xl sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="flex h-14 items-center justify-center rounded-full bg-brand px-8 font-medium text-white shadow-brand transition hover:bg-brand-dark sm:min-w-[220px]"
            >
              Start Your Free Trial
            </Link>

            <Link
              to="/login"
              className="flex h-14 items-center justify-center rounded-full border border-neutral-300 bg-white px-8 font-medium text-neutral-700 transition hover:bg-neutral-50 sm:min-w-[180px]"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white/80 px-6 py-10 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">
              F
            </div>

            <div>
              <h3 className="font-semibold text-neutral-800">FlowSync</h3>
              <p className="text-xs text-neutral-500">
                Productivity Wellness. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 sm:justify-end">
            <p className="text-xs text-neutral-500">© 2024 FlowSync</p>

            <div className="flex items-center gap-5 text-neutral-600">
              <a href="#" aria-label="Share" className="transition hover:text-brand">
                <FiShare2 size={18} />
              </a>
              <a href="#" aria-label="Website" className="transition hover:text-brand">
                <FiGlobe size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
