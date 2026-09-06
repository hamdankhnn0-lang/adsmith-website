import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, canAccessBranch, ForbiddenError } from "@/lib/rbac";
import { replyToReview } from "@/lib/google/business-profile";
import { GoogleConnectionError } from "@/lib/google/oauth";

const bodySchema = z.object({ text: z.string().min(1).max(2000), responseId: z.string().optional() });

// A manager approves (and posts) a reply. This is the ONLY endpoint that ever
// pushes a reply live — nothing in this app posts to Google automatically.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    if (!["SUPER_ADMIN", "BRANCH_MANAGER"].includes(user.role)) {
      throw new ForbiddenError("Only branch managers or super admins can post replies.");
    }

    const { id } = await params;
    const json = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const review = await prisma.googleReview.findUnique({
      where: { id },
      include: { googleLocation: { include: { branch: true } } },
    });
    if (!review) return NextResponse.json({ error: "Review not found." }, { status: 404 });

    if (!canAccessBranch(user.role, user.branchId, review.googleLocation.branchId)) {
      throw new ForbiddenError("You do not have access to this branch.");
    }

    let postedToGoogle = false;

    if (review.googleLocation.connected && review.googleLocation.googleAccountId && review.googleLocation.googleLocationId && review.source === "GOOGLE_API") {
      await replyToReview(
        review.googleLocation.googleAccountId,
        review.googleLocation.googleLocationId,
        review.googleReviewId,
        parsed.data.text
      );
      postedToGoogle = true;
    }

    await prisma.googleReview.update({
      where: { id: review.id },
      data: { replyComment: parsed.data.text, replyUpdateTime: new Date() },
    });

    if (parsed.data.responseId) {
      await prisma.reviewResponse.update({
        where: { id: parsed.data.responseId },
        data: { status: "POSTED", approvedById: user.id, postedAt: new Date(), draftText: parsed.data.text },
      });
    } else {
      await prisma.reviewResponse.create({
        data: {
          googleReviewId: review.id,
          draftText: parsed.data.text,
          status: "POSTED",
          generatedByAI: false,
          approvedById: user.id,
          postedAt: new Date(),
        },
      });
    }

    await prisma.auditLog.create({
      data: { userId: user.id, action: "APPROVE_AND_REPLY", entityType: "GoogleReview", entityId: review.id, metadata: { postedToGoogle } },
    });

    return NextResponse.json({ success: true, postedToGoogle });
  } catch (err) {
    if (err instanceof ForbiddenError) return NextResponse.json({ error: err.message }, { status: 403 });
    if (err instanceof GoogleConnectionError) return NextResponse.json({ error: err.message }, { status: 409 });
    console.error(err);
    return NextResponse.json({ error: "Failed to post reply." }, { status: 500 });
  }
}
