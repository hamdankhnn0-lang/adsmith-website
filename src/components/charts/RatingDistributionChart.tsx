"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS: Record<string, string> = {
  "5 Star": "#16803c",
  "4 Star": "#65a30d",
  "3 Star": "#b45309",
  "2 Star": "#ea580c",
  "1 Star": "#b91c1c",
};

export function RatingDistributionChart({ breakdown }: { breakdown: Record<1 | 2 | 3 | 4 | 5, number> }) {
  const data = [
    { name: "5 Star", value: breakdown[5] },
    { name: "4 Star", value: breakdown[4] },
    { name: "3 Star", value: breakdown[3] },
    { name: "2 Star", value: breakdown[2] },
    { name: "1 Star", value: breakdown[1] },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return <p className="flex h-[240px] items-center justify-center text-sm text-text-muted">No reviews yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
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
