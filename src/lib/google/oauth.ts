import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { encryptSecret, decryptSecret } from "@/lib/crypto";

// Google Business Profile OAuth (server-side only). Tokens are AES-256-GCM
// encrypted before being persisted and are never sent to the frontend.

const SCOPES = ["https://www.googleapis.com/auth/business.manage"];

export function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI."
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function isGoogleOAuthConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI
  );
}

export function getAuthorizationUrl(state: string) {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function persistTokens(tokens: {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
  scope?: string | null;
}) {
  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error("Google did not return both an access token and a refresh token.");
  }

  const existing = await prisma.oAuthToken.findFirst({
    where: { provider: "GOOGLE_BUSINESS_PROFILE" },
  });

  const data = {
    provider: "GOOGLE_BUSINESS_PROFILE" as const,
    accessToken: encryptSecret(tokens.access_token),
    refreshToken: encryptSecret(tokens.refresh_token),
    scope: tokens.scope ?? null,
    expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
  };

  if (existing) {
    return prisma.oAuthToken.update({ where: { id: existing.id }, data });
  }
  return prisma.oAuthToken.create({ data });
}

export async function getStoredTokenRecord() {
  return prisma.oAuthToken.findFirst({ where: { provider: "GOOGLE_BUSINESS_PROFILE" } });
}

export async function getValidAccessToken(): Promise<string> {
  const record = await getStoredTokenRecord();
  if (!record) {
    throw new GoogleConnectionError(
      "Google Business Profile is not connected. Please connect it from Settings."
    );
  }

  const isExpired = record.expiresAt ? record.expiresAt.getTime() - Date.now() < 60_000 : false;

  if (!isExpired) {
    return decryptSecret(record.accessToken);
  }

  try {
    const client = getOAuthClient();
    client.setCredentials({ refresh_token: decryptSecret(record.refreshToken) });
    const { credentials } = await client.refreshAccessToken();

    await prisma.oAuthToken.update({
      where: { id: record.id },
      data: {
        accessToken: encryptSecret(credentials.access_token!),
        expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
      },
    });

    return credentials.access_token!;
  } catch (err) {
    throw new GoogleConnectionError(
      "Google Business Profile connection expired. Please reconnect.",
      err
    );
  }
}

export class GoogleConnectionError extends Error {
  cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "GoogleConnectionError";
    this.cause = cause;
  }
}
