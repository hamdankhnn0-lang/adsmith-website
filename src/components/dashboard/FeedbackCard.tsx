"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StaticStars } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import { FEEDBACK_CATEGORY_LABELS } from "@/lib/constants";

export interface FeedbackCardData {
  id: string;
  branchName: string;
  rating: number;
  feedbackText: string | null;
  customerName: string | null;
  customerPhone: string | null;
  category: string;
  status: string;
  staffNotes: string | null;
  createdAt: string;
  categoryRatings: { label: string; value: number | null }[];
}

const STATUS_VARIANT: Record<string, "neutral" | "warning" | "success" | "danger"> = {
  NEW: "warning",
  IN_PROGRESS: "neutral",
  RESOLVED: "success",
  IGNORED: "danger",
};

export function FeedbackCard({ feedback }: { feedback: FeedbackCardData }) {
  const router = useRouter();
  const [status, setStatus] = useState(feedback.status);
  const [notes, setNotes] = useState(feedback.staffNotes ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/feedback/${feedback.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, staffNotes: notes }),
    });
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <StaticStars value={feedback.rating} />
            <span className="text-xs text-text-muted">{feedback.branchName}</span>
          </div>
          <p className="mt-1 text-xs text-text-muted">{FEEDBACK_CATEGORY_LABELS[feedback.category] ?? feedback.category}</p>
        </div>
        <Badge variant={STATUS_VARIANT[status]}>{status.replace("_", " ")}</Badge>
      </div>

      {feedback.feedbackText && <p className="mt-3 text-sm">{feedback.feedbackText}</p>}

      {(feedback.customerName || feedback.customerPhone) && (
        <p className="mt-2 text-xs text-text-muted">
          {feedback.customerName ?? "Anonymous"} {feedback.customerPhone && `· ${feedback.customerPhone}`}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {feedback.categoryRatings.filter((c) => c.value).map((c) => (
          <span key={c.label} className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-text-muted">
            {c.label}: {c.value}★
          </span>
        ))}
      </div>

      <div className="mt-3 space-y-2 border-t border-border pt-3">
        <div className="flex gap-2">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="h-8 text-xs">
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="IGNORED">Ignored</option>
          </Select>
          <Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
        <Textarea
          rows={2}
          placeholder="Internal staff notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="text-xs"
        />
      </div>

      <p className="mt-2 text-[11px] text-text-muted">{formatDateTime(feedback.createdAt)}</p>
    </div>
  );
}
