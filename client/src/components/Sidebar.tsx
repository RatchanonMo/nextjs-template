"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { HiOutlineInboxIn, HiOutlineCalendar, HiOutlineClipboardList, HiOutlineViewGrid, HiOutlineTrash, HiOutlineChartBar, HiPlus, HiCheck } from "react-icons/hi";

interface SidebarProps {
  onNewTask?: () => void;
  inboxCount?: number;
}

const NAV_ITEMS = [
  { key: "inbox",    href: ROUTES.HOME,     label: "Inbox",    icon: <HiOutlineInboxIn className="w-4 h-4" /> },
  { key: "today",    href: ROUTES.TODAY,    label: "Today",    icon: <HiOutlineCalendar className="w-4 h-4" /> },
  { key: "upcoming", href: ROUTES.UPCOMING, label: "Upcoming", icon: <HiOutlineClipboardList className="w-4 h-4" /> },
  { key: "analytics", href: ROUTES.ANALYTICS, label: "Analytics", icon: <HiOutlineChartBar className="w-4 h-4" /> },
  { key: "projects", href: ROUTES.PROJECTS, label: "Projects", icon: <HiOutlineViewGrid className="w-4 h-4" /> },
  { key: "trash", href: ROUTES.TRASH, label: "Trash", icon: <HiOutlineTrash className="w-4 h-4" /> },
];

const ADMIN_NAV_ITEM = { key: "admin", href: ROUTES.ADMIN, label: "Admin", icon: <HiOutlineViewGrid className="w-4 h-4" /> };

export default function Sidebar({ onNewTask, inboxCount = 12 }: SidebarProps) {
  const pathname = usePathname();
  const { labels, hydrate } = useWorkspaceStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const isActive = (href: string) => {
    if (href === ROUTES.HOME) return pathname === "/";
    return pathname.startsWith(href);
  };

  const navItems = user?.role === "admin" ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

  return (
    <aside className="w-[220px] shrink-0 bg-white flex flex-col h-full border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <HiCheck className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-[17px] text-gray-900 tracking-tight">FlowTask</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 mt-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${active ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
            >
              <span className={active ? "text-primary" : "text-gray-400"}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.key === "inbox" && (
                <span className="bg-primary text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {inboxCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Labels */}
      <div className="mt-6 px-5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Labels</p>
        <div className="flex flex-col gap-1.5">
          {labels.map((label) => (
            <button
              key={label.id}
              className="flex items-center gap-2.5 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
              {label.name}
            </button>
          ))}
        </div>
      </div>

      {/* New Task Button */}
      <div className="mt-auto px-4 pb-5">
        <button
          onClick={onNewTask}
          className="w-full bg-primary hover:bg-primary-600 text-white font-semibold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <HiPlus className="w-4 h-4" />
          New Task
        </button>
      </div>
    </aside>
  );
}
