"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const RATING_TABS = [
  { label: "All", value: "" },
  { label: "5 Star", value: "5" },
  { label: "4 Star", value: "4" },
  { label: "3 Star", value: "3" },
  { label: "2 Star", value: "2" },
  { label: "1 Star", value: "1" },
];

export function ReviewFilters({ branches }: { branches: { id: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const rating = searchParams.get("rating") ?? "";
  const answered = searchParams.get("answered") ?? "";
  const sort = searchParams.get("sort") ?? "latest";
  const branch = searchParams.get("branch") ?? "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1 rounded-lg bg-surface-muted p-1">
        {RATING_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setParam("rating", t.value)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium",
              rating === t.value ? "bg-surface shadow-sm" : "text-text-muted hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <select
        value={answered}
        onChange={(e) => setParam("answered", e.target.value)}
        className="h-8 rounded-lg border border-border bg-surface px-2 text-xs outline-none"
      >
        <option value="">Answered & Unanswered</option>
        <option value="unanswered">Unanswered</option>
        <option value="answered">Answered</option>
      </select>

      <select
        value={branch}
        onChange={(e) => setParam("branch", e.target.value)}
        className="h-8 rounded-lg border border-border bg-surface px-2 text-xs outline-none"
      >
        <option value="">All Branches</option>
        {branches.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => setParam("sort", e.target.value)}
        className="h-8 rounded-lg border border-border bg-surface px-2 text-xs outline-none"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
