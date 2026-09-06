import { NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { listAccounts, listLocations, GoogleApiError } from "@/lib/google/business-profile";
import { GoogleConnectionError } from "@/lib/google/oauth";

export async function GET() {
  try {
    await requireRole("SUPER_ADMIN");

    const accounts = await listAccounts();
    const results = [];
    for (const account of accounts) {
      const locations = await listLocations(account.name);
      results.push({ account, locations });
    }

    return NextResponse.json({ results });
  } catch (err) {
    if (err instanceof GoogleConnectionError) return NextResponse.json({ error: err.message }, { status: 409 });
    if (err instanceof GoogleApiError) return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
    console.error(err);
    return NextResponse.json({ error: "Failed to load Google locations." }, { status: 500 });
  }
}
