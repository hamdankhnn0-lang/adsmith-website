import { prisma } from "@/lib/prisma";
import type { AlertSeverity, AlertType } from "@prisma/client";

const RATING_ALERT_MAP: Record<number, AlertType> = {
  1: "NEW_ONE_STAR",
  2: "NEW_TWO_STAR",
  3: "NEW_THREE_STAR",
};

async function createAlertIfNotExists(data: {
  branchId: string | null;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  recommendedAction: string;
  relatedReviewId?: string;
}) {
  const existing = await prisma.alert.findFirst({
    where: { type: data.type, branchId: data.branchId, relatedReviewId: data.relatedReviewId ?? undefined },
  });
  if (existing) return null;
  return prisma.alert.create({ data });
}

// Runs all alert rules. Cheap enough to call on every /alerts page load and
// after every review sync at this data scale; for very high volume, wire this
// into a scheduled job (e.g. a Vercel Cron hitting /api/alerts/evaluate) instead.
export async function evaluateAlerts() {
  const created = [];
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    include: { googleLocation: true },
  });

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  for (const branch of branches) {
    if (!branch.googleLocation) continue;
    const locationId = branch.googleLocation.id;

    // New low-star reviews (1-3 stars) in the last 24h
    const recentLowStar = await prisma.googleReview.findMany({
      where: { googleLocationId: locationId, rating: { lte: 3 }, createTime: { gte: dayAgo } },
    });
    for (const review of recentLowStar) {
      const type = RATING_ALERT_MAP[review.rating];
      if (!type) continue;
      const result = await createAlertIfNotExists({
        branchId: branch.id,
        type,
        severity: review.rating === 1 ? "CRITICAL" : review.rating === 2 ? "WARNING" : "INFO",
        title: `${branch.name} received a new ${review.rating}-star review`,
        description: review.comment ?? "No written comment was provided.",
        recommendedAction: review.rating <= 2
          ? "Contact the customer privately if contact info is available, and review the reported issue with staff."
          : "Monitor for a pattern; consider following up with the customer.",
        relatedReviewId: review.id,
      });
      if (result) created.push(result);
    }

    // Branch below target rating
    const last30 = await prisma.googleReview.findMany({
      where: { googleLocationId: locationId, createTime: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { rating: true },
    });
    if (last30.length >= 5) {
      const avg = last30.reduce((s, r) => s + r.rating, 0) / last30.length;
      if (avg < branch.targetRating) {
        const result = await createAlertIfNotExists({
          branchId: branch.id,
          type: "BRANCH_BELOW_TARGET",
          severity: "WARNING",
          title: `${branch.name} rating is below target`,
          description: `30-day average rating is ${avg.toFixed(1)}★, below the ${branch.targetRating}★ target.`,
          recommendedAction: "Review recent complaints and coach staff on the most common issues.",
        });
        if (result) created.push(result);
      }
    }

    // Multiple negative reviews in a short period (3+ in 7 days)
    const recentNegative = await prisma.googleReview.count({
      where: { googleLocationId: locationId, rating: { lte: 2 }, createTime: { gte: weekAgo } },
    });
    if (recentNegative >= 3) {
      const result = await createAlertIfNotExists({
        branchId: branch.id,
        type: "NEGATIVE_SPIKE",
        severity: "CRITICAL",
        title: `${branch.name} has multiple negative reviews this week`,
        description: `${recentNegative} reviews of 2 stars or fewer in the last 7 days.`,
        recommendedAction: "Investigate for a common root cause (staffing, delivery, food quality) immediately.",
      });
      if (result) created.push(result);
    }

    // Unanswered reviews older than 48 hours
    const staleUnanswered = await prisma.googleReview.count({
      where: { googleLocationId: locationId, replyComment: null, createTime: { lte: twoDaysAgo } },
    });
    if (staleUnanswered > 0) {
      const result = await createAlertIfNotExists({
        branchId: branch.id,
        type: "STALE_UNANSWERED",
        severity: "WARNING",
        title: `${branch.name} has unanswered reviews older than 48 hours`,
        description: `${staleUnanswered} review(s) have gone unanswered for more than 48 hours.`,
        recommendedAction: "Reply to outstanding reviews from the Review Management page.",
      });
      if (result) created.push(result);
    }

    // Delivery complaint spike: compare last 7 days vs prior 7 days
    const [recentDeliveryComplaints, priorDeliveryComplaints] = await Promise.all([
      prisma.reviewTopic.count({
        where: {
          topic: "DELIVERY_TIME",
          sentiment: "NEGATIVE",
          reviewAnalysis: { googleReview: { googleLocationId: locationId, createTime: { gte: weekAgo } } },
        },
      }),
      prisma.reviewTopic.count({
        where: {
          topic: "DELIVERY_TIME",
          sentiment: "NEGATIVE",
          reviewAnalysis: { googleReview: { googleLocationId: locationId, createTime: { gte: twoWeeksAgo, lt: weekAgo } } },
        },
      }),
    ]);
    if (recentDeliveryComplaints >= 3 && recentDeliveryComplaints > priorDeliveryComplaints * 1.5) {
      const result = await createAlertIfNotExists({
        branchId: branch.id,
        type: "DELIVERY_COMPLAINT_SPIKE",
        severity: "WARNING",
        title: `${branch.name} is seeing a spike in delivery complaints`,
        description: `${recentDeliveryComplaints} delivery-time complaints this week vs ${priorDeliveryComplaints} the week before.`,
        recommendedAction: "Review delivery staffing/routes and rider performance for this branch.",
      });
      if (result) created.push(result);
    }
  }

  return created;
}
