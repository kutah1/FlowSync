import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <svg width="34" height="18" viewBox="0 0 34 18" fill="none">
            <path
              d="M2 9C5 2 10 2 15 9C20 16 25 16 32 9"
              stroke="#6554E8"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <h1 className="text-2xl font-semibold text-neutral-800">FlowSync</h1>
        </Link>

        {/* Card */}
        <div className="rounded-[28px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.05)] px-7 py-8">
          <h2 className="text-[32px] font-bold leading-none text-neutral-900">
            Welcome back
          </h2>
          <p className="mt-3 text-[15px] text-neutral-500">
            Let's sync your day with your energy.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/app/dashboard");
            }}
          >
            <div>
              <label className="mb-2 block text-xs font-semibold text-neutral-700">
                Email
              </label>
              <input
                type="email"
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
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 w-full rounded-full bg-sand-field px-6 pr-14 text-[15px] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500"
                >
                  {showPassword ? (
                    <HiOutlineEye size={20} />
                  ) : (
                    <HiOutlineEyeOff size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white shadow-brand transition hover:bg-brand-dark"
            >
              Log In
              <HiArrowRight size={18} />
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-neutral-500">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-brand">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
