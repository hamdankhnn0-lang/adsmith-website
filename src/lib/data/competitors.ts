import { prisma } from "@/lib/prisma";
import { round1 } from "@/lib/utils";

export interface CompetitorComparisonRow {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  monthlyGrowth: number;
  source: "DEMO" | "MANUAL" | "GOOGLE_API";
  lastUpdatedAt: Date;
  isPizzaBox?: boolean;
}

export async function getCompetitorComparison(from: Date, to: Date): Promise<CompetitorComparisonRow[]> {
  const competitors = await prisma.competitor.findMany({
    include: { locations: true },
  });

  const rows: CompetitorComparisonRow[] = competitors.map((c) => {
    const totalReviews = c.locations.reduce((s, l) => s + l.reviewCount, 0);
    const weightedRating = totalReviews > 0
      ? c.locations.reduce((s, l) => s + l.rating * l.reviewCount, 0) / totalReviews
      : 0;
    const monthlyGrowth = c.locations.reduce((s, l) => s + l.monthlyGrowth, 0);
    const lastUpdatedAt = c.locations.reduce(
      (latest, l) => (l.lastUpdatedAt > latest ? l.lastUpdatedAt : latest),
      c.locations[0]?.lastUpdatedAt ?? c.updatedAt
    );
    const source = c.locations.every((l) => l.source === "DEMO") ? "DEMO" : c.locations.some((l) => l.source === "GOOGLE_API") ? "GOOGLE_API" : "MANUAL";

    return {
      id: c.id,
      name: c.name,
      rating: round1(weightedRating),
      reviewCount: totalReviews,
      monthlyGrowth,
      source,
      lastUpdatedAt,
    };
  });

  const pizzaBoxReviews = await prisma.googleReview.findMany({
    where: { createTime: { gte: from, lte: to } },
    select: { rating: true },
  });
  const pizzaBoxTotal = await prisma.googleReview.count();
  const pizzaBoxAvg = pizzaBoxReviews.length > 0
    ? round1(pizzaBoxReviews.reduce((s, r) => s + r.rating, 0) / pizzaBoxReviews.length)
    : 0;

  rows.unshift({
    id: "pizza-box",
    name: "Pizza Box (Us)",
    rating: pizzaBoxAvg,
    reviewCount: pizzaBoxTotal,
    monthlyGrowth: pizzaBoxReviews.length,
    source: "GOOGLE_API",
    lastUpdatedAt: new Date(),
    isPizzaBox: true,
  });

  return rows.sort((a, b) => (a.isPizzaBox ? -1 : b.isPizzaBox ? 1 : b.rating - a.rating));
}

export async function getCompetitorSentimentBreakdown() {
  const competitors = await prisma.competitor.findMany({
    include: {
      locations: {
        include: { reviews: true },
      },
    },
  });

  return competitors.map((c) => {
    const reviews = c.locations.flatMap((l) => l.reviews);
    const positive = reviews.filter((r) => r.sentiment === "POSITIVE");
    const negative = reviews.filter((r) => r.sentiment === "NEGATIVE");

    return {
      id: c.id,
      name: c.name,
      total: reviews.length,
      positiveCount: positive.length,
      negativeCount: negative.length,
      neutralCount: reviews.length - positive.length - negative.length,
      strengths: extractPhrases(positive.map((r) => r.comment)),
      weaknesses: extractPhrases(negative.map((r) => r.comment)),
    };
  });
}

function extractPhrases(comments: (string | null)[]): string[] {
  const keywords = ["delivery", "taste", "price", "expensive", "portion", "staff", "location", "quality", "wait", "slow"];
  const found = new Set<string>();
  for (const c of comments) {
    if (!c) continue;
    const lower = c.toLowerCase();
    for (const kw of keywords) {
      if (lower.includes(kw)) found.add(kw);
    }
  }
  return Array.from(found).slice(0, 5);
}
