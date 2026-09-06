"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, X } from "lucide-react";

export function AddBranchForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", address: "", targetRating: "4.5", googleReviewUrl: "" });

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          address: form.address || undefined,
          targetRating: parseFloat(form.targetRating),
          googleReviewUrl: form.googleReviewUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add branch.");
      setOpen(false);
      setForm({ name: "", address: "", targetRating: "4.5", googleReviewUrl: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add branch.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus size={14} /> Add Branch
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">Add New Branch</p>
        <button onClick={() => setOpen(false)}><X size={16} /></button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Input placeholder="Branch name (e.g. Warsak Road)" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Input placeholder="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        <Input type="number" step="0.1" min="1" max="5" placeholder="Target rating" value={form.targetRating} onChange={(e) => setForm((f) => ({ ...f, targetRating: e.target.value }))} />
        <Input placeholder="Google review URL (optional)" value={form.googleReviewUrl} onChange={(e) => setForm((f) => ({ ...f, googleReviewUrl: e.target.value }))} />
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <div className="mt-3">
        <Button size="sm" onClick={submit} disabled={loading || !form.name}>
          {loading ? "Saving..." : "Create Branch"}
        </Button>
      </div>
      <p className="mt-2 text-[11px] text-text-muted">
        A QR feedback page and Google location slot are created automatically — no code changes needed.
      </p>
    </div>
  );
}
