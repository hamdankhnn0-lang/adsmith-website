"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { timeAgo } from "@/lib/utils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { ALERT_TYPE_LABELS } from "@/lib/constants";

export interface AlertData {
  id: string;
  type: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  description: string;
  recommendedAction: string | null;
  branchName: string | null;
  isRead: boolean;
  isResolved: boolean;
  createdAt: string;
}

const SEVERITY_VARIANT = { INFO: "neutral", WARNING: "warning", CRITICAL: "danger" } as const;

export function AlertCard({ alert }: { alert: AlertData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(patch: { isRead?: boolean; isResolved?: boolean }) {
    setLoading(true);
    await fetch(`/api/alerts/${alert.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className={`rounded-xl border p-4 ${alert.isResolved ? "border-border bg-surface-muted opacity-70" : "border-border bg-surface"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <AlertTriangle
            size={16}
            className={`mt-0.5 shrink-0 ${alert.severity === "CRITICAL" ? "text-danger" : alert.severity === "WARNING" ? "text-warning" : "text-text-muted"}`}
          />
          <div>
            <p className="text-sm font-semibold">{alert.title}</p>
            <p className="text-xs text-text-muted">
              {ALERT_TYPE_LABELS[alert.type] ?? alert.type} {alert.branchName && `· ${alert.branchName}`} · {timeAgo(alert.createdAt)}
            </p>
          </div>
        </div>
        <Badge variant={SEVERITY_VARIANT[alert.severity]}>{alert.severity}</Badge>
      </div>

      <p className="mt-2 text-sm text-foreground/90">{alert.description}</p>
      {alert.recommendedAction && (
        <p className="mt-1.5 rounded-lg bg-surface-muted p-2 text-xs text-text-muted">
          <strong>Recommended action:</strong> {alert.recommendedAction}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        {!alert.isRead && (
          <Button size="sm" variant="secondary" onClick={() => update({ isRead: true })} disabled={loading}>
            Mark as Read
          </Button>
        )}
        {!alert.isResolved && (
          <Button size="sm" variant="outline" onClick={() => update({ isResolved: true, isRead: true })} disabled={loading}>
            <CheckCircle2 size={13} /> Resolve
          </Button>
        )}
      </div>
    </div>
  );
}
