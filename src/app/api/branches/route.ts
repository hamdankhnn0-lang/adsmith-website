import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

const schema = z.object({
  name: z.string().min(1).max(120),
  address: z.string().max(300).optional(),
  targetRating: z.number().min(1).max(5).default(4.5),
  googleReviewUrl: z.string().url().optional().or(z.literal("")),
});

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// New branches can be added at any time from the Settings page — no code
// changes required, satisfying the "20+ branches" scalability requirement.
export async function POST(req: Request) {
  try {
    const user = await requireRole("SUPER_ADMIN");
    const json = await req.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid branch data.", issues: parsed.error.issues }, { status: 400 });

    const slug = slugify(parsed.data.name);
    const existing = await prisma.branch.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "A branch with a similar name already exists." }, { status: 409 });

    const branch = await prisma.branch.create({
      data: {
        name: parsed.data.name,
        slug,
        address: parsed.data.address,
        targetRating: parsed.data.targetRating,
        googleReviewUrl: parsed.data.googleReviewUrl || null,
        googleLocation: { create: { locationName: `Pizza Box Peshawar - ${parsed.data.name}`, connected: false } },
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "CREATE_BRANCH", entityType: "Branch", entityId: branch.id },
    });

    return NextResponse.json(branch);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create branch." }, { status: 500 });
  }
}

export async function GET() {
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(branches);
}
