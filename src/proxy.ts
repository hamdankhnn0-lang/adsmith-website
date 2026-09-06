import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/branches/:path*",
    "/reviews/:path*",
    "/feedback/:path*",
    "/analytics/:path*",
    "/competitors/:path*",
    "/ai-insights/:path*",
    "/alerts/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/qr-codes/:path*",
  ],
};
