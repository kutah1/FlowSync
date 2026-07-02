import { useState } from "react";
import { useNavigate } from "react-router";
import Card from "../components/ui/Card";
import SectionLabel from "../components/ui/SectionLabel";

const moods = [
  { label: "Low", emoji: "😔" },
  { label: "Okay", emoji: "😐" },
  { label: "Good", emoji: "😊" },
  { label: "Great", emoji: "🤩" },
];

const sleepOptions = ["Poor", "Average", "Good"];

export default function MoodTracker() {
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [stress, setStress] = useState(2);
  const [mood, setMood] = useState(2); // index into moods
  const [sleep, setSleep] = useState(1); // index into sleepOptions

  const navigate = useNavigate();

  // Hardcoded capacity formula (mirrors recommendation logic; stress inverts).
  // energy/focus/mood/sleep raise capacity, stress lowers it. Scaled to 0–100.
  const capacity = Math.round(
    ((energy + focus + (mood + 1) + (sleep + 1) + (6 - stress)) / 25) * 100
  );

  const dayType =
    capacity >= 75 ? "High Energy Day" : capacity >= 45 ? "Balanced Day" : "Low Energy Day";

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
        <div className="flex justify-between">
          {moods.map((item, index) => (
            <button
              key={item.label}
              onClick={() => setMood(index)}
              aria-pressed={mood === index}
              className={`flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-xl transition ${
                mood === index
                  ? "scale-105 bg-brand text-white shadow-brand"
                  : "bg-neutral-100 hover:bg-neutral-200"
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
          {sleepOptions.map((opt, index) => (
            <button
              key={opt}
              onClick={() => setSleep(index)}
              aria-pressed={sleep === index}
              className={`rounded-2xl py-3 text-sm font-medium transition ${
                sleep === index
                  ? "bg-brand text-white shadow-brand"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {opt}
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
          You're in your <strong>Follicular phase</strong> — a great time for creative
          brainstorming and starting new projects.
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
