"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

export function GenerateReportButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    await fetch("/api/reports/daily", { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <Button size="sm" onClick={generate} disabled={loading}>
      <RefreshCw size={14} /> {loading ? "Generating..." : "Generate Today's Report"}
    </Button>
  );
}
