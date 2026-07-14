import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

export default function Calendar({ value, onChange }: Props) {
  const start = startOfWeek(startOfMonth(value), {
    weekStartsOn: 1,
  });

  const end = endOfWeek(endOfMonth(value), {
    weekStartsOn: 1,
  });

  const days = eachDayOfInterval({
    start,
    end,
  });

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <button
          onClick={() => onChange(subMonths(value, 1))}
          className="rounded-full p-2 text-neutral-700 hover:bg-neutral-100"
        >
          <FiChevronLeft />
        </button>

        <h2 className="text-xl font-semibold">
          {format(value, "MMMM yyyy")}
        </h2>

        <button
          onClick={() => onChange(addMonths(value, 1))}
          className="rounded-full p-2 text-neutral-700 hover:bg-neutral-100"
        >
          <FiChevronRight />
        </button>

      </div>

      <div className="grid grid-cols-7 text-center text-xs text-neutral-500">
        {["M","T","W","T","F","S","S"].map(day=>(
          <div key={day} className="pb-3">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-3">
        {days.map(day=>{

          const selected = isSameDay(day,value);
          const current = isSameMonth(day,value);

          return (
            <button
              key={day.toString()}
              onClick={()=>onChange(day)}
              className={`
                mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition

                ${
                  selected
                    ? "bg-brand text-white shadow-brand"
                    : current
                    ? "text-neutral-800 hover:bg-neutral-100"
                    : "text-neutral-400 hover:bg-neutral-100"
                }
              `}
            >
              {format(day,"d")}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3 rounded-xl bg-blush/40 p-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blush">
          📍
        </div>

        <p className="text-sm text-neutral-600">
          If you're not sure, an estimate is perfectly fine!
        </p>

      </div>

    </div>
  );
}
