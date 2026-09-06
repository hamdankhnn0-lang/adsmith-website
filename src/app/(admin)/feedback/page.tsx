import { prisma } from "@/lib/prisma";
import { FeedbackCard, type FeedbackCardData } from "@/components/dashboard/FeedbackCard";
import { BranchFilter } from "@/components/dashboard/BranchFilter";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import type { FeedbackStatus, Prisma } from "@prisma/client";

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string; rating?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const branches = await prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  const where: Prisma.CustomerFeedbackWhereInput = {};
  if (sp.branch) where.branchId = sp.branch;
  if (sp.rating) where.rating = Number(sp.rating);
  if (sp.status) where.status = sp.status as FeedbackStatus;

  const feedback = await prisma.customerFeedback.findMany({
    where,
    include: { branch: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const cards: FeedbackCardData[] = feedback.map((f) => ({
    id: f.id,
    branchName: f.branch.name,
    rating: f.rating,
    feedbackText: f.feedbackText,
    customerName: f.customerName,
    customerPhone: f.customerPhone,
    category: f.category,
    status: f.status,
    staffNotes: f.staffNotes,
    createdAt: f.createdAt.toISOString(),
    categoryRatings: [
      { label: "Food Quality", value: f.foodQualityRating },
      { label: "Delivery", value: f.deliveryRating },
      { label: "Staff", value: f.staffRating },
      { label: "Cleanliness", value: f.cleanlinessRating },
      { label: "Packaging", value: f.packagingRating },
      { label: "Waiting Time", value: f.waitingTimeRating },
    ],
  }));

  const newCount = feedback.filter((f) => f.status === "NEW").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Customer Feedback</h1>
          <p className="text-sm text-text-muted">
            Private feedback collected via the QR feedback form (not published to Google). {newCount} new.
          </p>
        </div>
        <div className="flex gap-2">
          <BranchFilter branches={branches} />
          <ExportMenu type="feedback" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((f) => <FeedbackCard key={f.id} feedback={f} />)}
        {cards.length === 0 && <p className="col-span-full py-10 text-center text-sm text-text-muted">No feedback yet.</p>}
      </div>
    </div>
  );
}
