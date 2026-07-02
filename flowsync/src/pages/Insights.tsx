import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { HiOutlineBolt, HiOutlineCheckCircle } from "react-icons/hi2";
import Card from "../components/ui/Card";
import SectionLabel from "../components/ui/SectionLabel";

// Hardcoded sample data
const energyTrend = [
  { day: "Mon", energy: 3 },
  { day: "Tue", energy: 4 },
  { day: "Wed", energy: 4 },
  { day: "Thu", energy: 5 },
  { day: "Fri", energy: 4 },
  { day: "Sat", energy: 3 },
  { day: "Sun", energy: 2 },
];

const phaseProductivity = [
  { phase: "Menstrual", score: 45, color: "#EC4899" },
  { phase: "Follicular", score: 88, color: "#22C55E" },
  { phase: "Ovulation", score: 76, color: "#F59E0B" },
  { phase: "Luteal", score: 60, color: "#8B5CF6" },
];

export default function Insights() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Insights</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Patterns from your check-ins and tasks this cycle.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <SectionLabel>Current phase</SectionLabel>
          <p className="mt-2 text-xl font-bold text-phase-follicular">Follicular 🌱</p>
          <p className="mt-1 text-xs text-neutral-500">Day 8 of 28</p>
        </Card>
        <Card>
          <SectionLabel>Avg energy</SectionLabel>
          <p className="mt-2 flex items-center gap-1 text-xl font-bold text-neutral-900">
            <HiOutlineBolt className="text-brand" /> 3.6 / 5
          </p>
          <p className="mt-1 text-xs text-neutral-500">Last 7 days</p>
        </Card>
        <Card>
          <SectionLabel>Most productive</SectionLabel>
          <p className="mt-2 text-xl font-bold text-phase-follicular">Follicular</p>
          <p className="mt-1 text-xs text-neutral-500">88% capacity</p>
        </Card>
        <Card>
          <SectionLabel>Tasks completed</SectionLabel>
          <p className="mt-2 flex items-center gap-1 text-xl font-bold text-neutral-900">
            <HiOutlineCheckCircle className="text-phase-follicular" /> 24
          </p>
          <p className="mt-1 text-xs text-neutral-500">This cycle</p>
        </Card>
      </div>

      {/* Energy trend */}
      <Card>
        <SectionLabel className="mb-4">Energy this week</SectionLabel>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={energyTrend} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis domain={[0, 5]} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #EEE" }}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#6554E8"
                strokeWidth={3}
                dot={{ r: 4, fill: "#6554E8" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Productivity by phase */}
      <Card>
        <SectionLabel className="mb-4">Capacity by cycle phase</SectionLabel>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={phaseProductivity} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" vertical={false} />
              <XAxis dataKey="phase" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                cursor={{ fill: "#F7F6F5" }}
                contentStyle={{ borderRadius: 12, border: "1px solid #EEE" }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {phaseProductivity.map((entry) => (
                  <Cell key={entry.phase} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
