import { FiZap } from "react-icons/fi";

export default function ProductPreview() {
  return (
    <section className="bg-[#F9F8F6] px-6 py-12">
      <div className="mx-auto max-w-sm">
        {/* Social Proof */}
        <div className="mb-8 flex items-center">
          <div className="flex -space-x-3">
            <img
              src="https://i.pravatar.cc/80?img=32"
              className="h-10 w-10 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://i.pravatar.cc/80?img=12"
              className="h-10 w-10 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://i.pravatar.cc/80?img=48"
              className="h-10 w-10 rounded-full border-2 border-white object-cover"
            />
          </div>

          <p className="ml-4 text-[15px] font-semibold text-[#2D2D2D]">
            <span className="font-bold">12k+</span> synced their flow this week
          </p>
        </div>

        {/* Preview Card */}
        <div className="relative h-[330px] overflow-hidden rounded-[38px] bg-[#ECE9E7]">
          {/* Accent Blob */}
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#E6BEFF]/60" />

          {/* Floating Energy Card */}
          <div className="absolute right-6 top-6 flex items-center gap-4 rounded-[24px] bg-white px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#6554E8]">
              <FiZap className="text-xl text-[#6554E8]" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-500">
                Current Energy
              </p>

              <p className="font-semibold text-[#6554E8]">
                High Tide (85%)
              </p>
            </div>
          </div>

          {/* Face */}
          <div className="absolute left-1/2 top-[55%] flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#7A67F8]">
            <div className="relative h-24 w-24">
              <div className="absolute left-6 top-5 h-3 w-3 rounded-full bg-white" />
              <div className="absolute right-6 top-5 h-3 w-3 rounded-full bg-white" />

              <svg
                className="absolute bottom-6 left-1/2 -translate-x-1/2"
                width="40"
                height="20"
                viewBox="0 0 40 20"
              >
                <path
                  d="M5 5C12 15 28 15 35 5"
                  stroke="white"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Quote */}
          <div className="absolute bottom-6 left-6 rounded-2xl bg-white px-4 py-3 text-sm text-[#333] shadow-[0_8px_20px_rgba(0,0,0,.06)]">
            "Ready for a focus sprint?"
          </div>
        </div>
      </div>
    </section>
  );
}