import { resolveDateRange } from "@/lib/date-range";
import { getCompetitorComparison, getCompetitorSentimentBreakdown } from "@/lib/data/competitors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AddCompetitorForm } from "@/components/dashboard/AddCompetitorForm";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { BranchRatingChart } from "@/components/charts/BranchRatingChart";
import { formatDate } from "@/lib/utils";

export default async function CompetitorsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const { from, to } = resolveDateRange(range ?? "30d");

  const [comparison, sentiment] = await Promise.all([
    getCompetitorComparison(from, to),
    getCompetitorSentimentBreakdown(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Competitor Analysis</h1>
          <p className="text-sm text-text-muted">
            Manually entered benchmarking data. Not a live/real-time feed from Google Maps.
          </p>
        </div>
        <div className="flex gap-2">
          <ExportMenu type="competitors" />
          <AddCompetitorForm />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Pizza Box vs Competitors</CardTitle></CardHeader>
        <CardContent>
          <BranchRatingChart data={comparison.map((c) => ({ name: c.name, avgRating: c.rating }))} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted text-left text-xs uppercase text-text-muted">
              <tr>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Reviews</th>
                <th className="px-4 py-3">Monthly Growth</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((c) => (
                <tr key={c.id} className={`border-b border-border last:border-0 ${c.isPizzaBox ? "bg-brand-red-light/40 font-medium" : ""}`}>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.rating} ★</td>
                  <td className="px-4 py-3">{c.reviewCount.toLocaleString()}</td>
                  <td className="px-4 py-3">{c.monthlyGrowth >= 0 ? "+" : ""}{c.monthlyGrowth}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.source === "DEMO" ? "warning" : c.source === "GOOGLE_API" ? "success" : "neutral"}>
                      {c.source === "DEMO" ? "Demo Data" : c.source === "GOOGLE_API" ? "Google API" : "Manual"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">{formatDate(c.lastUpdatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold">Competitor Sentiment (Demo Data)</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {sentiment.map((s) => (
            <Card key={s.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{s.name}</CardTitle>
                <span className="text-xs text-text-muted">{s.total} reviews analyzed</span>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase text-success">Strengths</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.strengths.length === 0 && <span className="text-xs text-text-muted">Not enough data.</span>}
                    {s.strengths.map((w) => (
                      <span key={w} className="rounded-full bg-success-light px-2 py-0.5 text-xs capitalize text-success">{w}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase text-danger">Weaknesses</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.weaknesses.length === 0 && <span className="text-xs text-text-muted">Not enough data.</span>}
                    {s.weaknesses.map((w) => (
                      <span key={w} className="rounded-full bg-danger-light px-2 py-0.5 text-xs capitalize text-danger">{w}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {sentiment.length === 0 && <p className="text-sm text-text-muted">No competitors added yet.</p>}
        </div>
      </div>
    </div>
  );
}
