import { prisma } from "@/lib/prisma";
import { round1, percentage } from "@/lib/utils";

export interface RatingBreakdown {
  1: number; 2: number; 3: number; 4: number; 5: number;
}

function emptyBreakdown(): RatingBreakdown {
  return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
}

export async function getOverallKpis(from: Date, to: Date) {
  const reviews = await prisma.googleReview.findMany({
    where: { createTime: { gte: from, lte: to } },
    select: { rating: true, createTime: true, replyComment: true },
  });

  const breakdown = emptyBreakdown();
  let unreplied = 0;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  let reviewsThisMonth = 0;

  for (const r of reviews) {
    breakdown[r.rating as 1 | 2 | 3 | 4 | 5] += 1;
    if (!r.replyComment) unreplied += 1;
    if (r.createTime >= monthStart) reviewsThisMonth += 1;
  }

  const total = reviews.length;
  const avgRating = total > 0
    ? round1(reviews.reduce((sum, r) => sum + r.rating, 0) / total)
    : 0;

  return { total, avgRating, breakdown, reviewsThisMonth, unreplied };
}

export interface BranchMetrics {
  id: string;
  name: string;
  slug: string;
  avgRating: number;
  totalReviews: number;
  reviewsThisMonth: number;
  breakdown: RatingBreakdown;
  breakdownPct: RatingBreakdown;
  growthPct: number;
  unrepliedCount: number;
  avgResponseTimeHours: number | null;
  feedbackScore: number;
  targetRating: number;
}

export async function getBranchPerformance(from: Date, to: Date): Promise<BranchMetrics[]> {
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    include: {
      googleLocation: {
        include: { reviews: { where: { createTime: { gte: from, lte: to } } } },
      },
      customerFeedback: { where: { createdAt: { gte: from, lte: to } } },
    },
    orderBy: { name: "asc" },
  });

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const prevPeriodLength = to.getTime() - from.getTime();
  const prevFrom = new Date(from.getTime() - prevPeriodLength);
  const prevTo = new Date(from.getTime());

  const result: BranchMetrics[] = [];

  for (const branch of branches) {
    const reviews = branch.googleLocation?.reviews ?? [];
    const breakdown = emptyBreakdown();
    let unreplied = 0;
    let reviewsThisMonth = 0;
    let responseTimeTotalHours = 0;
    let responseTimeCount = 0;

    for (const r of reviews) {
      breakdown[r.rating as 1 | 2 | 3 | 4 | 5] += 1;
      if (!r.replyComment) unreplied += 1;
      if (r.createTime >= monthStart) reviewsThisMonth += 1;
      if (r.replyComment && r.replyUpdateTime) {
        responseTimeTotalHours += (r.replyUpdateTime.getTime() - r.createTime.getTime()) / 36e5;
        responseTimeCount += 1;
      }
    }

    const total = reviews.length;
    const avgRating = total > 0 ? round1(reviews.reduce((s, r) => s + r.rating, 0) / total) : 0;

    const prevCount = await prisma.googleReview.count({
      where: {
        googleLocationId: branch.googleLocation?.id,
        createTime: { gte: prevFrom, lt: prevTo },
      },
    });

    const growthPct = prevCount > 0 ? round1(((total - prevCount) / prevCount) * 100) : total > 0 ? 100 : 0;

    const feedback = branch.customerFeedback;
    const feedbackScore = feedback.length > 0
      ? round1(feedback.reduce((s, f) => s + f.rating, 0) / feedback.length)
      : 0;

    result.push({
      id: branch.id,
      name: branch.name,
      slug: branch.slug,
      avgRating,
      totalReviews: total,
      reviewsThisMonth,
      breakdown,
      breakdownPct: {
        1: percentage(breakdown[1], total),
        2: percentage(breakdown[2], total),
        3: percentage(breakdown[3], total),
        4: percentage(breakdown[4], total),
        5: percentage(breakdown[5], total),
      },
      growthPct,
      unrepliedCount: unreplied,
      avgResponseTimeHours: responseTimeCount > 0 ? round1(responseTimeTotalHours / responseTimeCount) : null,
      feedbackScore,
      targetRating: branch.targetRating,
    });
  }

  return result;
}

export function rankBranches(branches: BranchMetrics[]) {
  return [...branches].sort((a, b) => {
    if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
    return b.totalReviews - a.totalReviews;
  });
}

export async function getTopicMentions(from: Date, to: Date) {
  const topics = await prisma.reviewTopic.findMany({
    where: {
      reviewAnalysis: { googleReview: { createTime: { gte: from, lte: to } } },
    },
    select: { topic: true, sentiment: true },
  });

  const positive = new Map<string, number>();
  const negative = new Map<string, number>();

  for (const t of topics) {
    const map = t.sentiment === "NEGATIVE" ? negative : t.sentiment === "POSITIVE" ? positive : null;
    if (!map) continue;
    map.set(t.topic, (map.get(t.topic) ?? 0) + 1);
  }

  const toSorted = (map: Map<string, number>) =>
    Array.from(map.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count);

  return { topComplaints: toSorted(negative).slice(0, 8), topPositives: toSorted(positive).slice(0, 8) };
}

export async function getSentimentBreakdown(from: Date, to: Date) {
  const analyses = await prisma.reviewAnalysis.findMany({
    where: { googleReview: { createTime: { gte: from, lte: to } } },
    select: { sentiment: true },
  });

  const counts = { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0, MIXED: 0 };
  for (const a of analyses) counts[a.sentiment] += 1;
  return counts;
}

export async function getResponseStats(from: Date, to: Date) {
  const reviews = await prisma.googleReview.findMany({
    where: { createTime: { gte: from, lte: to } },
    select: { replyComment: true, createTime: true, replyUpdateTime: true },
  });

  const total = reviews.length;
  const answered = reviews.filter((r) => r.replyComment).length;
  const responseRate = total > 0 ? percentage(answered, total) : 0;

  const responseTimes = reviews
    .filter((r) => r.replyComment && r.replyUpdateTime)
    .map((r) => (r.replyUpdateTime!.getTime() - r.createTime.getTime()) / 36e5);

  const avgResponseTimeHours = responseTimes.length > 0
    ? round1(responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length)
    : null;

  return { total, answered, responseRate, avgResponseTimeHours };
}

export async function getRatingTrend(from: Date, to: Date, granularity: "day" | "week" | "month" = "day") {
  const reviews = await prisma.googleReview.findMany({
    where: { createTime: { gte: from, lte: to } },
    select: { rating: true, createTime: true },
    orderBy: { createTime: "asc" },
  });

  const buckets = new Map<string, { sum: number; count: number }>();

  for (const r of reviews) {
    let key: string;
    const d = r.createTime;
    if (granularity === "month") {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    } else if (granularity === "week") {
      const week = Math.floor(d.getDate() / 7);
      key = `${d.getFullYear()}-${d.getMonth() + 1}-W${week}`;
    } else {
      key = d.toISOString().slice(0, 10);
    }
    const bucket = buckets.get(key) ?? { sum: 0, count: 0 };
    bucket.sum += r.rating;
    bucket.count += 1;
    buckets.set(key, bucket);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, { sum, count }]) => ({ date, avgRating: round1(sum / count), count }));
}
