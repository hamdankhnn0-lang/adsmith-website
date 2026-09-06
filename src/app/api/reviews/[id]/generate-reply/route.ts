import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, canAccessBranch, ForbiddenError } from "@/lib/rbac";
import { generateReplyDraft } from "@/lib/ai/reply";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();

    const { allowed } = rateLimit(`generate-reply:${user.id}`, 30, 10 * 60 * 1000);
    if (!allowed) return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });

    const { id } = await params;

    const review = await prisma.googleReview.findUnique({
      where: { id },
      include: { googleLocation: { include: { branch: true } } },
    });
    if (!review) return NextResponse.json({ error: "Review not found." }, { status: 404 });

    if (!canAccessBranch(user.role, user.branchId, review.googleLocation.branchId)) {
      throw new ForbiddenError("You do not have access to this branch.");
    }

    const { draft, model } = await generateReplyDraft({
      reviewerName: review.reviewerName,
      rating: review.rating,
      comment: review.comment,
      branchName: review.googleLocation.branch.name,
    });

    const response = await prisma.reviewResponse.create({
      data: {
        googleReviewId: review.id,
        draftText: draft,
        status: "DRAFT",
        generatedByAI: true,
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "GENERATE_REPLY_DRAFT", entityType: "GoogleReview", entityId: review.id, metadata: { model } },
    });

    return NextResponse.json({ id: response.id, draft: response.draftText });
  } catch (err) {
    if (err instanceof ForbiddenError) return NextResponse.json({ error: err.message }, { status: 403 });
    console.error(err);
    return NextResponse.json({ error: "Failed to generate reply draft." }, { status: 500 });
  }
}
