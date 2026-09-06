import { prisma } from "@/lib/prisma";
import { evaluateAlerts } from "@/lib/alerts/engine";
import { AlertCard, type AlertData } from "@/components/dashboard/AlertCard";

export default async function AlertsPage() {
  await evaluateAlerts();

  const alerts = await prisma.alert.findMany({
    include: { branch: true },
    orderBy: [{ isResolved: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  const data: AlertData[] = alerts.map((a) => ({
    id: a.id,
    type: a.type,
    severity: a.severity,
    title: a.title,
    description: a.description,
    recommendedAction: a.recommendedAction,
    branchName: a.branch?.name ?? null,
    isRead: a.isRead,
    isResolved: a.isResolved,
    createdAt: a.createdAt.toISOString(),
  }));

  const unresolved = data.filter((a) => !a.isResolved);
  const resolved = data.filter((a) => a.isResolved);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Alerts</h1>
        <p className="text-sm text-text-muted">
          Automated alerts for new low-star reviews, rating drops, and unanswered reviews.
        </p>
      </div>

      <div className="space-y-3">
        {unresolved.map((a) => <AlertCard key={a.id} alert={a} />)}
        {unresolved.length === 0 && (
          <p className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-text-muted">
            No active alerts. All caught up!
          </p>
        )}
      </div>

      {resolved.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-text-muted">Resolved</h2>
          <div className="space-y-3">
            {resolved.map((a) => <AlertCard key={a.id} alert={a} />)}
          </div>
        </div>
      )}
    </div>
  );
}
