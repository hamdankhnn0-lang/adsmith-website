"use client";

import { useState } from "react";
import { StaticStars } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { formatDate, timeAgo } from "@/lib/utils";
import { Sparkles, Send } from "lucide-react";
import { TOPIC_LABELS } from "@/lib/constants";
import { useRouter } from "next/navigation";

export interface ReviewCardData {
  id: string;
  reviewerName: string | null;
  rating: number;
  comment: string | null;
  createTime: string;
  replyComment: string | null;
  branchName: string;
  sentiment?: string;
  topics?: { topic: string; sentiment: string }[];
  latestDraft?: string | null;
  latestDraftId?: string | null;
  source: string;
}

const SENTIMENT_VARIANT: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  POSITIVE: "success",
  NEGATIVE: "danger",
  MIXED: "warning",
  NEUTRAL: "neutral",
};

export function ReviewCard({ review }: { review: ReviewCardData }) {
  const router = useRouter();
  const [draft, setDraft] = useState(review.latestDraft ?? "");
  const [draftId, setDraftId] = useState(review.latestDraftId ?? undefined);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateDraft() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reviews/${review.id}/generate-reply`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDraft(data.draft);
      setDraftId(data.id);
      setShowReplyBox(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate draft.");
    } finally {
      setLoading(false);
    }
  }

  async function approveAndReply() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reviews/${review.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: draft, responseId: draftId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowReplyBox(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reply.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{review.reviewerName ?? "Google User"}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <StaticStars value={review.rating} />
            <span className="text-xs text-text-muted">{review.branchName}</span>
            <span className="text-xs text-text-muted">· {timeAgo(review.createTime)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {review.sentiment && <Badge variant={SENTIMENT_VARIANT[review.sentiment] ?? "neutral"}>{review.sentiment}</Badge>}
          <Badge variant={review.replyComment ? "success" : "warning"}>
            {review.replyComment ? "Answered" : "Not Answered"}
          </Badge>
        </div>
      </div>

      {review.comment && <p className="mt-3 text-sm text-foreground/90">{review.comment}</p>}

      {review.topics && review.topics.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {review.topics.map((t, i) => (
            <span key={i} className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-text-muted">
              {TOPIC_LABELS[t.topic] ?? t.topic}
            </span>
          ))}
        </div>
      )}

      {review.replyComment && (
        <div className="mt-3 rounded-lg bg-surface-muted p-3 text-sm">
          <p className="mb-1 text-xs font-semibold text-text-muted">Business reply</p>
          <p>{review.replyComment}</p>
        </div>
      )}

      {!review.replyComment && (
        <div className="mt-3">
          {!showReplyBox ? (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={generateDraft} disabled={loading}>
                <Sparkles size={14} /> Generate Reply Draft
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowReplyBox(true)}>
                Reply Manually
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a reply..." />
              <div className="flex gap-2">
                <Button size="sm" onClick={approveAndReply} disabled={loading || draft.trim().length === 0}>
                  <Send size={13} /> Approve & Reply
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowReplyBox(false)}>
                  Cancel
                </Button>
              </div>
              <p className="text-[11px] text-text-muted">
                A manager must review and approve every reply before it is posted.
              </p>
            </div>
          )}
          {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
      )}

      <p className="mt-2 text-[11px] text-text-muted">{formatDate(review.createTime)}</p>
    </div>
  );
}
