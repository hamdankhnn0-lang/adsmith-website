import { NextResponse } from "next/server";
import crypto from "crypto";
import { requireRole } from "@/lib/rbac";
import { getAuthorizationUrl, isGoogleOAuthConfigured } from "@/lib/google/oauth";

export async function GET() {
  try {
    await requireRole("SUPER_ADMIN");

    if (!isGoogleOAuthConfigured()) {
      return NextResponse.redirect(
        new URL("/settings?googleError=Google+OAuth+is+not+configured.+Set+GOOGLE_CLIENT_ID%2C+GOOGLE_CLIENT_SECRET%2C+and+GOOGLE_REDIRECT_URI.", process.env.APP_URL ?? "http://localhost:3000")
      );
    }

    const state = crypto.randomBytes(16).toString("hex");
    const url = getAuthorizationUrl(state);
    const res = NextResponse.redirect(url);
    res.cookies.set("google_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600 });
    return res;
  } catch {
    return NextResponse.redirect(new URL("/settings?googleError=Not+authorized.", process.env.APP_URL ?? "http://localhost:3000"));
  }
}
