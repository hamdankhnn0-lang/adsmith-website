import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/rbac";
import { resolveDateRange } from "@/lib/date-range";
import { getBranchPerformance, rankBranches } from "@/lib/data/metrics";
import { getCompetitorComparison } from "@/lib/data/competitors";
import { toCsv, toXlsx, toPdf, contentTypeFor, type Column } from "@/lib/export/tabular";
import { formatDate, formatDateTime } from "@/lib/utils";

const EXPORTERS: Record<string, () => Promise<{ rows: Record<string, unknown>[]; columns: Column[]; title: string }>> = {
  reviews: async () => {
    const reviews = await prisma.googleReview.findMany({
      include: { googleLocation: { include: { branch: true } } },
      orderBy: { createTime: "desc" },
      take: 2000,
    });
    return {
      title: "Google Reviews",
      columns: [
        { key: "branch", label: "Branch" }, { key: "reviewer", label: "Reviewer" },
        { key: "rating", label: "Rating" }, { key: "comment", label: "Comment" },
        { key: "date", label: "Date" }, { key: "replied", label: "Replied" },
      ],
      rows: reviews.map((r) => ({
        branch: r.googleLocation.branch.name,
        reviewer: r.reviewerName ?? "",
        rating: r.rating,
        comment: r.comment ?? "",
        date: formatDate(r.createTime),
        replied: r.replyComment ? "Yes" : "No",
      })),
    };
  },
  feedback: async () => {
    const feedback = await prisma.customerFeedback.findMany({
      include: { branch: true },
      orderBy: { createdAt: "desc" },
      take: 2000,
    });
    return {
      title: "Customer Feedback",
      columns: [
        { key: "branch", label: "Branch" }, { key: "rating", label: "Rating" },
        { key: "text", label: "Feedback" }, { key: "name", label: "Customer" },
        { key: "phone", label: "Phone" }, { key: "status", label: "Status" }, { key: "date", label: "Date" },
      ],
      rows: feedback.map((f) => ({
        branch: f.branch.name,
        rating: f.rating,
        text: f.feedbackText ?? "",
        name: f.customerName ?? "",
        phone: f.customerPhone ?? "",
        status: f.status,
        date: formatDateTime(f.createdAt),
      })),
    };
  },
  "branch-performance": async () => {
    const { from, to } = resolveDateRange("90d");
    const branches = rankBranches(await getBranchPerformance(from, to));
    return {
      title: "Branch Performance",
      columns: [
        { key: "rank", label: "Rank" }, { key: "name", label: "Branch" }, { key: "avgRating", label: "Avg Rating" },
        { key: "totalReviews", label: "Total Reviews" }, { key: "reviewsThisMonth", label: "This Month" },
        { key: "growthPct", label: "Growth %" }, { key: "unrepliedCount", label: "Unreplied" },
      ],
      rows: branches.map((b, i) => ({
        rank: i + 1, name: b.name, avgRating: b.avgRating, totalReviews: b.totalReviews,
        reviewsThisMonth: b.reviewsThisMonth, growthPct: b.growthPct, unrepliedCount: b.unrepliedCount,
      })),
    };
  },
  competitors: async () => {
    const { from, to } = resolveDateRange("30d");
    const comparison = await getCompetitorComparison(from, to);
    return {
      title: "Competitor Analysis",
      columns: [
        { key: "name", label: "Brand" }, { key: "rating", label: "Rating" },
        { key: "reviewCount", label: "Reviews" }, { key: "monthlyGrowth", label: "Monthly Growth" },
        { key: "source", label: "Source" }, { key: "lastUpdatedAt", label: "Last Updated" },
      ],
      rows: comparison.map((c) => ({
        name: c.name, rating: c.rating, reviewCount: c.reviewCount, monthlyGrowth: c.monthlyGrowth,
        source: c.source, lastUpdatedAt: formatDate(c.lastUpdatedAt),
      })),
    };
  },
  "monthly-report": async () => {
    const reports = await prisma.dailyReport.findMany({ where: { branchId: null }, orderBy: { reportDate: "desc" }, take: 90 });
    return {
      title: "Monthly Reputation Report",
      columns: [
        { key: "date", label: "Date" }, { key: "overallRating", label: "Overall Rating" },
        { key: "newReviews", label: "New Reviews" }, { key: "fiveStar", label: "5★" }, { key: "oneStar", label: "1★" },
        { key: "unanswered", label: "Unanswered" }, { key: "critical", label: "Critical" },
      ],
      rows: reports.map((r) => ({
        date: formatDate(r.reportDate), overallRating: r.overallRating, newReviews: r.newReviewsCount,
        fiveStar: r.fiveStarCount, oneStar: r.oneStarCount, unanswered: r.unansweredCount, critical: r.criticalCount,
      })),
    };
  },
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  await requireUser();
  const { type } = await params;
  const format = req.nextUrl.searchParams.get("format") ?? "csv";

  const exporter = EXPORTERS[type];
  if (!exporter) return NextResponse.json({ error: "Unknown export type." }, { status: 400 });

  const { rows, columns, title } = await exporter();

  let body: string | Buffer;
  if (format === "xlsx") body = await toXlsx(rows, columns, title);
  else if (format === "pdf") body = await toPdf(rows, columns, title);
  else body = toCsv(rows, columns);

  const filename = `pizzabox-${type}-${new Date().toISOString().slice(0, 10)}.${format}`;

  return new NextResponse(body as BodyInit, {
    headers: {
      "Content-Type": contentTypeFor(format),
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
