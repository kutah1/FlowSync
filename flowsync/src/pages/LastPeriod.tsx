import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Calendar from "../components/Calendar";

export default function LastPeriod() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-[#F8F6F5]">
      <div className="mx-auto flex h-screen max-w-sm flex-col px-5">

        {/* Header */}

        <div className="mt-6 flex items-center justify-between">

          <button className="rounded-full p-2 hover:bg-gray-100">
            <FiArrowLeft />
          </button>

          <div className="flex gap-2">
            <span className="h-1.5 w-6 rounded-full bg-[#5F53E8]" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          </div>

          <div className="w-8" />

        </div>

        <h1 className="mt-8 text-4xl font-bold leading-tight">
          When did your last period start?
        </h1>

        <p className="mt-3 text-gray-500">
          This helps us calculate your current phase and sync your productivity
          schedule.
        </p>

        <div className="mt-8">
          <Calendar value={date} onChange={setDate} />
        </div>

        <div className="flex-1" />

        <div className="mb-4 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6A5AE0] text-white shadow-xl">
            :)
          </div>

          <p className="mt-3 text-xs font-semibold tracking-[0.25em] text-[#6A5AE0]">
            COMPANION ACTIVE
          </p>
        </div>

        <button className="h-14 rounded-full bg-[#635BFF] text-lg font-medium text-white shadow-xl">
          Continue
        </button>

        <button className="py-5 text-sm text-gray-500">
          I don't track my cycle
        </button>

      </div>
    </div>
  );
}
