import { prisma } from "@/lib/prisma";
import { round1 } from "@/lib/utils";
import { getBranchPerformance, rankBranches, getTopicMentions } from "@/lib/data/metrics";

// Generates (or regenerates) the org-wide daily reputation report for a given day,
// matching the format in spec section 16.
export async function generateDailyReport(date: Date = new Date()) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  const [newReviews, branchMetrics, topics] = await Promise.all([
    prisma.googleReview.findMany({ where: { createTime: { gte: dayStart, lte: dayEnd } }, select: { rating: true, replyComment: true } }),
    getBranchPerformance(new Date(0), dayEnd),
    getTopicMentions(new Date(dayStart.getTime() - 30 * 24 * 60 * 60 * 1000), dayEnd),
  ]);

  const ranked = rankBranches(branchMetrics.filter((b) => b.totalReviews > 0));
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  const allTimeAvg = branchMetrics.reduce((s, b) => s + b.avgRating * b.totalReviews, 0) /
    (branchMetrics.reduce((s, b) => s + b.totalReviews, 0) || 1);

  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  for (const r of newReviews) breakdown[r.rating as 1 | 2 | 3 | 4 | 5] += 1;

  const unanswered = await prisma.googleReview.count({ where: { replyComment: null } });
  const critical = await prisma.alert.count({ where: { severity: "CRITICAL", isResolved: false } });

  const data = {
    overallRating: round1(allTimeAvg),
    newReviewsCount: newReviews.length,
    fiveStarCount: breakdown[5],
    fourStarCount: breakdown[4],
    threeStarCount: breakdown[3],
    twoStarCount: breakdown[2],
    oneStarCount: breakdown[1],
    bestBranchName: best?.name,
    bestBranchRating: best?.avgRating,
    worstBranchName: worst?.name,
    worstBranchRating: worst?.avgRating,
    topComplaint: topics.topComplaints[0]?.topic,
    topPositiveTopic: topics.topPositives[0]?.topic,
    unansweredCount: unanswered,
    criticalCount: critical,
  };

  const existing = await prisma.dailyReport.findFirst({ where: { reportDate: dayStart, branchId: null } });

  const report = existing
    ? await prisma.dailyReport.update({ where: { id: existing.id }, data })
    : await prisma.dailyReport.create({ data: { ...data, reportDate: dayStart, branchId: null } });

  return report;
}
