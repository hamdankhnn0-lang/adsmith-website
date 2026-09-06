import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  suffix,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
  suffix?: string;
}) {
  const toneClasses: Record<string, string> = {
    neutral: "bg-surface-muted text-foreground",
    success: "bg-success-light text-success",
    warning: "bg-warning-light text-warning",
    danger: "bg-danger-light text-danger",
    brand: "bg-brand-red-light text-brand-red-dark",
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-text-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {value}
            {suffix && <span className="ml-1 text-sm font-normal text-text-muted">{suffix}</span>}
          </p>
        </div>
        {Icon && (
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", toneClasses[tone])}>
            <Icon size={18} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
