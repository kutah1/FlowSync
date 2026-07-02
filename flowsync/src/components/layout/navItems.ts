import type { IconType } from "react-icons";
import {
  HiOutlineHome,
  HiOutlineClipboardDocumentList,
  HiOutlinePlusCircle,
  HiOutlineChartBar,
  HiOutlineUser,
} from "react-icons/hi2";

export interface NavItem {
  label: string;
  to: string;
  icon: IconType;
  /** Emphasized center action (Check-In) — the app's primary repeatable action. */
  primary?: boolean;
}

/** Single source of truth for both the desktop sidebar and mobile bottom tab bar. */
export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/app/dashboard", icon: HiOutlineHome },
  { label: "Tasks", to: "/app/tasks", icon: HiOutlineClipboardDocumentList },
  { label: "Check-In", to: "/app/checkin", icon: HiOutlinePlusCircle, primary: true },
  { label: "Insights", to: "/app/insights", icon: HiOutlineChartBar },
  { label: "Profile", to: "/app/profile", icon: HiOutlineUser },
];
