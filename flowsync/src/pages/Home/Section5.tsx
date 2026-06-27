import {
  LuDroplets,
  LuZap,
} from "react-icons/lu";

export default function FeatureCards() {
  return (
    <section className="bg-[#F8F7F5] px-5 py-8">
      <div className="mx-auto flex max-w-sm flex-col gap-4">
        {/* Visual Energy Mapping */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-semibold leading-tight text-gray-900">
            Visual Energy
            <br />
            Mapping
          </h3>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            See your biological battery deplete and recharge in real-time
            throughout your day.
          </p>

          <div className="mt-8 flex h-36 items-end justify-center gap-2">
            <div className="h-10 w-6 rounded-t-lg bg-[#E7E5F5]" />
            <div className="h-16 w-6 rounded-t-lg bg-[#CFCBF4]" />
            <div className="h-24 w-6 rounded-t-lg bg-[#5C4FD7]" />
            <div className="h-14 w-6 rounded-t-lg bg-[#B9B4EB]" />
            <div className="h-8 w-6 rounded-t-lg bg-[#E7E5F5]" />
          </div>
        </div>

        {/* Cycle Integration */}
        <div className="flex items-center justify-between rounded-3xl bg-[#D7F0CB] p-6">
          <div>
            <h3 className="text-2xl font-semibold leading-tight text-gray-900">
              Cycle
              <br />
              Integration
            </h3>

            <p className="mt-3 max-w-[180px] text-sm leading-6 text-gray-600">
              Hormone-aware scheduling for ultimate flow.
            </p>
          </div>

          <LuDroplets
            size={36}
            className="text-[#A3C18D]"
            strokeWidth={1.8}
          />
        </div>

        {/* Burnout Card */}
        <div className="rounded-3xl bg-[#8D7785] py-8 text-center text-white">
          <div className="text-5xl font-bold">94%</div>

          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/80">
            Reduced Burnout
          </p>
        </div>

        {/* Sync Pro */}
        <div className="rounded-3xl bg-[#24006D] py-8 text-center text-white">
          <LuZap
            className="mx-auto mb-3"
            size={22}
            strokeWidth={2}
          />

          <p className="text-lg font-medium">Sync Pro</p>
        </div>
      </div>
    </section>
  );
}
