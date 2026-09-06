import { getValidAccessToken, GoogleConnectionError } from "./oauth";

// The Google Business Profile "review data" surface (accounts/locations/reviews)
// is served from the legacy My Business v4 API. Reference:
// https://developers.google.com/my-business/content/review-data
const MYBUSINESS_V4 = "https://mybusiness.googleapis.com/v4";
const ACCOUNT_MGMT_V1 = "https://mybusinessaccountmanagement.googleapis.com/v1";
const BUSINESS_INFO_V1 = "https://mybusinessbusinessinformation.googleapis.com/v1";

export class GoogleApiError extends Error {
  status?: number;
  reason: string;
  constructor(message: string, status?: number, reason = "unknown") {
    super(message);
    this.name = "GoogleApiError";
    this.status = status;
    this.reason = reason;
  }
}

async function googleFetch(url: string, init?: RequestInit) {
  const accessToken = await getValidAccessToken();

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (res.ok) return res.json();

  const body = await res.text().catch(() => "");

  // Map common failure modes to actionable admin-facing messages (spec section 26).
  if (res.status === 401) {
    throw new GoogleConnectionError("Google Business Profile connection expired. Please reconnect.");
  }
  if (res.status === 403) {
    throw new GoogleApiError(
      "Permission denied by Google. The connected account may not have access to this location.",
      403,
      "permission_denied"
    );
  }
  if (res.status === 404) {
    throw new GoogleApiError("The requested Google location could not be found.", 404, "not_found");
  }
  if (res.status === 429) {
    throw new GoogleApiError(
      "Google API quota/rate limit reached. Please try again shortly.",
      429,
      "rate_limited"
    );
  }
  if (res.status >= 500) {
    throw new GoogleApiError(
      "Google's Business Profile API is temporarily unavailable. Please try again later.",
      res.status,
      "server_error"
    );
  }

  throw new GoogleApiError(`Google API request failed (${res.status}): ${body}`, res.status, "unknown");
}

export interface GoogleAccountSummary {
  name: string; // accounts/{accountId}
  accountName: string;
}

export interface GoogleLocationSummary {
  name: string; // locations/{locationId}
  title: string;
}

export interface GoogleReviewDTO {
  reviewId: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string };
  starRating: string; // ONE..FIVE
  comment?: string;
  createTime: string;
  updateTime?: string;
  reviewReply?: { comment: string; updateTime: string };
}

export async function listAccounts(): Promise<GoogleAccountSummary[]> {
  const data = await googleFetch(`${ACCOUNT_MGMT_V1}/accounts`);
  return data.accounts ?? [];
}

export async function listLocations(accountName: string): Promise<GoogleLocationSummary[]> {
  const data = await googleFetch(
    `${BUSINESS_INFO_V1}/${accountName}/locations?readMask=name,title`
  );
  return data.locations ?? [];
}

export async function listReviews(
  accountId: string,
  locationId: string,
  pageToken?: string
): Promise<{ reviews: GoogleReviewDTO[]; nextPageToken?: string; averageRating?: number; totalReviewCount?: number }> {
  const url = new URL(`${MYBUSINESS_V4}/accounts/${accountId}/locations/${locationId}/reviews`);
  if (pageToken) url.searchParams.set("pageToken", pageToken);
  const data = await googleFetch(url.toString());
  return {
    reviews: data.reviews ?? [],
    nextPageToken: data.nextPageToken,
    averageRating: data.averageRating,
    totalReviewCount: data.totalReviewCount,
  };
}

export async function replyToReview(
  accountId: string,
  locationId: string,
  reviewId: string,
  comment: string
) {
  return googleFetch(
    `${MYBUSINESS_V4}/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
    { method: "PUT", body: JSON.stringify({ comment }) }
  );
}

export function starRatingToNumber(rating: string): number {
  const map: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  return map[rating] ?? 0;
}
