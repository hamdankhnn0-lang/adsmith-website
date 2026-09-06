import Link from "next/link";
import { resolveDateRange } from "@/lib/date-range";
import { getBranchPerformance, rankBranches } from "@/lib/data/metrics";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BranchRatingChart } from "@/components/charts/BranchRatingChart";
import { StaticStars } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const RANK_LABELS = ["Best Performing Branch", "Second", "Third", "Fourth", "Needs Attention"];

export default async function BranchesPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const { from, to } = resolveDateRange(range ?? "30d");
  const branches = await getBranchPerformance(from, to);
  const ranked = rankBranches(branches);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Branch Performance</h1>
          <p className="text-sm text-text-muted">Compare all 5 Pizza Box branches side by side.</p>
        </div>
        <div className="flex gap-2">
          <DateRangeFilter />
          <ExportMenu type="branch-performance" />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Rating Comparison</CardTitle></CardHeader>
        <CardContent>
          <BranchRatingChart data={ranked.map((b) => ({ name: b.name, avgRating: b.avgRating }))} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ranked.map((b, i) => (
          <Link key={b.id} href={`/branches/${b.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant={i === 0 ? "success" : i === ranked.length - 1 ? "danger" : "neutral"}>
                    {RANK_LABELS[i] ?? `Rank #${i + 1}`}
                  </Badge>
                  {b.growthPct >= 0 ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-success">
                      <TrendingUp size={13} /> {b.growthPct}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-danger">
                      <TrendingDown size={13} /> {b.growthPct}%
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold">{b.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <StaticStars value={Math.round(b.avgRating)} />
                  <span className="text-lg font-bold tabular-nums">{b.avgRating || "—"}</span>
                  <span className="text-xs text-text-muted">({b.totalReviews} reviews)</span>
                </div>

                <div className="mt-4 grid grid-cols-5 gap-1 text-center text-[10px]">
                  {([5, 4, 3, 2, 1] as const).map((star) => (
                    <div key={star}>
                      <div className="font-semibold">{b.breakdownPct[star]}%</div>
                      <div className="text-text-muted">{star}★</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs text-text-muted">
                  <div>This month: <span className="font-medium text-foreground">{b.reviewsThisMonth}</span></div>
                  <div>Unreplied: <span className="font-medium text-foreground">{b.unrepliedCount}</span></div>
                  <div>Avg response: <span className="font-medium text-foreground">{b.avgResponseTimeHours ? `${b.avgResponseTimeHours}h` : "—"}</span></div>
                  <div>Feedback score: <span className="font-medium text-foreground">{b.feedbackScore || "—"}</span></div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
