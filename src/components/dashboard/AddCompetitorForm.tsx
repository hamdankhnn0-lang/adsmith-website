"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, X } from "lucide-react";

export function AddCompetitorForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", locationLabel: "", rating: "4.0", reviewCount: "0", monthlyGrowth: "0", googlePlaceId: "" });

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          locationLabel: form.locationLabel || undefined,
          rating: parseFloat(form.rating),
          reviewCount: parseInt(form.reviewCount, 10),
          monthlyGrowth: parseInt(form.monthlyGrowth, 10),
          googlePlaceId: form.googlePlaceId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add competitor.");
      setOpen(false);
      setForm({ name: "", locationLabel: "", rating: "4.0", reviewCount: "0", monthlyGrowth: "0", googlePlaceId: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add competitor.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus size={14} /> Add Competitor
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">Add Competitor (Manual Data)</p>
        <button onClick={() => setOpen(false)}><X size={16} /></button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Input placeholder="Competitor name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Input placeholder="Branch/location label" value={form.locationLabel} onChange={(e) => setForm((f) => ({ ...f, locationLabel: e.target.value }))} />
        <Input placeholder="Google Place ID (optional)" value={form.googlePlaceId} onChange={(e) => setForm((f) => ({ ...f, googlePlaceId: e.target.value }))} />
        <Input type="number" step="0.1" min="0" max="5" placeholder="Rating" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} />
        <Input type="number" min="0" placeholder="Review count" value={form.reviewCount} onChange={(e) => setForm((f) => ({ ...f, reviewCount: e.target.value }))} />
        <Input type="number" placeholder="Monthly growth" value={form.monthlyGrowth} onChange={(e) => setForm((f) => ({ ...f, monthlyGrowth: e.target.value }))} />
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={submit} disabled={loading || !form.name}>
          {loading ? "Saving..." : "Save Competitor"}
        </Button>
      </div>
      <p className="mt-2 text-[11px] text-text-muted">
        This is manually entered benchmarking data, not live-scraped from Google Maps.
      </p>
    </div>
  );
}
