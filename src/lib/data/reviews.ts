import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface ReviewFilters {
  rating?: number;
  answered?: "answered" | "unanswered";
  branchId?: string;
  sort?: "latest" | "oldest";
  sentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED";
  critical?: boolean;
}

export async function listReviews(filters: ReviewFilters) {
  const where: Prisma.GoogleReviewWhereInput = {};

  if (filters.rating) where.rating = filters.rating;
  if (filters.answered === "answered") where.replyComment = { not: null };
  if (filters.answered === "unanswered") where.replyComment = null;
  if (filters.branchId) where.googleLocation = { branchId: filters.branchId };
  if (filters.sentiment) where.analysis = { sentiment: filters.sentiment };
  if (filters.critical) {
    where.rating = { lte: 2 };
    where.replyComment = null;
  }

  return prisma.googleReview.findMany({
    where,
    include: {
      googleLocation: { include: { branch: true } },
      analysis: { include: { topics: true } },
      responses: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createTime: filters.sort === "oldest" ? "asc" : "desc" },
    take: 100,
  });
}
