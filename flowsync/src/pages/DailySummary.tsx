import { useState } from "react";
import { useNavigate } from "react-router";
import Card from "../components/ui/Card";
import SectionLabel from "../components/ui/SectionLabel";
import type { DayRating } from "../types";

/** Keys match daily_feedback.day_rating exactly (see 002_schema_alignment.sql). */
const dayOptions: { key: DayRating; label: string; emoji: string }[] = [
  { key: "better", label: "Better than expected", emoji: "🌟" },
  { key: "as_expected", label: "As expected", emoji: "🙂" },
  { key: "harder", label: "More difficult than expected", emoji: "😮‍💨" },
];

export default function DailySummary() {
  const [day, setDay] = useState<DayRating | null>(null);
  const [helped, setHelped] = useState<boolean | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Daily reflection</h1>
        <p className="mt-1 text-sm text-neutral-500">
          A quick check-out helps MiniMe learn your rhythm.
        </p>
      </div>

      {/* How was your day */}
      <Card>
        <SectionLabel className="mb-4">How did today go?</SectionLabel>
        <div className="space-y-3">
          {dayOptions.map((o) => {
            const active = day === o.key;
            return (
              <button
                key={o.key}
                onClick={() => setDay(o.key)}
                aria-pressed={active}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-brand bg-brand-soft"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <span className="text-2xl">{o.emoji}</span>
                <span
                  className={`font-medium ${active ? "text-brand" : "text-neutral-700"}`}
                >
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Did MiniMe help */}
      <Card>
        <SectionLabel className="mb-4">Did MiniMe's suggestions help?</SectionLabel>
        <div className="flex gap-3">
          {[
            { v: true, label: "Yes 👍" },
            { v: false, label: "No 👎" },
          ].map(({ v, label }) => (
            <button
              key={label}
              onClick={() => setHelped(v)}
              aria-pressed={helped === v}
              className={`flex-1 rounded-2xl border py-4 font-semibold transition ${
                helped === v
                  ? "border-brand bg-brand text-white"
                  : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      <button
        onClick={() => navigate("/app/dashboard")}
        disabled={day === null || helped === null}
        className="h-14 w-full rounded-full bg-brand text-lg font-semibold text-white shadow-brand transition hover:bg-brand-dark disabled:opacity-60"
      >
        Save reflection
      </button>
    </div>
  );
}
