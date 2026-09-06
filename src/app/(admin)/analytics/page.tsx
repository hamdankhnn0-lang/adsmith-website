import { resolveDateRange } from "@/lib/date-range";
import {
  getOverallKpis, getBranchPerformance, getTopicMentions, getRatingTrend,
  getSentimentBreakdown, getResponseStats, rankBranches,
} from "@/lib/data/metrics";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { RatingDistributionChart } from "@/components/charts/RatingDistributionChart";
import { SentimentChart } from "@/components/charts/SentimentChart";
import { Badge } from "@/components/ui/Badge";
import { TOPIC_LABELS } from "@/lib/constants";
import { Star, MessageSquareReply, Clock, TrendingUp } from "lucide-react";

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const { from, to } = resolveDateRange(range ?? "90d");
  const granularity = (range === "12m" || range === "6m") ? "month" : range === "90d" ? "week" : "day";

  const [kpis, branches, topics, trend, sentiment, response] = await Promise.all([
    getOverallKpis(from, to),
    getBranchPerformance(from, to),
    getTopicMentions(from, to),
    getRatingTrend(from, to, granularity),
    getSentimentBreakdown(from, to),
    getResponseStats(from, to),
  ]);

  const ranked = rankBranches(branches);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Review Analytics</h1>
          <p className="text-sm text-text-muted">Deep dive into rating trends, sentiment, and response performance.</p>
        </div>
        <DateRangeFilter />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Average Rating" value={kpis.avgRating || "—"} suffix="★" icon={Star} tone="brand" />
        <KpiCard label="Review Volume" value={kpis.total} icon={TrendingUp} />
        <KpiCard label="Response Rate" value={response.responseRate} suffix="%" icon={MessageSquareReply} tone="success" />
        <KpiCard label="Avg Response Time" value={response.avgResponseTimeHours ?? "—"} suffix="hrs" icon={Clock} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Rating Trend</CardTitle></CardHeader>
          <CardContent><TrendChart data={trend} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sentiment Breakdown</CardTitle></CardHeader>
          <CardContent><SentimentChart counts={sentiment} /></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Rating Distribution</CardTitle></CardHeader>
          <CardContent><RatingDistributionChart breakdown={kpis.breakdown} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Complaint Categories</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {topics.topComplaints.map((t) => (
              <div key={t.topic} className="flex items-center justify-between text-sm">
                <span>{TOPIC_LABELS[t.topic] ?? t.topic}</span>
                <Badge variant="danger">{t.count}</Badge>
              </div>
            ))}
            {topics.topComplaints.length === 0 && <p className="text-sm text-text-muted">None recorded.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Positive Topics</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {topics.topPositives.map((t) => (
              <div key={t.topic} className="flex items-center justify-between text-sm">
                <span>{TOPIC_LABELS[t.topic] ?? t.topic}</span>
                <Badge variant="success">{t.count}</Badge>
              </div>
            ))}
            {topics.topPositives.length === 0 && <p className="text-sm text-text-muted">None recorded.</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Branch Performance Summary</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted text-left text-xs uppercase text-text-muted">
              <tr>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Avg Rating</th>
                <th className="px-4 py-3">Reviews</th>
                <th className="px-4 py-3">Growth</th>
                <th className="px-4 py-3">Unreplied</th>
                <th className="px-4 py-3">Feedback Score</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3">{b.avgRating || "—"} ★</td>
                  <td className="px-4 py-3">{b.totalReviews}</td>
                  <td className="px-4 py-3">{b.growthPct >= 0 ? "+" : ""}{b.growthPct}%</td>
                  <td className="px-4 py-3">{b.unrepliedCount}</td>
                  <td className="px-4 py-3">{b.feedbackScore || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
