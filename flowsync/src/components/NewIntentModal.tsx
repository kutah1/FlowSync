import { useState } from "react";
import {
  FiX,
  FiCalendar,
  FiHeart,
  FiZap,
  FiSend,
} from "react-icons/fi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave?: (data: {
    title: string;
    difficulty: string;
    deadline: string;
    category: string;
  }) => void;
}

export default function NewIntentModal({
  open,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Creative Flow");

  if (!open) return null;

  const options = [
    {
      title: "Easy",
      icon: <FiHeart size={18} />,
      color: "text-green-600",
    },
    {
      title: "Medium",
      icon: <FiZap size={18} />,
      color: "text-amber-500",
    },
    {
      title: "Hard",
      icon: <FiSend size={18} />,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200"
        >
          <FiX size={16} />
        </button>

        <div className="p-6">

          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-900">
            New Intent
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            What would you like to achieve today?
          </p>

          {/* Task */}
          <div className="mt-6">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Task Name
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Deep Work: Product Strategy"
              className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Difficulty */}
          <div className="mt-6">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Difficulty & Focus
            </label>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {options.map((item) => {
                const active = difficulty === item.title;

                return (
                  <button
                    key={item.title}
                    onClick={() => setDifficulty(item.title)}
                    className={`rounded-2xl border p-3 transition ${
                      active
                        ? "border-violet-600 bg-violet-600 text-white shadow-lg"
                        : "border-neutral-200 bg-white text-gray-700 hover:border-neutral-300"
                    }`}
                  >
                    <div
                      className={`mb-2 flex justify-center ${
                        active ? "text-white" : item.color
                      }`}
                    >
                      {item.icon}
                    </div>

                    <p className="text-[10px] font-semibold uppercase leading-tight">
                      {item.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deadline */}
          <div className="mt-6">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Deadline
            </label>

            <div className="relative mt-2">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl bg-gray-100 px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              />

              <FiCalendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Category */}
          <div className="mt-6">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option>Creative Flow</option>
              <option>Work</option>
              <option>Study</option>
              <option>Fitness</option>
              <option>Learning</option>
              <option>Personal</option>
            </select>
          </div>

          {/* Footer */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onSave?.({
                  title,
                  difficulty,
                  deadline,
                  category,
                })
              }
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
            >
              Save Task →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
