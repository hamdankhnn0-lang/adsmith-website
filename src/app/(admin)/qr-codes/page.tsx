import { prisma } from "@/lib/prisma";
import { QrCodeCard } from "@/components/dashboard/QrCodeCard";

export default async function QrCodesPage() {
  const branches = await prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">QR Code Management</h1>
        <p className="text-sm text-text-muted">
          Each branch has a unique QR code linking to its own feedback page. Print and place at tables, counters, or receipts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((b) => (
          <QrCodeCard key={b.id} branchName={b.name} url={`${appUrl}/review/${b.slug}`} />
        ))}
      </div>
    </div>
  );
}
