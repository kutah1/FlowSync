import { useState } from "react";
import {
  HiOutlineBell,
  HiOutlineSparkles,
  HiOutlineClipboardDocumentList,
  HiOutlinePlus,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { useNavigate } from "react-router";
import { BRAND, GRID } from "../constants/colors";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Finish Presentation",
      subtitle: "High energy required • 45 mins",
      done: false,
    },
    {
      id: 2,
      title: "Review Proposal",
      subtitle: "Deep focus work • 80 mins",
      done: false,
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const capacity = 82;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (capacity / 100) * circumference;

  return (
    <div className="space-y-5">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Good morning, Sarah 🌿
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Ready to align with your natural rhythm today?
            </p>
          </div>

          <button
            onClick={() => navigate("/app/notifications")}
            aria-label="Notifications"
            className="relative rounded-full bg-white p-2.5 shadow-sm border hover:bg-neutral-50"
          >
            <HiOutlineBell className="text-xl text-gray-600" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand ring-2 ring-white" />
          </button>
        </div>

        {/* CYCLE CARD */}
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            Current Cycle Phase
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-gray-900">
            Follicular 🌱
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Your energy may naturally be increasing during this phase. It's a
            great time for creative brainstorming and starting new projects.
          </p>

          <div className="mt-6 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full w-[30%] rounded-full bg-green-500" />
          </div>

          <p className="mt-3 text-xs text-gray-400">Day 8 of 28</p>
        </div>

        {/* CAPACITY */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-center text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
            Today's Capacity
          </p>

          <div className="mt-5 flex justify-center">
            <div className="relative h-36 w-36">
              <svg className="-rotate-90" width="144" height="144">
                <circle
                  cx="72"
                  cy="72"
                  r="52"
                  stroke={GRID}
                  strokeWidth="10"
                  fill="none"
                />

                <circle
                  cx="72"
                  cy="72"
                  r="52"
                  stroke={BRAND}
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  {capacity}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <span className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white">
              High Energy Day
            </span>
          </div>
        </div>

        {/* MOOD */}
        <div className="rounded-3xl bg-brand-soft p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blush to-brand text-3xl">
            🙂
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5">
            <p className="text-gray-700 leading-7">
              "You seem energized today.
              <br />
              Consider tackling your more demanding tasks first."
            </p>
          </div>
        </div>

        {/* TASKS */}
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Today's Focus
            </h2>

            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              Recommended
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-2xl bg-gray-50 p-4"
              >
                <div className="flex gap-4">
                  <div className="mt-1 rounded-xl bg-brand-soft p-2">
                    <HiOutlineSparkles className="text-brand" />
                  </div>

                  <div>
                    <h3
                      className={`font-medium ${
                        task.done
                          ? "line-through text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="text-sm text-gray-500">{task.subtitle}</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 accent-brand"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/app/tasks")}
            className="mt-5 text-sm font-medium text-brand hover:underline"
          >
            View full task list →
          </button>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/app/tasks")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 text-white font-semibold shadow-brand hover:bg-brand-dark transition"
          >
            <HiOutlinePlus />
            Add Task
          </button>

          <button
            onClick={() => navigate("/app/checkin")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-mint py-4 font-medium text-mint-ink transition hover:brightness-95"
          >
            <HiOutlineClipboardDocumentList />
            Daily Check-In
          </button>

          <button
            onClick={() => navigate("/app/insights")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 font-medium text-gray-700 border hover:bg-gray-50 transition"
          >
            <HiOutlineChartBar />
            View Insights
          </button>
        </div>
    </div>
  );
}
