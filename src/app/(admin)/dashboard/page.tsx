import { Star, MessageSquareWarning, TrendingUp, Award, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { resolveDateRange } from "@/lib/date-range";
import { getOverallKpis, getBranchPerformance, rankBranches, getTopicMentions } from "@/lib/data/metrics";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BranchRatingChart } from "@/components/charts/BranchRatingChart";
import { RatingDistributionChart } from "@/components/charts/RatingDistributionChart";
import { StaticStars } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { TOPIC_LABELS } from "@/lib/constants";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const { from, to } = resolveDateRange(range ?? "30d");

  const [kpis, branches, topics, googleConnectedCount] = await Promise.all([
    getOverallKpis(from, to),
    getBranchPerformance(from, to),
    getTopicMentions(from, to),
    prisma.googleLocation.count({ where: { connected: true } }),
  ]);

  const ranked = rankBranches(branches);
  const worst = ranked[ranked.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Reputation Dashboard</h1>
          <p className="text-sm text-text-muted">
            {googleConnectedCount === 0
              ? "Running in demo mode — connect Google Business Profile in Settings for live data."
              : `${googleConnectedCount} branch(es) connected to Google Business Profile.`}
          </p>
        </div>
        <DateRangeFilter />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <KpiCard label="Total Google Reviews" value={kpis.total.toLocaleString()} icon={Star} tone="brand" />
        <KpiCard label="Average Rating" value={kpis.avgRating || "—"} suffix="★" icon={Award} tone="success" />
        <KpiCard label="5-Star Reviews" value={kpis.breakdown[5]} tone="success" />
        <KpiCard label="4-Star Reviews" value={kpis.breakdown[4]} tone="success" />
        <KpiCard label="3-Star Reviews" value={kpis.breakdown[3]} tone="warning" />
        <KpiCard label="2-Star Reviews" value={kpis.breakdown[2]} tone="danger" />
        <KpiCard label="1-Star Reviews" value={kpis.breakdown[1]} tone="danger" />
        <KpiCard label="Reviews This Month" value={kpis.reviewsThisMonth} icon={TrendingUp} />
        <KpiCard label="Unreplied Reviews" value={kpis.unreplied} icon={MessageSquareWarning} tone={kpis.unreplied > 10 ? "warning" : "neutral"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Branch Rating Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <BranchRatingChart data={ranked.map((b) => ({ name: b.name, avgRating: b.avgRating }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RatingDistributionChart breakdown={kpis.breakdown} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Branch Ranking</CardTitle>
            <Link href="/branches" className="text-xs font-medium text-brand-red hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {ranked.map((b, i) => (
              <Link
                key={b.id}
                href={`/branches/${b.slug}`}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 hover:bg-surface-muted"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      i === 0 ? "bg-success-light text-success" : i === ranked.length - 1 ? "bg-danger-light text-danger" : "bg-surface-muted text-text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-text-muted">{b.totalReviews} reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StaticStars value={Math.round(b.avgRating)} />
                  <span className="text-sm font-semibold tabular-nums">{b.avgRating || "—"}</span>
                </div>
              </Link>
            ))}
            {worst && worst.avgRating < worst.targetRating && (
              <div className="flex items-start gap-2 rounded-lg bg-warning-light p-3 text-xs text-warning">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>
                  <strong>{worst.name}</strong> needs attention — rating is below its {worst.targetRating}★ target.
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Complaints & Positive Mentions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-danger">Top Complaints</p>
              <ul className="space-y-1.5">
                {topics.topComplaints.length === 0 && <li className="text-xs text-text-muted">None recorded.</li>}
                {topics.topComplaints.map((t) => (
                  <li key={t.topic} className="flex items-center justify-between text-sm">
                    <span>{TOPIC_LABELS[t.topic] ?? t.topic}</span>
                    <Badge variant="danger">{t.count}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-success">Top Positive</p>
              <ul className="space-y-1.5">
                {topics.topPositives.length === 0 && <li className="text-xs text-text-muted">None recorded.</li>}
                {topics.topPositives.map((t) => (
                  <li key={t.topic} className="flex items-center justify-between text-sm">
                    <span>{TOPIC_LABELS[t.topic] ?? t.topic}</span>
                    <Badge variant="success">{t.count}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
