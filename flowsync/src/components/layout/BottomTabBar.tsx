import { NavLink } from "react-router";
import { navItems } from "./navItems";

/** Mobile navigation — fixed bottom tab bar in the thumb zone (hidden at md and up). */
export default function BottomTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ label, to, icon: Icon, primary }) => {
          if (primary) {
            // Elevated center action so it can never blend into the bar
            return (
              <NavLink
                key={to}
                to={to}
                className="relative -mt-6 flex w-16 flex-col items-center"
                aria-label={label}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-brand ring-4 ring-white transition ${
                        isActive ? "bg-brand-dark" : "bg-brand"
                      }`}
                    >
                      <Icon className="text-3xl" />
                    </span>
                    <span
                      className={`mt-1 text-[10px] font-semibold ${
                        isActive ? "text-brand" : "text-neutral-500"
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex min-h-[56px] min-w-[56px] flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition",
                  isActive ? "text-brand" : "text-neutral-400",
                ].join(" ")
              }
            >
              <Icon className="text-xl" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
