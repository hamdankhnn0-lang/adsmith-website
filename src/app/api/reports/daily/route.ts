import { NextResponse } from "next/server";
import { requireUser } from "@/lib/rbac";
import { generateDailyReport } from "@/lib/data/daily-report";

export async function POST() {
  await requireUser();
  const report = await generateDailyReport();
  return NextResponse.json(report);
}
