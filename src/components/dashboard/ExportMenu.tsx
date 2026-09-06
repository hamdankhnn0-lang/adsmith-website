"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExportMenu({ type, label = "Export" }: { type: string; label?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button size="sm" variant="secondary" onClick={() => setOpen((o) => !o)}>
        <Download size={14} /> {label}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-border bg-surface py-1 shadow-lg">
            {["csv", "xlsx", "pdf"].map((format) => (
              <a
                key={format}
                href={`/api/export/${type}?format=${format}`}
                className={cn("block px-3 py-1.5 text-sm hover:bg-surface-muted")}
                onClick={() => setOpen(false)}
              >
                Export as {format.toUpperCase()}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
