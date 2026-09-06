import { prisma } from "@/lib/prisma";
import { resolveDateRange } from "@/lib/date-range";
import { getTopicMentions, getSentimentBreakdown } from "@/lib/data/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SentimentChart } from "@/components/charts/SentimentChart";
import { ReviewCard, type ReviewCardData } from "@/components/dashboard/ReviewCard";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { TOPIC_LABELS } from "@/lib/constants";
import { Sparkles } from "lucide-react";

export default async function AiInsightsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const { from, to } = resolveDateRange(range ?? "30d");

  const [sentiment, topics, recentAnalyzed] = await Promise.all([
    getSentimentBreakdown(from, to),
    getTopicMentions(from, to),
    prisma.googleReview.findMany({
      where: { createTime: { gte: from, lte: to }, analysis: { isNot: null } },
      include: { googleLocation: { include: { branch: true } }, analysis: { include: { topics: true } } },
      orderBy: { createTime: "desc" },
      take: 8,
    }),
  ]);

  const modelInUse = process.env.OPENAI_API_KEY ? "OpenAI gpt-4o-mini" : "Rule-based classifier (demo mode)";

  const cards: ReviewCardData[] = recentAnalyzed.map((r) => ({
    id: r.id,
    reviewerName: r.reviewerName,
    rating: r.rating,
    comment: r.comment,
    createTime: r.createTime.toISOString(),
    replyComment: r.replyComment,
    branchName: r.googleLocation.branch.name,
    sentiment: r.analysis?.sentiment,
    topics: r.analysis?.topics.map((t) => ({ topic: t.topic, sentiment: t.sentiment })) ?? [],
    source: r.source,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles size={18} className="text-brand-red" /> AI Review Analysis
          </h1>
          <p className="text-sm text-text-muted">
            Automatic sentiment and topic extraction across every review. Model: <strong>{modelInUse}</strong>
          </p>
        </div>
        <DateRangeFilter />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Sentiment Distribution</CardTitle></CardHeader>
          <CardContent><SentimentChart counts={sentiment} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Complaints This Period</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {topics.topComplaints.map((t, i) => (
              <div key={t.topic} className="flex items-center justify-between text-sm">
                <span>{i + 1}. {TOPIC_LABELS[t.topic] ?? t.topic}</span>
                <Badge variant="danger">{t.count} mentions</Badge>
              </div>
            ))}
            {topics.topComplaints.length === 0 && <p className="text-sm text-text-muted">None recorded.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Positive Mentions</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {topics.topPositives.map((t, i) => (
              <div key={t.topic} className="flex items-center justify-between text-sm">
                <span>{i + 1}. {TOPIC_LABELS[t.topic] ?? t.topic}</span>
                <Badge variant="success">{t.count} mentions</Badge>
              </div>
            ))}
            {topics.topPositives.length === 0 && <p className="text-sm text-text-muted">None recorded.</p>}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold">Recently Analyzed Reviews</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {cards.map((c) => <ReviewCard key={c.id} review={c} />)}
        </div>
      </div>
    </div>
  );
}
