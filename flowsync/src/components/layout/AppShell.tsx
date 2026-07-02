import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import BottomTabBar from "./BottomTabBar";

/**
 * Adaptive shell for in-app screens:
 * - Desktop (md+): left sidebar, content expands to full width.
 * - Mobile: bottom tab bar in the thumb zone.
 * Renders the active child route via <Outlet />.
 */
export default function AppShell() {
  return (
    <div className="min-h-screen bg-sand">
      <Sidebar />

      {/* Content column: offset by sidebar width on desktop; padded above the tab bar on mobile */}
      <div className="md:pl-64">
        <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 md:pb-10 md:pt-10">
          <Outlet />
        </main>
      </div>

      <BottomTabBar />
    </div>
  );
}
