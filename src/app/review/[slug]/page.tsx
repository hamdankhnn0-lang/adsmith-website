import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FeedbackFlow } from "@/components/customer/FeedbackFlow";

export default async function BranchReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = await prisma.branch.findUnique({ where: { slug } });

  if (!branch || !branch.isActive) notFound();

  return (
    <FeedbackFlow
      branchSlug={branch.slug}
      branchName={branch.name}
      googleReviewUrl={branch.googleReviewUrl}
    />
  );
}
