"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Textarea, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";

const CATEGORY_FIELDS: { key: string; label: string }[] = [
  { key: "foodQualityRating", label: "Food Quality" },
  { key: "deliveryRating", label: "Delivery" },
  { key: "staffRating", label: "Staff Behavior" },
  { key: "cleanlinessRating", label: "Cleanliness" },
  { key: "packagingRating", label: "Packaging" },
  { key: "waitingTimeRating", label: "Waiting Time" },
];

export function FeedbackFlow({
  branchSlug,
  branchName,
  googleReviewUrl,
}: {
  branchSlug: string;
  branchName: string;
  googleReviewUrl: string | null;
}) {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [showCategories, setShowCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchSlug,
          rating,
          feedbackText: feedbackText || undefined,
          customerName: name || undefined,
          customerPhone: phone || undefined,
          ...categories,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <ThankYouScreen branchName={branchName} googleReviewUrl={googleReviewUrl} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-red to-brand-red-dark pb-10">
      <div className="mx-auto max-w-md px-4 pt-10">
        <div className="mb-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-brand-red shadow-lg">
            PB
          </div>
          <h1 className="text-lg font-bold">Pizza Box Peshawar</h1>
          <p className="text-sm text-white/85">{branchName} Branch</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-center text-lg font-semibold text-foreground">
            How was your Pizza Box experience?
          </h2>
          <div className="mt-4 flex justify-center">
            <StarRating
              value={rating}
              size={40}
              onChange={(v) => {
                setRating(v);
                setShowCategories(true);
                setError(null);
              }}
            />
          </div>

          {showCategories && (
            <div className="mt-6 space-y-5 border-t border-border pt-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Tell us about your experience <span className="font-normal text-text-muted">(optional)</span>
                </label>
                <Textarea
                  rows={3}
                  placeholder="Share more details about your visit..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Rate specific areas <span className="font-normal text-text-muted">(optional)</span>
                </p>
                <div className="space-y-2">
                  {CATEGORY_FIELDS.map((f) => (
                    <div key={f.key} className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">{f.label}</span>
                      <StarRating
                        size={18}
                        value={categories[f.key] ?? 0}
                        onChange={(v) => setCategories((c) => ({ ...c, [f.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">Name (optional)</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">Phone (optional)</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XX-XXXXXXX" />
                </div>
              </div>

              {error && <p className="text-sm text-danger">{error}</p>}

              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          )}

          {!showCategories && error && <p className="mt-3 text-center text-sm text-danger">{error}</p>}
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-white/80">
          <ShieldCheck size={13} /> Your feedback is private and helps us improve.
        </p>
      </div>
    </div>
  );
}

function ThankYouScreen({
  branchName,
  googleReviewUrl,
}: {
  branchName: string;
  googleReviewUrl: string | null;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-red to-brand-red-dark px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto mb-4 text-success" size={56} />
        <h2 className="text-lg font-semibold">Thank you for sharing your experience.</h2>
        <p className="mt-1 text-sm text-text-muted">
          Your feedback about {branchName} has been received by our team.
        </p>

        {googleReviewUrl && (
          <div className="mt-6 rounded-xl bg-surface-muted p-5">
            <p className="text-sm font-medium text-foreground">
              Would you like to share your experience publicly on Google?
            </p>
            <p className="mt-1 text-xs text-text-muted">
              This is completely optional — you decide what rating and review to post.
            </p>
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red px-4 py-3 text-sm font-medium text-white hover:bg-brand-red-dark"
            >
              Review Pizza Box on Google <ExternalLink size={15} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
