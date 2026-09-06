-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'BRANCH_MANAGER', 'ANALYST');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'IGNORED');

-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('FOOD_QUALITY', 'DELIVERY', 'STAFF_BEHAVIOR', 'CLEANLINESS', 'PACKAGING', 'WAITING_TIME', 'OVERALL_EXPERIENCE');

-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'MIXED');

-- CreateEnum
CREATE TYPE "ReviewTopicName" AS ENUM ('FOOD_QUALITY', 'TASTE', 'DELIVERY', 'DELIVERY_TIME', 'STAFF', 'CUSTOMER_SERVICE', 'CLEANLINESS', 'PACKAGING', 'PRICE', 'VALUE', 'QUANTITY', 'PIZZA', 'BURGER', 'PASTA', 'WINGS', 'SAUCES', 'OTHER');

-- CreateEnum
CREATE TYPE "ReviewResponseStatus" AS ENUM ('DRAFT', 'APPROVED', 'POSTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('NEW_ONE_STAR', 'NEW_TWO_STAR', 'NEW_THREE_STAR', 'RATING_DROP', 'NEGATIVE_SPIKE', 'BRANCH_BELOW_TARGET', 'STALE_UNANSWERED', 'DELIVERY_COMPLAINT_SPIKE');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('GOOGLE_BUSINESS_PROFILE');

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('DEMO', 'MANUAL', 'GOOGLE_API');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ANALYST',
    "branchId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Peshawar',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "targetRating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "googleReviewUrl" TEXT,
    "googlePlaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleLocation" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "googleAccountId" TEXT,
    "googleLocationId" TEXT,
    "locationName" TEXT,
    "connected" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncedAt" TIMESTAMP(3),
    "lastSyncError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthToken" (
    "id" TEXT NOT NULL,
    "provider" "OAuthProvider" NOT NULL DEFAULT 'GOOGLE_BUSINESS_PROFILE',
    "googleAccountId" TEXT,
    "accountId" TEXT,
    "locationId" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "scope" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleReview" (
    "id" TEXT NOT NULL,
    "googleLocationId" TEXT NOT NULL,
    "googleReviewId" TEXT NOT NULL,
    "reviewerName" TEXT,
    "reviewerPhotoUrl" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createTime" TIMESTAMP(3) NOT NULL,
    "updateTime" TIMESTAMP(3),
    "replyComment" TEXT,
    "replyUpdateTime" TIMESTAMP(3),
    "reviewReplyUrl" TEXT,
    "source" "DataSource" NOT NULL DEFAULT 'GOOGLE_API',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerFeedback" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedbackText" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "foodQualityRating" INTEGER,
    "deliveryRating" INTEGER,
    "staffRating" INTEGER,
    "cleanlinessRating" INTEGER,
    "packagingRating" INTEGER,
    "waitingTimeRating" INTEGER,
    "category" "FeedbackCategory" NOT NULL DEFAULT 'OVERALL_EXPERIENCE',
    "status" "FeedbackStatus" NOT NULL DEFAULT 'NEW',
    "staffNotes" TEXT,
    "resolutionStatus" TEXT,
    "wentToGoogle" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewAnalysis" (
    "id" TEXT NOT NULL,
    "googleReviewId" TEXT NOT NULL,
    "sentiment" "Sentiment" NOT NULL,
    "summary" TEXT,
    "model" TEXT NOT NULL DEFAULT 'rule-based',
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewTopic" (
    "id" TEXT NOT NULL,
    "reviewAnalysisId" TEXT NOT NULL,
    "topic" "ReviewTopicName" NOT NULL,
    "sentiment" "Sentiment" NOT NULL,
    "mentionText" TEXT,

    CONSTRAINT "ReviewTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewResponse" (
    "id" TEXT NOT NULL,
    "googleReviewId" TEXT NOT NULL,
    "draftText" TEXT NOT NULL,
    "status" "ReviewResponseStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedByAI" BOOLEAN NOT NULL DEFAULT true,
    "approvedById" TEXT,
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competitor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorLocation" (
    "id" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "branchId" TEXT,
    "locationLabel" TEXT,
    "googlePlaceId" TEXT,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "monthlyGrowth" INTEGER NOT NULL DEFAULT 0,
    "source" "DataSource" NOT NULL DEFAULT 'MANUAL',
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitorLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorReview" (
    "id" TEXT NOT NULL,
    "competitorLocationId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "sentiment" "Sentiment",
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "source" "DataSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitorReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "branchId" TEXT,
    "type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'WARNING',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recommendedAction" TEXT,
    "relatedReviewId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReport" (
    "id" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "branchId" TEXT,
    "overallRating" DOUBLE PRECISION NOT NULL,
    "newReviewsCount" INTEGER NOT NULL,
    "fiveStarCount" INTEGER NOT NULL,
    "fourStarCount" INTEGER NOT NULL,
    "threeStarCount" INTEGER NOT NULL,
    "twoStarCount" INTEGER NOT NULL,
    "oneStarCount" INTEGER NOT NULL,
    "bestBranchName" TEXT,
    "bestBranchRating" DOUBLE PRECISION,
    "worstBranchName" TEXT,
    "worstBranchRating" DOUBLE PRECISION,
    "topComplaint" TEXT,
    "topPositiveTopic" TEXT,
    "unansweredCount" INTEGER NOT NULL,
    "criticalCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_branchId_idx" ON "User"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_slug_key" ON "Branch"("slug");

-- CreateIndex
CREATE INDEX "Branch_slug_idx" ON "Branch"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleLocation_branchId_key" ON "GoogleLocation"("branchId");

-- CreateIndex
CREATE INDEX "OAuthToken_provider_idx" ON "OAuthToken"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleReview_googleReviewId_key" ON "GoogleReview"("googleReviewId");

-- CreateIndex
CREATE INDEX "GoogleReview_googleLocationId_idx" ON "GoogleReview"("googleLocationId");

-- CreateIndex
CREATE INDEX "GoogleReview_rating_idx" ON "GoogleReview"("rating");

-- CreateIndex
CREATE INDEX "GoogleReview_createTime_idx" ON "GoogleReview"("createTime");

-- CreateIndex
CREATE INDEX "CustomerFeedback_branchId_idx" ON "CustomerFeedback"("branchId");

-- CreateIndex
CREATE INDEX "CustomerFeedback_rating_idx" ON "CustomerFeedback"("rating");

-- CreateIndex
CREATE INDEX "CustomerFeedback_createdAt_idx" ON "CustomerFeedback"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewAnalysis_googleReviewId_key" ON "ReviewAnalysis"("googleReviewId");

-- CreateIndex
CREATE INDEX "ReviewTopic_topic_idx" ON "ReviewTopic"("topic");

-- CreateIndex
CREATE INDEX "ReviewTopic_reviewAnalysisId_idx" ON "ReviewTopic"("reviewAnalysisId");

-- CreateIndex
CREATE INDEX "ReviewResponse_googleReviewId_idx" ON "ReviewResponse"("googleReviewId");

-- CreateIndex
CREATE INDEX "ReviewResponse_status_idx" ON "ReviewResponse"("status");

-- CreateIndex
CREATE INDEX "CompetitorLocation_competitorId_idx" ON "CompetitorLocation"("competitorId");

-- CreateIndex
CREATE INDEX "CompetitorReview_competitorLocationId_idx" ON "CompetitorReview"("competitorLocationId");

-- CreateIndex
CREATE INDEX "Alert_branchId_idx" ON "Alert"("branchId");

-- CreateIndex
CREATE INDEX "Alert_isRead_idx" ON "Alert"("isRead");

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- CreateIndex
CREATE INDEX "DailyReport_reportDate_idx" ON "DailyReport"("reportDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReport_reportDate_branchId_key" ON "DailyReport"("reportDate", "branchId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleLocation" ADD CONSTRAINT "GoogleLocation_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleReview" ADD CONSTRAINT "GoogleReview_googleLocationId_fkey" FOREIGN KEY ("googleLocationId") REFERENCES "GoogleLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFeedback" ADD CONSTRAINT "CustomerFeedback_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAnalysis" ADD CONSTRAINT "ReviewAnalysis_googleReviewId_fkey" FOREIGN KEY ("googleReviewId") REFERENCES "GoogleReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewTopic" ADD CONSTRAINT "ReviewTopic_reviewAnalysisId_fkey" FOREIGN KEY ("reviewAnalysisId") REFERENCES "ReviewAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewResponse" ADD CONSTRAINT "ReviewResponse_googleReviewId_fkey" FOREIGN KEY ("googleReviewId") REFERENCES "GoogleReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewResponse" ADD CONSTRAINT "ReviewResponse_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorLocation" ADD CONSTRAINT "CompetitorLocation_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorLocation" ADD CONSTRAINT "CompetitorLocation_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorReview" ADD CONSTRAINT "CompetitorReview_competitorLocationId_fkey" FOREIGN KEY ("competitorLocationId") REFERENCES "CompetitorLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
