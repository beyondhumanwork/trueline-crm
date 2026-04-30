"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface RevenueBarChartProps {
  data: Array<{ month: string; revenue: number }>;
}

export function RevenueBarChart({ data }: RevenueBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              tickFormatter={(v: number) => formatCurrency(v).replace("CA$", "$")}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
              cursor={{ fill: "var(--muted)" }}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--color-chart-1)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
