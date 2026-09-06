"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS: Record<string, string> = {
  Positive: "#16803c",
  Neutral: "#6b7280",
  Negative: "#b91c1c",
  Mixed: "#b45309",
};

export function SentimentChart({ counts }: { counts: { POSITIVE: number; NEUTRAL: number; NEGATIVE: number; MIXED: number } }) {
  const data = [
    { name: "Positive", value: counts.POSITIVE },
    { name: "Neutral", value: counts.NEUTRAL },
    { name: "Negative", value: counts.NEGATIVE },
    { name: "Mixed", value: counts.MIXED },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return <p className="flex h-[220px] items-center justify-center text-sm text-text-muted">No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
          {data.map((d) => (
            <Cell key={d.name} fill={COLORS[d.name]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={30} />
      </PieChart>
    </ResponsiveContainer>
  );
}
