import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDemoData } from "@/lib/seed-demo-data";

// One-time convenience endpoint for fresh deployments (e.g. Vercel) where
// running `npm run db:seed` from a local machine isn't convenient. Guarded by
// a dedicated secret (never reuse NEXTAUTH_SECRET here) and refuses to run
// twice so it can't be used to spam demo data into a real deployment.
export async function POST(req: NextRequest) {
  const configuredSecret = process.env.SEED_SECRET;
  if (!configuredSecret) {
    return NextResponse.json(
      { error: "SEED_SECRET is not set in the environment. Set it to enable this one-time endpoint." },
      { status: 503 }
    );
  }

  const provided = req.headers.get("x-seed-secret") ?? req.nextUrl.searchParams.get("secret");
  if (provided !== configuredSecret) {
    return NextResponse.json({ error: "Invalid or missing seed secret." }, { status: 401 });
  }

  const existingBranchCount = await prisma.branch.count();
  if (existingBranchCount > 0) {
    return NextResponse.json(
      { error: "Database already has data. Refusing to reseed to avoid duplicates." },
      { status: 409 }
    );
  }

  const log = await seedDemoData(prisma);

  return NextResponse.json({
    success: true,
    log,
    credentials: {
      note: "Password for all demo accounts is PizzaBox@123",
      superAdmin: "admin@pizzabox.pk",
      analyst: "analyst@pizzabox.pk",
      branchManagerExample: "manager.hayatabad@pizzabox.pk",
    },
  });
}
