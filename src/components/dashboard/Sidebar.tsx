"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Store, Star, MessageSquare, BarChart3, Users,
  Sparkles, Bell, FileText, Settings, QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/branches", label: "Branches", icon: Store },
  { href: "/reviews", label: "Google Reviews", icon: Star },
  { href: "/feedback", label: "Customer Feedback", icon: MessageSquare },
  { href: "/analytics", label: "Review Analytics", icon: BarChart3 },
  { href: "/competitors", label: "Competitors", icon: Users },
  { href: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/qr-codes", label: "QR Codes", icon: QrCode },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red text-sm font-bold text-white">
          PB
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Pizza Box</p>
          <p className="text-[11px] leading-tight text-text-muted">Reputation Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-red-light text-brand-red-dark"
                  : "text-foreground/80 hover:bg-surface-muted"
              )}
            >
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
