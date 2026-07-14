import { useState } from "react";
import { useNavigate } from "react-router";
import Card from "../components/ui/Card";
import SectionLabel from "../components/ui/SectionLabel";
import { computeCapacity, dayTypeLabel, phaseNudge } from "../utils/capacity";

/** Every input is 1–5 — the domain the check-in table stores. */
const moods = [
  { value: 1, label: "Low", emoji: "😔" },
  { value: 2, label: "Meh", emoji: "😕" },
  { value: 3, label: "Okay", emoji: "😐" },
  { value: 4, label: "Good", emoji: "🙂" },
  { value: 5, label: "Great", emoji: "🤩" },
];

/** Three choices, evenly spaced across the 1–5 scale. */
const sleepOptions = [
  { value: 1, label: "Poor" },
  { value: 3, label: "Average" },
  { value: 5, label: "Good" },
];

export default function MoodTracker() {
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [stress, setStress] = useState(2);
  const [mood, setMood] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(3);

  const navigate = useNavigate();

  // Single source of truth — mirrors calculate_capacity_score in Supabase.
  const { percentage: capacity, category } = computeCapacity({
    energy,
    focus,
    mood,
    sleepQuality,
    stress,
  });

  const dayType = dayTypeLabel(category);

  // TODO: phase comes from the user's cycle profile once auth + persistence land.
  const phase = "Follicular" as const;

  return (
    <div className="mx-auto max-w-md space-y-6">
      {/* Top Icon */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-xl text-white shadow-brand">
          🙂
        </div>
        <h1 className="mt-4 text-3xl font-bold text-neutral-900">
          How are you feeling today?
        </h1>
        <p className="mt-3 max-w-content text-sm leading-6 text-neutral-500">
          Tune into your rhythm so MiniMe can sync your flow for the day ahead.
        </p>
      </div>

      {/* Sliders 1-5 */}
      <Scale icon="⚡" title="Energy" left="LOW" right="HIGH" value={energy} setValue={setEnergy} />
      <Scale icon="🎯" title="Focus" left="DISTRACTED" right="LOCKED IN" value={focus} setValue={setFocus} />
      <Scale icon="🧠" title="Stress" left="CALM" right="INTENSE" value={stress} setValue={setStress} />

      {/* Mood */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg text-brand">☺</span>
          <SectionLabel>Current Mood</SectionLabel>
        </div>
        <div className="flex justify-between gap-2">
          {moods.map((item) => (
            <button
              key={item.label}
              onClick={() => setMood(item.value)}
              aria-pressed={mood === item.value}
              className={`flex h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-xl transition ${
                mood === item.value
                  ? "scale-105 bg-brand text-white shadow-brand"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <span>{item.emoji}</span>
              <span className="text-[9px] font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Sleep */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg text-brand">🌙</span>
          <SectionLabel>Sleep Quality</SectionLabel>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {sleepOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setSleepQuality(opt.value)}
              aria-pressed={sleepQuality === opt.value}
              className={`rounded-2xl py-3 text-sm font-medium transition ${
                sleepQuality === opt.value
                  ? "bg-brand text-white shadow-brand"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Capacity result */}
      <div className="rounded-3xl bg-brand p-6 text-white shadow-brand">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
              Daily Capacity
            </p>
            <p className="mt-1 text-4xl font-bold">{capacity}%</p>
            <p className="mt-1 text-sm opacity-90">{dayType}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
            💡
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 opacity-95">
          You're in your <strong>{phase} phase</strong> — {phaseNudge(phase)}.
        </p>
      </div>

      <button
        onClick={() => navigate("/app/dashboard")}
        className="h-14 w-full rounded-full bg-neutral-900 text-lg font-semibold text-white transition hover:bg-neutral-800"
      >
        Save check-in →
      </button>
    </div>
  );
}

interface ScaleProps {
  icon: string;
  title: string;
  left: string;
  right: string;
  value: number;
  setValue: (v: number) => void;
}

function Scale({ icon, title, left, right, value, setValue }: ScaleProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg text-brand">{icon}</span>
        <SectionLabel>
          {title} · {value}/5
        </SectionLabel>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-brand"
        aria-label={title}
      />
      <div className="mt-2 flex justify-between text-[10px] font-semibold tracking-wide text-neutral-400">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </Card>
  );
}
