import { useState } from "react";
import {
  HiOutlineBell,
  HiOutlineSparkles,
  HiOutlineHeart,
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { useNavigate } from "react-router";
import { FiArrowLeft } from "react-icons/fi";
import Card from "../components/ui/Card";
import SectionLabel from "../components/ui/SectionLabel";

type Notif = {
  id: number;
  icon: typeof HiOutlineBell;
  tint: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const initial: Notif[] = [
  {
    id: 1,
    icon: HiOutlineSparkles,
    tint: "bg-brand-soft text-brand",
    title: "MiniMe has today's plan",
    body: "You're in a high-energy window — tackle 'Finish Q3 Presentation' first.",
    time: "Just now",
    unread: true,
  },
  {
    id: 2,
    icon: HiOutlineHeart,
    tint: "bg-pink-100 text-pink-500",
    title: "Cycle update",
    body: "You've entered your Follicular phase 🌱 — a great time to start new projects.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    icon: HiOutlineClipboardDocumentList,
    tint: "bg-amber-100 text-amber-600",
    title: "Daily check-in reminder",
    body: "Take 30 seconds to log your energy and mood for today.",
    time: "8:00 AM",
    unread: false,
  },
  {
    id: 4,
    icon: HiOutlineCheckCircle,
    tint: "bg-green-100 text-green-600",
    title: "Nice work yesterday!",
    body: "You completed 5 of 6 tasks. Your streak is now 4 days.",
    time: "Yesterday",
    unread: false,
  },
];

export default function Notifications() {
  const [items, setItems] = useState(initial);
  const navigate = useNavigate();
  const unread = items.filter((n) => n.unread).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-neutral-50 md:hidden"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {unread > 0 ? `${unread} unread` : "You're all caught up ✨"}
            </p>
          </div>
        </div>
        {unread > 0 && (
          <button
            onClick={() => setItems((p) => p.map((n) => ({ ...n, unread: false })))}
            className="text-sm font-medium text-brand hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div>
        <SectionLabel className="mb-3">Recent</SectionLabel>
        <div className="space-y-3">
          {items.map((n) => {
            const Icon = n.icon;
            return (
              <Card
                key={n.id}
                padded={false}
                className={`flex gap-4 p-4 transition ${
                  n.unread ? "ring-1 ring-brand/20" : ""
                }`}
                onClick={() =>
                  setItems((p) =>
                    p.map((x) => (x.id === n.id ? { ...x, unread: false } : x))
                  )
                }
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${n.tint}`}
                >
                  <Icon className="text-xl" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">{n.title}</h3>
                    {n.unread && <span className="h-2 w-2 rounded-full bg-brand" />}
                  </div>
                  <p className="mt-0.5 text-sm leading-6 text-neutral-500">{n.body}</p>
                  <p className="mt-1 text-xs text-neutral-400">{n.time}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
