import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/rbac";
import { exchangeCodeForTokens, persistTokens } from "@/lib/google/oauth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  try {
    const user = await requireRole("SUPER_ADMIN");

    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const storedState = req.cookies.get("google_oauth_state")?.value;

    if (!code) {
      return NextResponse.redirect(new URL("/settings?googleError=Missing+authorization+code.", appUrl));
    }
    if (!state || state !== storedState) {
      return NextResponse.redirect(new URL("/settings?googleError=Invalid+OAuth+state.+Please+try+again.", appUrl));
    }

    const tokens = await exchangeCodeForTokens(code);
    await persistTokens(tokens);

    await prisma.auditLog.create({
      data: { userId: user.id, action: "GOOGLE_OAUTH_CONNECTED", entityType: "OAuthToken" },
    });

    return NextResponse.redirect(new URL("/settings?googleConnected=1", appUrl));
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Failed to connect Google Business Profile.";
    return NextResponse.redirect(new URL(`/settings?googleError=${encodeURIComponent(message)}`, appUrl));
  }
}
