import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { feedbackSchema } from "@/lib/validation/feedback";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { allowed } = rateLimit(`feedback:${ip}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const parsed = feedbackSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid feedback data.", issues: parsed.error.issues }, { status: 400 });
  }

  const branch = await prisma.branch.findUnique({ where: { slug: parsed.data.branchSlug } });
  if (!branch || !branch.isActive) {
    return NextResponse.json({ error: "Branch not found." }, { status: 404 });
  }

  const feedback = await prisma.customerFeedback.create({
    data: {
      branchId: branch.id,
      rating: parsed.data.rating,
      feedbackText: parsed.data.feedbackText?.trim() || null,
      customerName: parsed.data.customerName?.trim() || null,
      customerPhone: parsed.data.customerPhone?.trim() || null,
      foodQualityRating: parsed.data.foodQualityRating ?? null,
      deliveryRating: parsed.data.deliveryRating ?? null,
      staffRating: parsed.data.staffRating ?? null,
      cleanlinessRating: parsed.data.cleanlinessRating ?? null,
      packagingRating: parsed.data.packagingRating ?? null,
      waitingTimeRating: parsed.data.waitingTimeRating ?? null,
    },
  });

  return NextResponse.json({
    id: feedback.id,
    branchName: branch.name,
    googleReviewUrl: branch.googleReviewUrl,
  });
}
