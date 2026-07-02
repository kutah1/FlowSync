import {
  FiGlobe,
  FiPlus,
  FiShare2,
} from "react-icons/fi";
import { Link } from "react-router";

export default function LandingCard() {
  return (
    <div className="min-h-screen bg-[#F7F4F3] flex justify-center items-center p-4">
      <div className="relative flex flex-col justify-between w-full max-w-[360px] min-h-[680px] rounded-3xl bg-gradient-to-b from-[#F8EEF2] via-white to-[#F8F7F5] overflow-hidden shadow-sm">

        {/* Hero */}
        <section className="px-6 pt-12 text-center">
          <h1 className="text-[42px] leading-[1.05] font-extrabold tracking-tight text-[#1E1E1E]">
            Ready to find your
            <br />
            natural
            <br />
            frequency?
          </h1>

          <p className="mt-5 text-[15px] leading-6 text-gray-500">
            Join 50,000+ humans working smarter, not harder.
          </p>

          <div className="mt-10 space-y-4">
            <Link to="/signup" className="flex w-full h-14 items-center justify-center rounded-full bg-[#635BFF] text-white font-medium shadow-lg shadow-indigo-300/40 transition hover:bg-[#574ff2]">
              Start Your Free Trial
            </Link>

            <Link to="/login" className="flex w-full h-14 items-center justify-center rounded-full border border-gray-300 bg-white font-medium text-gray-700 transition hover:bg-gray-50">
              Log In
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t bg-white/80 backdrop-blur-sm px-6 py-6">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#635BFF] text-white font-bold">
              F
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                FlowSync
              </h3>

              <p className="text-xs text-gray-500">
                Productivity Wellness. All rights reserved.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              © 2024 FlowSync
            </p>

            <div className="flex items-center gap-5 text-gray-600">
              <FiShare2 size={18} className="cursor-pointer" />
              <FiGlobe size={18} className="cursor-pointer" />
            </div>
          </div>

          {/* Floating Action Button */}
          <button className="absolute -top-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#635BFF] text-white shadow-xl transition hover:scale-105">
            <FiPlus size={26} />
          </button>
        </footer>
      </div>
    </div>
  );
}
