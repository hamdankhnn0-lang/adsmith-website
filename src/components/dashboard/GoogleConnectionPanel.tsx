"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { RefreshCw, Unplug, Link2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface BranchRow {
  id: string;
  name: string;
  connected: boolean;
  locationName: string | null;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
}

interface GoogleLocationOption {
  accountId: string;
  accountName: string;
  locationId: string;
  locationTitle: string;
}

export function GoogleConnectionPanel({
  isConnected,
  isConfigured,
  branches,
}: {
  isConnected: boolean;
  isConfigured: boolean;
  branches: BranchRow[];
}) {
  const router = useRouter();
  const [options, setOptions] = useState<GoogleLocationOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [syncingBranch, setSyncingBranch] = useState<string | null>(null);

  async function loadLocations() {
    setLoadingOptions(true);
    setError(null);
    try {
      const res = await fetch("/api/google/locations");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const flat: GoogleLocationOption[] = [];
      for (const r of data.results) {
        for (const loc of r.locations) {
          flat.push({
            accountId: r.account.name,
            accountName: r.account.accountName,
            locationId: loc.name,
            locationTitle: loc.title,
          });
        }
      }
      setOptions(flat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Google locations.");
    } finally {
      setLoadingOptions(false);
    }
  }

  async function connectBranch(branchId: string) {
    const value = selection[branchId];
    if (!value) return;
    const [accountId, locationId, locationTitle] = value.split("|||");

    await fetch("/api/google/connect-branch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branchId, googleAccountId: accountId, googleLocationId: locationId, locationName: locationTitle }),
    });
    router.refresh();
  }

  async function syncBranch(branchId: string) {
    setSyncingBranch(branchId);
    setError(null);
    try {
      const res = await fetch(`/api/google/sync/${branchId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed.");
    } finally {
      setSyncingBranch(null);
    }
  }

  async function disconnect() {
    await fetch("/api/google/disconnect", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "success" : "neutral"}>
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
          {!isConfigured && (
            <span className="text-xs text-text-muted">
              Set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI to enable.
            </span>
          )}
        </div>

        {!isConnected ? (
          <a href="/api/google/oauth/start">
            <Button size="sm" disabled={!isConfigured}>
              <Link2 size={14} /> Connect Google Business Profile
            </Button>
          </a>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={loadLocations} disabled={loadingOptions}>
              <RefreshCw size={14} /> {loadingOptions ? "Loading..." : "Load Locations"}
            </Button>
            <Button size="sm" variant="danger" onClick={disconnect}>
              <Unplug size={14} /> Disconnect
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase text-text-muted">
            <tr>
              <th className="px-3 py-2">Branch</th>
              <th className="px-3 py-2">Google Location</th>
              <th className="px-3 py-2">Last Synced</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-3 py-2 font-medium">{b.name}</td>
                <td className="px-3 py-2">
                  {b.connected ? (
                    <span>{b.locationName ?? "Connected"}</span>
                  ) : isConnected && options.length > 0 ? (
                    <Select
                      className="h-8 text-xs"
                      value={selection[b.id] ?? ""}
                      onChange={(e) => setSelection((s) => ({ ...s, [b.id]: e.target.value }))}
                    >
                      <option value="">Select location...</option>
                      {options.map((o) => (
                        <option key={o.locationId} value={`${o.accountId}|||${o.locationId}|||${o.locationTitle}`}>
                          {o.accountName} — {o.locationTitle}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <span className="text-text-muted">Not connected</span>
                  )}
                  {b.lastSyncError && <p className="mt-1 text-xs text-danger">{b.lastSyncError}</p>}
                </td>
                <td className="px-3 py-2 text-xs text-text-muted">
                  {b.lastSyncedAt ? formatDateTime(b.lastSyncedAt) : "Never"}
                </td>
                <td className="px-3 py-2">
                  {!b.connected && isConnected && options.length > 0 && selection[b.id] && (
                    <Button size="sm" variant="outline" onClick={() => connectBranch(b.id)}>
                      Save
                    </Button>
                  )}
                  {b.connected && (
                    <Button size="sm" variant="outline" onClick={() => syncBranch(b.id)} disabled={syncingBranch === b.id}>
                      <RefreshCw size={12} /> {syncingBranch === b.id ? "Syncing..." : "Sync Now"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
