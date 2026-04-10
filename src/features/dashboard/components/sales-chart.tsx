"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const weeklyData = [
  { name: "월", 매출: 1200000 },
  { name: "화", 매출: 1500000 },
  { name: "수", 매출: 1100000 },
  { name: "목", 매출: 1800000 },
  { name: "금", 매출: 2200000 },
  { name: "토", 매출: 2800000 },
  { name: "일", 매출: 2400000 },
];

const monthlyData = [
  { name: "1월", 매출: 4200000 },
  { name: "2월", 매출: 3800000 },
  { name: "3월", 매출: 5100000 },
  { name: "4월", 매출: 4700000 },
  { name: "5월", 매출: 5800000 },
  { name: "6월", 매출: 6200000 },
  { name: "7월", 매출: 5900000 },
  { name: "8월", 매출: 7100000 },
  { name: "9월", 매출: 6800000 },
  { name: "10월", 매출: 7500000 },
  { name: "11월", 매출: 8200000 },
  { name: "12월", 매출: 9100000 },
];

const yearlyData = [
  { name: "2021년", 매출: 45000000 },
  { name: "2022년", 매출: 58000000 },
  { name: "2023년", 매출: 72000000 },
  { name: "2024년", 매출: 98000000 },
];

const formatCurrency = (value: number) => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}억`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}백만`;
  }
  return `${(value / 10000).toFixed(0)}만`;
};

export function SalesChart() {
  const [view, setView] = useState<"weekly" | "monthly" | "yearly">("monthly");

  const chartData = {
    weekly: weeklyData,
    monthly: monthlyData,
    yearly: yearlyData,
  }[view];

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          매출 추이
        </CardTitle>
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
          <Button 
            variant={view === "weekly" ? "secondary" : "ghost"} 
            size="sm" 
            className={cn(
              "text-xs px-3 h-7",
              view === "weekly" ? "bg-background shadow-sm" : "text-muted-foreground"
            )}
            onClick={() => setView("weekly")}
          >
            주간
          </Button>
          <Button
            variant={view === "monthly" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "text-xs px-3 h-7",
              view === "monthly" ? "bg-background shadow-sm" : "text-muted-foreground"
            )}
            onClick={() => setView("monthly")}
          >
            월간
          </Button>
          <Button 
            variant={view === "yearly" ? "secondary" : "ghost"} 
            size="sm" 
            className={cn(
              "text-xs px-3 h-7",
              view === "yearly" ? "bg-background shadow-sm" : "text-muted-foreground"
            )}
            onClick={() => setView("yearly")}
          >
            연간
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.55 0.18 250)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.55 0.18 250)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.92 0.015 250)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.5 0.03 250)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.5 0.03 250)", fontSize: 12 }}
                tickFormatter={formatCurrency}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0 / 0.8)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid oklch(0.92 0.015 250)",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: any) => [
                  `₩${value.toLocaleString()}`,
                  "매출",
                ]}
                labelStyle={{ color: "oklch(0.2 0.02 250)", fontWeight: 600, marginBottom: "4px" }}
              />
              <Area
                type="monotone"
                dataKey="매출"
                stroke="oklch(0.55 0.18 250)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
