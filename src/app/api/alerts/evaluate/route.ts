import { NextResponse } from "next/server";
import { evaluateAlerts } from "@/lib/alerts/engine";
import { requireUser } from "@/lib/rbac";

export async function POST() {
  await requireUser();
  const created = await evaluateAlerts();
  return NextResponse.json({ createdCount: created.length });
}
