import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveDateRange } from "@/lib/date-range";
import { getBranchPerformance, getRatingTrend, getTopicMentions } from "@/lib/data/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StaticStars } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { RatingDistributionChart } from "@/components/charts/RatingDistributionChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { ReviewCard, type ReviewCardData } from "@/components/dashboard/ReviewCard";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { formatDate } from "@/lib/utils";
import { TOPIC_LABELS } from "@/lib/constants";

export default async function BranchDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { slug } = await params;
  const { range } = await searchParams;
  const { from, to } = resolveDateRange(range ?? "90d");

  const branch = await prisma.branch.findUnique({ where: { slug } });
  if (!branch) notFound();

  const [allBranchMetrics, trend, topics, googleReviews, feedback] = await Promise.all([
    getBranchPerformance(from, to),
    getRatingTrend(from, to, "day"),
    getTopicMentions(from, to),
    prisma.googleReview.findMany({
      where: { googleLocation: { branchId: branch.id }, createTime: { gte: from, lte: to } },
      include: { analysis: { include: { topics: true } } },
      orderBy: { createTime: "desc" },
      take: 10,
    }),
    prisma.customerFeedback.findMany({
      where: { branchId: branch.id, createdAt: { gte: from, lte: to } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const metrics = allBranchMetrics.find((b) => b.id === branch.id);
  const unanswered = googleReviews.filter((r) => !r.replyComment);

  // Simple 0-100 performance score: rating (60%) + response rate (25%) + volume trend (15%)
  const responseRate = googleReviews.length > 0 ? (googleReviews.length - unanswered.length) / googleReviews.length : 1;
  const performanceScore = metrics
    ? Math.round(((metrics.avgRating / 5) * 60) + (responseRate * 25) + (Math.min(Math.max(metrics.growthPct, -20), 20) + 20) / 40 * 15)
    : 0;

  const cards: ReviewCardData[] = googleReviews.map((r) => ({
    id: r.id,
    reviewerName: r.reviewerName,
    rating: r.rating,
    comment: r.comment,
    createTime: r.createTime.toISOString(),
    replyComment: r.replyComment,
    branchName: branch.name,
    sentiment: r.analysis?.sentiment,
    topics: r.analysis?.topics.map((t) => ({ topic: t.topic, sentiment: t.sentiment })) ?? [],
    source: r.source,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{branch.name}</h1>
          <p className="text-sm text-text-muted">{branch.address}</p>
        </div>
        <DateRangeFilter />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><CardContent className="p-4">
          <p className="text-xs text-text-muted">Google Rating</p>
          <div className="mt-1 flex items-center gap-2">
            <StaticStars value={Math.round(metrics?.avgRating ?? 0)} />
            <span className="text-xl font-bold">{metrics?.avgRating || "—"}</span>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-text-muted">Total Reviews</p>
          <p className="mt-1 text-xl font-bold">{metrics?.totalReviews ?? 0}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-text-muted">Reviews This Month</p>
          <p className="mt-1 text-xl font-bold">{metrics?.reviewsThisMonth ?? 0}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-text-muted">Performance Score</p>
          <p className="mt-1 text-xl font-bold">{performanceScore}/100</p>
        </CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Review Trend</CardTitle></CardHeader>
          <CardContent><TrendChart data={trend} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Rating Distribution</CardTitle></CardHeader>
          <CardContent>{metrics && <RatingDistributionChart breakdown={metrics.breakdown} />}</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Common Complaints</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {topics.topComplaints.length === 0 && <p className="text-sm text-text-muted">None recorded.</p>}
            {topics.topComplaints.map((t) => (
              <div key={t.topic} className="flex items-center justify-between text-sm">
                <span>{TOPIC_LABELS[t.topic] ?? t.topic}</span>
                <Badge variant="danger">{t.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Common Positive Comments</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {topics.topPositives.length === 0 && <p className="text-sm text-text-muted">None recorded.</p>}
            {topics.topPositives.map((t) => (
              <div key={t.topic} className="flex items-center justify-between text-sm">
                <span>{TOPIC_LABELS[t.topic] ?? t.topic}</span>
                <Badge variant="success">{t.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold">
          Unanswered Google Reviews <span className="text-text-muted">({unanswered.length})</span>
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {cards.filter((c) => !c.replyComment).slice(0, 4).map((c) => <ReviewCard key={c.id} review={c} />)}
          {unanswered.length === 0 && <p className="text-sm text-text-muted">All caught up — no unanswered reviews.</p>}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold">Latest Google Reviews</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {cards.slice(0, 6).map((c) => <ReviewCard key={c.id} review={c} />)}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold">Latest Private Feedback (QR Form)</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {feedback.map((f) => (
            <Card key={f.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <StaticStars value={f.rating} />
                  <span className="text-xs text-text-muted">{formatDate(f.createdAt)}</span>
                </div>
                {f.feedbackText && <p className="mt-2 text-sm">{f.feedbackText}</p>}
                {f.customerName && <p className="mt-1 text-xs text-text-muted">— {f.customerName}</p>}
              </CardContent>
            </Card>
          ))}
          {feedback.length === 0 && <p className="text-sm text-text-muted">No private feedback yet.</p>}
        </div>
      </div>
    </div>
  );
}
