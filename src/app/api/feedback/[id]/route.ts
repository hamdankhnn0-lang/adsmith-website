import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, canAccessBranch, ForbiddenError } from "@/lib/rbac";

const schema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "IGNORED"]).optional(),
  staffNotes: z.string().max(2000).optional(),
  resolutionStatus: z.string().max(500).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const json = await req.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const feedback = await prisma.customerFeedback.findUnique({ where: { id } });
    if (!feedback) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (!canAccessBranch(user.role, user.branchId, feedback.branchId)) {
      throw new ForbiddenError("You do not have access to this branch.");
    }

    const updated = await prisma.customerFeedback.update({ where: { id }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ForbiddenError) return NextResponse.json({ error: err.message }, { status: 403 });
    console.error(err);
    return NextResponse.json({ error: "Failed to update feedback." }, { status: 500 });
  }
}
