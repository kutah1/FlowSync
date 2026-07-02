import { NavLink, useNavigate } from "react-router";
import { FiLogOut } from "react-icons/fi";
import { navItems } from "./navItems";

/** Desktop navigation — fixed left rail (visible at md and up). */
export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:border-r md:border-neutral-200 md:bg-white">
      {/* Brand */}
      <div className="flex items-center gap-2 px-6 py-6">
        <svg width="30" height="16" viewBox="0 0 34 18" fill="none">
          <path
            d="M2 9C5 2 10 2 15 9C20 16 25 16 32 9"
            stroke="#6554E8"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-lg font-bold text-neutral-800">FlowSync</span>
      </div>

      {/* Nav */}
      <nav className="mt-4 flex flex-col gap-1 px-3">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-brand-soft text-brand"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800",
              ].join(" ")
            }
          >
            <Icon className="text-xl" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer companion + logout */}
      <div className="mt-auto space-y-2 p-3">
        <div className="rounded-2xl bg-gradient-to-br from-brand-soft to-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
              :)
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-800">MiniMe</p>
              <p className="text-[11px] text-neutral-500">Companion active</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-800"
        >
          <FiLogOut className="text-lg" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
