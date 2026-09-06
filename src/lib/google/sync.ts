import { prisma } from "@/lib/prisma";
import { listReviews, starRatingToNumber } from "./business-profile";
import { analyzeReview } from "@/lib/ai/sentiment";
import { GoogleConnectionError } from "./oauth";

// Pulls the latest reviews for one branch's connected Google location and
// upserts them, then runs sentiment/topic analysis on anything new.
export async function syncBranchReviews(branchId: string) {
  const googleLocation = await prisma.googleLocation.findUnique({ where: { branchId } });

  if (!googleLocation || !googleLocation.connected || !googleLocation.googleAccountId || !googleLocation.googleLocationId) {
    throw new Error("This branch is not connected to a Google Business Profile location.");
  }

  try {
    let pageToken: string | undefined;
    let syncedCount = 0;

    do {
      const { reviews, nextPageToken } = await listReviews(
        googleLocation.googleAccountId,
        googleLocation.googleLocationId,
        pageToken
      );

      for (const r of reviews) {
        const rating = starRatingToNumber(r.starRating);

        const saved = await prisma.googleReview.upsert({
          where: { googleReviewId: r.reviewId },
          update: {
            comment: r.comment ?? null,
            updateTime: r.updateTime ? new Date(r.updateTime) : null,
            replyComment: r.reviewReply?.comment ?? null,
            replyUpdateTime: r.reviewReply?.updateTime ? new Date(r.reviewReply.updateTime) : null,
            rating,
          },
          create: {
            googleLocationId: googleLocation.id,
            googleReviewId: r.reviewId,
            reviewerName: r.reviewer?.displayName ?? "Google User",
            reviewerPhotoUrl: r.reviewer?.profilePhotoUrl ?? null,
            rating,
            comment: r.comment ?? null,
            createTime: new Date(r.createTime),
            updateTime: r.updateTime ? new Date(r.updateTime) : null,
            replyComment: r.reviewReply?.comment ?? null,
            replyUpdateTime: r.reviewReply?.updateTime ? new Date(r.reviewReply.updateTime) : null,
            source: "GOOGLE_API",
          },
        });

        const existingAnalysis = await prisma.reviewAnalysis.findUnique({
          where: { googleReviewId: saved.id },
        });

        if (!existingAnalysis) {
          const analysis = await analyzeReview(saved.comment, saved.rating);
          await prisma.reviewAnalysis.create({
            data: {
              googleReviewId: saved.id,
              sentiment: analysis.sentiment,
              summary: analysis.summary,
              model: analysis.model,
              topics: {
                create: analysis.topics.map((t) => ({
                  topic: t.topic,
                  sentiment: t.sentiment,
                  mentionText: t.mentionText,
                })),
              },
            },
          });
        }

        syncedCount += 1;
      }

      pageToken = nextPageToken;
    } while (pageToken);

    await prisma.googleLocation.update({
      where: { id: googleLocation.id },
      data: { lastSyncedAt: new Date(), lastSyncError: null },
    });

    return { syncedCount };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown sync error";
    await prisma.googleLocation.update({
      where: { id: googleLocation.id },
      data: { lastSyncError: message },
    });
    if (err instanceof GoogleConnectionError) throw err;
    throw err;
  }
}
