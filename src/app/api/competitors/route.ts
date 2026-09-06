import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, ForbiddenError } from "@/lib/rbac";

const schema = z.object({
  name: z.string().min(1).max(200),
  locationLabel: z.string().max(200).optional(),
  branchId: z.string().optional(),
  googlePlaceId: z.string().max(200).optional(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  monthlyGrowth: z.number().int().default(0),
});

export async function POST(req: Request) {
  try {
    const user = await requireRole("SUPER_ADMIN", "ANALYST");
    const json = await req.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid competitor data.", issues: parsed.error.issues }, { status: 400 });
    }

    const competitor = await prisma.competitor.create({
      data: {
        name: parsed.data.name,
        notes: "Manually entered by admin.",
        locations: {
          create: {
            locationLabel: parsed.data.locationLabel,
            branchId: parsed.data.branchId || undefined,
            googlePlaceId: parsed.data.googlePlaceId,
            rating: parsed.data.rating,
            reviewCount: parsed.data.reviewCount,
            monthlyGrowth: parsed.data.monthlyGrowth,
            source: "MANUAL",
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "ADD_COMPETITOR", entityType: "Competitor", entityId: competitor.id },
    });

    return NextResponse.json({ id: competitor.id });
  } catch (err) {
    if (err instanceof ForbiddenError) return NextResponse.json({ error: err.message }, { status: 403 });
    console.error(err);
    return NextResponse.json({ error: "Failed to add competitor." }, { status: 500 });
  }
}

export async function GET() {
  const competitors = await prisma.competitor.findMany({ include: { locations: true } });
  return NextResponse.json(competitors);
}
