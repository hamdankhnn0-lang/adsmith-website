"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { ROLE_LABELS } from "@/lib/constants";

export function TopNav({
  userName,
  userRole,
  unreadAlerts,
}: {
  userName: string;
  userRole: string;
  unreadAlerts: number;
}) {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-surface px-4 md:px-6">
      <div className="relative hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
        <input
          placeholder="Search reviews, branches, feedback..."
          className="h-9 w-full rounded-lg border border-border bg-surface-muted pl-9 pr-3 text-sm outline-none focus:border-brand-red"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/alerts"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-muted"
        >
          <Bell size={18} />
          {unreadAlerts > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-semibold text-white">
              {unreadAlerts}
            </span>
          )}
        </Link>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-tight">{userName}</p>
          <p className="text-xs leading-tight text-text-muted">{ROLE_LABELS[userRole] ?? userRole}</p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted hover:text-danger"
          title="Sign out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
