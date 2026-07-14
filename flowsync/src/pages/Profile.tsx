import { useState } from "react";
import {
  FiSettings,
  FiBell,
  FiClock,
  FiDroplet,
  FiEdit2,
  FiChevronRight,
  FiUser,
  FiTrash2,
  FiLogOut,
} from "react-icons/fi";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import Toggle from "../components/ui/Toggle";

export default function Profile() {
  const [notifications, setNotifications] = useState(true);
  const [insights, setInsights] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-brand">FlowSync</h1>
          <button className="p-2 rounded-full bg-white shadow">
            <FiSettings className="text-neutral-600" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-brand via-phase-menstrual to-phase-ovulation p-1">
              <img
                src="https://i.pravatar.cc/200?img=5"
                alt="profile"
                className="w-full h-full rounded-full object-cover border-4 border-white"
              />
            </div>

            <button className="absolute bottom-1 right-1 bg-brand text-white p-2 rounded-full shadow-brand">
              <FiEdit2 size={14} />
            </button>
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Selena Veda
          </h2>

          <p className="text-sm text-gray-500">
            Luminus Member since 2023
          </p>
        </div>

        {/* Cycle Info */}
        <div className="mt-8">
          <p className="text-xs font-semibold tracking-widest text-gray-400 mb-3">
            CYCLE INFORMATION
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <FiClock className="text-brand mb-3" />
              <p className="text-xs text-neutral-500">Last Period</p>
              <h3 className="font-bold text-xl mt-1">Oct 12</h3>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <FiDroplet className="text-phase-follicular mb-3" />
              <p className="text-xs text-neutral-500">Cycle Length</p>
              <h3 className="font-bold text-xl mt-1">28 Days</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm mt-4 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blush p-3 rounded-full">
                <FiDroplet className="text-blush-ink" />
              </div>

              <div>
                <h4 className="font-medium text-gray-800">
                  Period Prediction
                </h4>
                <p className="text-xs text-gray-500">
                  Next cycle starts in 4 days
                </p>
              </div>
            </div>

            <FiChevronRight className="text-gray-400" />
          </div>
        </div>

        {/* Preferences */}
        <div className="mt-8">
          <p className="text-xs font-semibold tracking-widest text-gray-400 mb-3">
            PREFERENCES
          </p>

          <div className="bg-white rounded-2xl divide-y shadow-sm">
            <SettingRow
              icon={<FiBell />}
              title="Push Notifications"
              toggle
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />

            <SettingRow
              icon={<FiClock />}
              title="Daily Reminder"
              subtitle="8:00 AM"
            />

            <SettingRow
              icon={<FiDroplet />}
              title="Insight Alerts"
              toggle
              checked={insights}
              onChange={() => setInsights(!insights)}
            />
          </div>
        </div>

        {/* Account */}
        <div className="mt-8">
          <p className="text-xs font-semibold tracking-widest text-gray-400 mb-3">
            ACCOUNT
          </p>

          <div className="bg-white rounded-2xl divide-y shadow-sm">
            <SettingRow icon={<FiDroplet />} title="Update cycle details" link />
            <SettingRow icon={<FiUser />} title="Account settings" link />
            <SettingRow
              icon={<FiTrash2 />}
              title="Delete account"
              danger
              link
            />
          </div>
        </div>

        {/* Bottom Card */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-blush/50 to-brand-soft p-4 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-xl">
            🙂
          </div>

          <p className="text-sm italic text-neutral-700">
            You're in your <b>Follicular</b> phase.
            <br />
            <span className="text-neutral-500">
              Great day to pursue your goals!
            </span>
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-4 font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          <FiLogOut />
          Log Out
        </button>
    </div>
  );
}

interface SettingRowProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  toggle?: boolean;
  checked?: boolean;
  onChange?: () => void;
  link?: boolean;
  danger?: boolean;
}

function SettingRow({
  icon,
  title,
  subtitle,
  toggle,
  checked,
  onChange,
  link,
  danger,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className={`text-lg ${danger ? "text-red-500" : "text-brand"}`}>
          {icon}
        </div>

        <div>
          <p className={`text-sm font-medium ${danger ? "text-red-500" : ""}`}>
            {title}
          </p>

          {subtitle && <p className="text-xs text-brand">{subtitle}</p>}
        </div>
      </div>

      {toggle ? (
        <Toggle checked={!!checked} onChange={onChange ?? (() => {})} label={title} />
      ) : link ? (
        <FiChevronRight className="text-gray-400" />
      ) : null}
    </div>
  );
}