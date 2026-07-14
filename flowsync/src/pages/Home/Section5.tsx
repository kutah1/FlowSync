import { LuDroplets } from "react-icons/lu";

export default function FeatureCards() {
  return (
    <section className="bg-sand px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
            Built to work with your body
          </h2>
          <p className="mx-auto mt-5 max-w-content text-[17px] leading-8 text-neutral-500">
            Every feature is designed around your natural rhythm — not against it.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {/* Visual Energy Mapping — spans 2 cols on desktop */}
          <div className="rounded-3xl bg-white p-7 shadow-sm md:col-span-2">
            <h3 className="text-2xl font-semibold leading-tight text-neutral-900">
              Visual Energy Mapping
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-7 text-neutral-500">
              See your biological battery deplete and recharge in real time throughout your day.
            </p>

            {/* Bars are brand at increasing opacity — height and tint both track energy. */}
            <div className="mt-8 flex h-40 items-end justify-center gap-3">
              <div className="h-12 w-8 rounded-t-lg bg-brand/20" />
              <div className="h-20 w-8 rounded-t-lg bg-brand/40" />
              <div className="h-32 w-8 rounded-t-lg bg-brand" />
              <div className="h-16 w-8 rounded-t-lg bg-brand/30" />
              <div className="h-10 w-8 rounded-t-lg bg-brand/20" />
            </div>
          </div>

          {/* Cycle Integration */}
          <div className="flex flex-col justify-between rounded-3xl bg-mint p-7">
            <LuDroplets size={36} className="text-mint-ink" strokeWidth={1.8} />
            <div className="mt-8">
              <h3 className="text-2xl font-semibold leading-tight text-neutral-900">
                Cycle Integration
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-neutral-700">
                Hormone-aware scheduling for ultimate flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
