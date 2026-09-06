import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { GenerateReportButton } from "@/components/dashboard/GenerateReportButton";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { formatDate } from "@/lib/utils";
import { TOPIC_LABELS } from "@/lib/constants";

export default async function ReportsPage() {
  const reports = await prisma.dailyReport.findMany({
    where: { branchId: null },
    orderBy: { reportDate: "desc" },
    take: 30,
  });

  const latest = reports[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Daily Management Reports</h1>
          <p className="text-sm text-text-muted">Automated daily reputation summary for management.</p>
        </div>
        <div className="flex gap-2">
          <GenerateReportButton />
          <ExportMenu type="monthly-report" />
        </div>
      </div>

      {latest ? (
        <Card>
          <CardHeader><CardTitle>PIZZA BOX DAILY REPUTATION REPORT — {formatDate(latest.reportDate)}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Metric label="Overall Rating" value={`${latest.overallRating} ★`} />
              <Metric label="New Reviews" value={latest.newReviewsCount} />
              <Metric label="5 Star" value={latest.fiveStarCount} />
              <Metric label="4 Star" value={latest.fourStarCount} />
              <Metric label="3 Star" value={latest.threeStarCount} />
              <Metric label="2 Star" value={latest.twoStarCount} />
              <Metric label="1 Star" value={latest.oneStarCount} />
              <Metric label="Unanswered Reviews" value={latest.unansweredCount} />
              <Metric label="Critical Reviews" value={latest.criticalCount} />
            </div>

            <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-text-muted">Best Branch</p>
                <p className="text-sm font-medium">{latest.bestBranchName ?? "—"} {latest.bestBranchRating && `— ${latest.bestBranchRating} ★`}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-text-muted">Branch Needing Attention</p>
                <p className="text-sm font-medium">{latest.worstBranchName ?? "—"} {latest.worstBranchRating && `— ${latest.worstBranchRating} ★`}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-text-muted">Top Complaint</p>
                <p className="text-sm font-medium">{latest.topComplaint ? TOPIC_LABELS[latest.topComplaint] ?? latest.topComplaint : "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-text-muted">Top Positive Topic</p>
                <p className="text-sm font-medium">{latest.topPositiveTopic ? TOPIC_LABELS[latest.topPositiveTopic] ?? latest.topPositiveTopic : "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card><CardContent className="p-6 text-center text-sm text-text-muted">
          No report generated yet. Click &quot;Generate Today&apos;s Report&quot; above.
        </CardContent></Card>
      )}

      <Card>
        <CardHeader><CardTitle>Report History</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted text-left text-xs uppercase text-text-muted">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Overall Rating</th>
                <th className="px-4 py-3">New Reviews</th>
                <th className="px-4 py-3">Unanswered</th>
                <th className="px-4 py-3">Critical</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{formatDate(r.reportDate)}</td>
                  <td className="px-4 py-3">{r.overallRating} ★</td>
                  <td className="px-4 py-3">{r.newReviewsCount}</td>
                  <td className="px-4 py-3">{r.unansweredCount}</td>
                  <td className="px-4 py-3">{r.criticalCount}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-text-muted">No reports yet.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
