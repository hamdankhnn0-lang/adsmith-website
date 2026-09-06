import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

const schema = z.object({
  branchId: z.string().min(1),
  googleAccountId: z.string().min(1),
  googleLocationId: z.string().min(1),
  locationName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await requireRole("SUPER_ADMIN");
    const json = await req.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const location = await prisma.googleLocation.upsert({
      where: { branchId: parsed.data.branchId },
      update: {
        googleAccountId: parsed.data.googleAccountId,
        googleLocationId: parsed.data.googleLocationId,
        locationName: parsed.data.locationName,
        connected: true,
        lastSyncError: null,
      },
      create: {
        branchId: parsed.data.branchId,
        googleAccountId: parsed.data.googleAccountId,
        googleLocationId: parsed.data.googleLocationId,
        locationName: parsed.data.locationName,
        connected: true,
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "CONNECT_BRANCH_TO_GOOGLE", entityType: "Branch", entityId: parsed.data.branchId },
    });

    return NextResponse.json(location);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to connect branch." }, { status: 500 });
  }
}
