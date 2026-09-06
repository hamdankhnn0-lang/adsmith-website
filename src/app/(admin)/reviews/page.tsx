import { prisma } from "@/lib/prisma";
import { listReviews } from "@/lib/data/reviews";
import { ReviewFilters } from "@/components/dashboard/ReviewFilters";
import { ReviewCard, type ReviewCardData } from "@/components/dashboard/ReviewCard";
import { ExportMenu } from "@/components/dashboard/ExportMenu";

const QUICK_FILTERS: { label: string; query: Record<string, string> }[] = [
  { label: "Needs Response", query: { answered: "unanswered" } },
  { label: "Recently Responded", query: { answered: "answered", sort: "latest" } },
  { label: "Negative Reviews", query: { sentiment: "NEGATIVE" } },
  { label: "Positive Reviews", query: { sentiment: "POSITIVE" } },
  { label: "Critical Reviews", query: { critical: "1" } },
];

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ rating?: string; answered?: string; branch?: string; sort?: string; sentiment?: string; critical?: string }>;
}) {
  const sp = await searchParams;
  const branches = await prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  const reviews = await listReviews({
    rating: sp.rating ? Number(sp.rating) : undefined,
    answered: sp.answered as "answered" | "unanswered" | undefined,
    branchId: sp.branch || undefined,
    sort: sp.sort as "latest" | "oldest" | undefined,
    sentiment: sp.sentiment as "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED" | undefined,
    critical: sp.critical === "1",
  });

  const cards: ReviewCardData[] = reviews.map((r) => ({
    id: r.id,
    reviewerName: r.reviewerName,
    rating: r.rating,
    comment: r.comment,
    createTime: r.createTime.toISOString(),
    replyComment: r.replyComment,
    branchName: r.googleLocation.branch.name,
    sentiment: r.analysis?.sentiment,
    topics: r.analysis?.topics.map((t) => ({ topic: t.topic, sentiment: t.sentiment })) ?? [],
    latestDraft: r.responses[0]?.status === "DRAFT" ? r.responses[0].draftText : null,
    latestDraftId: r.responses[0]?.status === "DRAFT" ? r.responses[0].id : null,
    source: r.source,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Review Management</h1>
          <p className="text-sm text-text-muted">{reviews.length} reviews matching your filters.</p>
        </div>
        <ExportMenu type="reviews" />
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((f) => {
          const params = new URLSearchParams(f.query).toString();
          return (
            <a
              key={f.label}
              href={`/reviews?${params}`}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium hover:bg-surface-muted"
            >
              {f.label}
            </a>
          );
        })}
      </div>

      <ReviewFilters branches={branches} />

      <div className="grid gap-3 md:grid-cols-2">
        {cards.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
        {cards.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-text-muted">No reviews match these filters.</p>
        )}
      </div>
    </div>
  );
}
