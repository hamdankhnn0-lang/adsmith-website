import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function POST() {
  const user = await requireRole("SUPER_ADMIN");

  await prisma.oAuthToken.deleteMany({ where: { provider: "GOOGLE_BUSINESS_PROFILE" } });
  await prisma.googleLocation.updateMany({
    data: { connected: false, googleAccountId: null, googleLocationId: null },
  });

  await prisma.auditLog.create({ data: { userId: user.id, action: "GOOGLE_OAUTH_DISCONNECTED" } });

  return NextResponse.json({ success: true });
}
