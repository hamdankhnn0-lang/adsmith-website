"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function TrendChart({ data, dataKey = "avgRating", label = "Avg rating" }: {
  data: { date: string; avgRating: number; count: number }[];
  dataKey?: "avgRating" | "count";
  label?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={20} />
        <YAxis tick={{ fontSize: 12 }} domain={dataKey === "avgRating" ? [0, 5] : undefined} />
        <Tooltip formatter={(v) => [v, label]} />
        <Line type="monotone" dataKey={dataKey} stroke="#d32f2f" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
