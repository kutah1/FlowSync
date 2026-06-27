import { FiHeart } from "react-icons/fi";
import { PiFlowerLotusThin } from "react-icons/pi";

export default function WelcomeScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F5] p-4">
      <div className="relative w-[390px] h-[844px] overflow-hidden rounded-[32px] bg-gradient-to-b from-[#F9F6F8] via-white to-[#F8F6F5]">

        {/* Background Glow */}
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[#7A5AF8]/10 blur-3xl" />

        {/* Content */}
        <div className="relative flex h-full flex-col items-center px-8">

          {/* Top */}
          <span className="mt-12 text-sm font-medium tracking-wide text-gray-300">
            Welcome Screen
          </span>

          {/* Avatar Area */}
          <div className="relative mt-20">

            {/* RK bubble */}
            <div className="absolute -right-12 top-2 flex items-center gap-1 rounded-full bg-white px-3 py-2 shadow-lg">
              <PiFlowerLotusThin className="text-[#6758F3]" />
              <span className="font-medium text-[#6758F3]">RK</span>
            </div>

            {/* Heart bubble */}
            <div className="absolute -left-8 bottom-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
              <FiHeart size={14} className="text-gray-500" />
            </div>

            {/* Avatar Shadow */}
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#7A5AF8]/20 blur-md absolute top-3 left-3" />

            {/* Avatar */}
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-2xl">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-[#6A5AE0]">

                <div className="mb-2 flex gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>

                <div className="h-3 w-6 rounded-b-full border-b-2 border-white" />
              </div>
            </div>

          </div>

          {/* Text */}
          <div className="mt-16 text-center">

            <h1 className="text-4xl font-bold leading-tight text-[#262626]">
              Hi Sarah👋
              <br />
              I'm MiniMe.
            </h1>

            <p className="mt-6 text-[15px] leading-7 text-gray-500">
              I'll help guide you through
              <span className="text-[#6A5AE0]"> FlowSync </span>
              and make sure your tasks match your energy.
            </p>

          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Button */}
          <button className="h-14 w-full rounded-full bg-[#6558F5] text-lg font-semibold text-white shadow-xl shadow-indigo-300 transition hover:bg-[#5649E7] active:scale-[0.98]">
            Continue
          </button>

          <p className="mt-6 text-xs font-semibold tracking-[0.35em] text-gray-400">
            STEP 1 OF 4 • WELCOME
          </p>

          {/* Footer */}
          <div className="mb-10 mt-16 flex items-center gap-2 text-[#6558F5]">
            <PiFlowerLotusThin />
            <span className="font-medium">FlowSync</span>
          </div>

        </div>
      </div>
    </div>
  );
}
