import { NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { syncBranchReviews } from "@/lib/google/sync";
import { GoogleConnectionError } from "@/lib/google/oauth";
import { GoogleApiError } from "@/lib/google/business-profile";

export async function POST(_req: Request, { params }: { params: Promise<{ branchId: string }> }) {
  try {
    await requireRole("SUPER_ADMIN", "BRANCH_MANAGER");
    const { branchId } = await params;
    const result = await syncBranchReviews(branchId);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof GoogleConnectionError) return NextResponse.json({ error: err.message }, { status: 409 });
    if (err instanceof GoogleApiError) return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
    console.error(err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Sync failed." }, { status: 500 });
  }
}
