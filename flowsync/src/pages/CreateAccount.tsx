// Register.tsx

import { HiOutlineEyeOff } from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router";

export default function CreateAccount() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-sm">

        {/* Logo */}

        <Link to="/" className="flex justify-center items-center gap-2 mb-8">

          <svg
            width="34"
            height="18"
            viewBox="0 0 34 18"
            fill="none"
          >
            <path
              d="M2 9C5 2 10 2 15 9C20 16 25 16 32 9"
              stroke="#6554E8"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <h1 className="text-2xl font-semibold text-neutral-800">
            FlowSync
          </h1>

        </Link>

        {/* Card */}

        <div className="rounded-[28px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.05)] px-7 py-8">

          <h2 className="text-[34px] font-bold leading-none text-neutral-900">
            Create Account
          </h2>

          <p className="mt-3 text-[15px] text-neutral-500">
            Sync your productivity with your biology.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/onboarding/welcome");
            }}
          >

            <div>
              <label className="mb-2 block text-xs font-semibold text-neutral-700">
                Name
              </label>

              <input
                placeholder="Janice Miller"
                className="h-14 w-full rounded-full bg-sand-field px-6 text-[15px] outline-none placeholder:text-neutral-400"
              />
            </div>

            <div>

              <label className="mb-2 block text-xs font-semibold text-neutral-700">
                Email
              </label>

              <input
                placeholder="janice@flowsync.com"
                className="h-14 w-full rounded-full bg-sand-field px-6 text-[15px] outline-none placeholder:text-neutral-400"
              />

            </div>

            <div>

              <label className="mb-2 block text-xs font-semibold text-neutral-700">
                Password
              </label>

              <div className="relative">

                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-14 w-full rounded-full bg-sand-field px-6 pr-14 text-[15px] outline-none"
                />

                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500"
                >
                  <HiOutlineEyeOff size={20} />
                </button>

              </div>

            </div>

            <button
              type="submit"
              className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white shadow-brand transition hover:bg-brand-dark"
            >
              Create Account
              <HiArrowRight size={18} />
            </button>

          </form>

          <p className="mt-10 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand">
              Log In
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}