"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS: Record<string, string> = {
  PENDING: "#C9A227",
  CONFIRMED: "#3B82F6",
  PROCESSING: "#6366F1",
  SHIPPED: "#8B5CF6",
  DELIVERED: "#22C55E",
  CANCELLED: "#EF4444",
};

export function OrderStatusDonut({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) return <p className="text-sm text-charcoal/50">No orders yet.</p>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] ?? "#B85C38"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
