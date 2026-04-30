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

const CHART_HEIGHT = 300;
const TICK_FONT_SIZE = 12;

const formatShortCurrency = (v: number) => formatCurrency(v).replace("CA$", "$");

export function RevenueBarChart({ data }: RevenueBarChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No revenue data yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT} aria-label="Monthly revenue bar chart">
          <BarChart data={data}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: TICK_FONT_SIZE }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              tickFormatter={formatShortCurrency}
              tick={{ fontSize: TICK_FONT_SIZE }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <Tooltip
              formatter={(value) => [formatShortCurrency(Number(value)), "Revenue"]}
              cursor={{ fill: "var(--muted)" }}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} name="Revenue">
              {data.map((entry) => (
                <Cell key={entry.month} fill="var(--color-chart-1)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
