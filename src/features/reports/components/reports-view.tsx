"use client";

import { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Download,
  Calendar,
  Wallet,
  BarChart3,
  ShoppingCart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { cn } from "@/lib/utils";
import { useReports } from "../hooks/queries/use-reports";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { SETTLEMENTS } from "../constants";

const COLORS = ["oklch(0.55 0.18 250)", "oklch(0.65 0.18 145)", "oklch(0.75 0.15 85)", "oklch(0.6 0.15 30)", "oklch(0.5 0.03 250)"];



export function ReportsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  
  const [period, setPeriod] = useState("month");
  const { data, isLoading } = useReports({ from, to });

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    const params = new URLSearchParams(searchParams.toString());
    const now = new Date();
    let fromDate: Date;
    let toDate: Date = now;

    switch (value) {
      case "week":
        fromDate = getStartOfWeek(now);
        toDate = getEndOfWeek(now);
        break;
      case "month":
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "quarter":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "year":
        fromDate = new Date(now.getFullYear(), 0, 1);
        toDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    params.set("from", fromDate.toISOString());
    params.set("to", toDate.toISOString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Helper functions for native date handling
  function getStartOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    return new Date(d.setDate(diff));
  }
  
  function getEndOfWeek(date: Date) {
    const start = getStartOfWeek(date);
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const reports = data || { monthlyRevenue: [], categorySales: [], productRanking: [], orderCount: 0, dailyRevenue: [] };

  const totalRevenue = reports.monthlyRevenue.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = reports.orderCount; // ✅ 실제 orders 건수
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;


  const STAT_CARDS = [
    {
      title: "선택 기간 총 매출",
      value: totalRevenue.toLocaleString(),
      unit: "원",
      change: 0,
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "총 주문 건수",
      value: totalOrders.toString(),
      unit: "건",
      change: 0,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "text-[oklch(0.65_0.18_145)]",
      bgColor: "bg-[oklch(0.65_0.18_145)]/10",
    },
    {
      title: "평균 주문 금액",
      value: avgOrderValue.toLocaleString(),
      unit: "원",
      change: 0,
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-[oklch(0.75_0.15_85)]",
      bgColor: "bg-[oklch(0.75_0.15_85)]/15",
    },
    {
      title: "정산 예정액",
      value: Math.round(totalRevenue * 0.95).toLocaleString(),
      unit: "원",
      change: 0,
      icon: <Wallet className="h-5 w-5" />,
      color: "text-[oklch(0.6_0.15_30)]",
      bgColor: "bg-[oklch(0.6_0.15_30)]/10",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">매출 / 정산</h1>
          <p className="mt-1 text-muted-foreground">매출 현황과 정산 내역을 한눈에 확인하세요</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="h-9 w-32">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">이번 주</SelectItem>
              <SelectItem value="month">이번 달</SelectItem>
              <SelectItem value="quarter">이번 분기</SelectItem>
              <SelectItem value="year">올해</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <Card key={card.title} className="border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", card.bgColor, card.color)}>
                  {card.icon}
                </div>
                {card.change !== 0 && (
                  <div className="flex items-center gap-1">
                    {card.change > 0 ? (
                      <TrendingUp className="h-3.5 w-3.5 text-[oklch(0.65_0.18_145)]" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span className={cn("text-xs font-medium", card.change > 0 ? "text-[oklch(0.65_0.18_145)]" : "text-destructive")}>
                      {card.change > 0 ? "+" : ""}{card.change}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-1">{card.title}</p>
              <p className="text-xl font-bold text-foreground">
                {card.unit === "원" ? "₩" : ""}{card.value}{card.unit === "건" ? "건" : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="sales" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            매출 분석
          </TabsTrigger>
          <TabsTrigger value="settlement" className="gap-2">
            <Wallet className="h-4 w-4" />
            정산 내역
          </TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Sales Chart */}
            <Card className="border-border/50 shadow-sm lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">월별 매출 추이</CardTitle>
                  <Select defaultValue="6months">
                    <SelectTrigger className="h-8 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">최근 3개월</SelectItem>
                      <SelectItem value="6months">최근 6개월</SelectItem>
                      <SelectItem value="12months">최근 12개월</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reports.monthlyRevenue}>
                      <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.55 0.18 250)" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="oklch(0.55 0.18 250)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="refundGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.6 0.15 30)" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="oklch(0.6 0.15 30)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 250)" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 250)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 250)" tickFormatter={(v) => `${(v / 10000).toLocaleString()}만`} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid oklch(0.92 0.015 250)", fontSize: "13px" }}
                        formatter={(value: any, name?: string) => [
                          `${Number(value || 0).toLocaleString()}원`, 
                          name === "revenue" ? "매출" : "반품/취소"
                        ]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="oklch(0.55 0.18 250)" fill="url(#salesGradient)" strokeWidth={2} />
                      <Area type="monotone" dataKey="refunds" stroke="oklch(0.6 0.15 30)" fill="url(#refundGradient)" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">카테고리별 매출</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie data={reports.categorySales} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                        {reports.categorySales.map((entry, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value.toLocaleString()}원`, "매출"]} 
                        contentStyle={{ borderRadius: "12px", fontSize: "13px" }} 
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {reports.categorySales.map((cat, i) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-sm text-foreground">{cat.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {totalRevenue > 0 ? Math.round((cat.value / totalRevenue) * 100) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Sales + Top Products */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Daily Sales */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">일별 매출 (최근 7일)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reports.dailyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 250)" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 250)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 250)" tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid oklch(0.92 0.015 250)", fontSize: "13px" }}
                        formatter={(value: any) => [`${Number(value || 0).toLocaleString()}원`, "매출"]}
                      />
                      <Bar dataKey="sales" fill="oklch(0.55 0.18 250)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

             {/* Product Ranking */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">상품별 판매 수량 순위</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.productRanking.map((product, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                        i < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.quantity}건 판매</p>
                      </div>
                    </div>
                  ))}
                  {reports.productRanking.length === 0 && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      판매 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settlement Tab */}
        <TabsContent value="settlement" className="space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">정산 내역</CardTitle>
                <p className="text-xs text-muted-foreground">수수료율: 5%</p>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">정산 기간</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center gap-1">총 매출 <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="hidden px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider sm:table-cell">수수료</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">정산 금액</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">상태</th>
                    <th className="hidden px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider md:table-cell">정산일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SETTLEMENTS.map((s, i) => (
                    <tr key={i} className="transition-colors hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-foreground">{s.period}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">{s.amount.toLocaleString()}원</span>
                      </td>
                      <td className="hidden px-6 py-4 sm:table-cell">
                        <span className="text-sm text-muted-foreground">-{s.fee.toLocaleString()}원</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-foreground">{s.net.toLocaleString()}원</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className={cn(
                          "border-0 font-medium",
                          s.status === "completed"
                            ? "bg-[oklch(0.65_0.18_145)]/10 text-[oklch(0.5_0.18_145)]"
                            : "bg-[oklch(0.75_0.15_85)]/15 text-[oklch(0.55_0.15_85)]"
                        )}>
                          {s.status === "completed" ? "정산 완료" : "정산 예정"}
                        </Badge>
                      </td>
                      <td className="hidden px-6 py-4 md:table-cell">
                        <span className="text-sm text-muted-foreground">{s.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
