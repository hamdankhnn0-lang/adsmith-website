"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = 28,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center gap-1" role={readOnly ? undefined : "radiogroup"}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange?.(star)}
          className={cn(!readOnly && "cursor-pointer transition-transform hover:scale-110", readOnly && "cursor-default")}
        >
          <Star
            size={size}
            className={star <= value ? "fill-brand-red text-brand-red" : "fill-transparent text-gray-300"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

export function StaticStars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= value ? "fill-brand-red text-brand-red" : "fill-transparent text-gray-300"}
        />
      ))}
    </div>
  );
}
