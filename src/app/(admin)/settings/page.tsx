import { prisma } from "@/lib/prisma";
import { isGoogleOAuthConfigured } from "@/lib/google/oauth";
import { getCurrentUser } from "@/lib/rbac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GoogleConnectionPanel } from "@/components/dashboard/GoogleConnectionPanel";
import { AddBranchForm } from "@/components/dashboard/AddBranchForm";
import { ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ googleConnected?: string; googleError?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [branches, users, oauthToken] = await Promise.all([
    prisma.branch.findMany({ include: { googleLocation: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ include: { branch: true }, orderBy: { createdAt: "asc" } }),
    prisma.oAuthToken.findFirst({ where: { provider: "GOOGLE_BUSINESS_PROFILE" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-text-muted">Manage branches, Google integration, and users.</p>
      </div>

      {sp.googleConnected && (
        <div className="rounded-lg bg-success-light p-3 text-sm text-success">
          Google Business Profile connected successfully. Now map each branch to its Google location below.
        </div>
      )}
      {sp.googleError && (
        <div className="rounded-lg bg-danger-light p-3 text-sm text-danger">{decodeURIComponent(sp.googleError)}</div>
      )}

      {isSuperAdmin ? (
        <Card>
          <CardHeader><CardTitle>Google Business Profile Integration</CardTitle></CardHeader>
          <CardContent>
            <GoogleConnectionPanel
              isConnected={!!oauthToken}
              isConfigured={isGoogleOAuthConfigured()}
              branches={branches.map((b) => ({
                id: b.id,
                name: b.name,
                connected: b.googleLocation?.connected ?? false,
                locationName: b.googleLocation?.locationName ?? null,
                lastSyncedAt: b.googleLocation?.lastSyncedAt?.toISOString() ?? null,
                lastSyncError: b.googleLocation?.lastSyncError ?? null,
              }))}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-5 text-sm text-text-muted">
            Only Super Admins can manage the Google Business Profile connection.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Branches</CardTitle>
          {isSuperAdmin && <AddBranchForm />}
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted text-left text-xs uppercase text-text-muted">
              <tr>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Target Rating</th>
                <th className="px-4 py-3">Google Review URL</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3 text-text-muted">/review/{b.slug}</td>
                  <td className="px-4 py-3">{b.targetRating}★</td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-text-muted">{b.googleReviewUrl}</td>
                  <td className="px-4 py-3">
                    <Badge variant={b.isActive ? "success" : "neutral"}>{b.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Users & Roles</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted text-left text-xs uppercase text-text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-text-muted">{u.email}</td>
                  <td className="px-4 py-3"><Badge variant="brand">{ROLE_LABELS[u.role]}</Badge></td>
                  <td className="px-4 py-3 text-text-muted">{u.branch?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-text-muted">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
