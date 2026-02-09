"use client";

import {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
} from "lucide-react";
import { StatsCard } from "@/features/dashboard/components/stats-card";
import { RecentOrders } from "@/features/dashboard/components/recent-orders";
import { TopProducts } from "@/features/dashboard/components/top-products";
import { SalesChart } from "@/features/dashboard/components/sales-chart";
import { QuickActions } from "@/features/dashboard/components/quick-actions";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">대시보드</h1>
        <p className="mt-1 text-muted-foreground">
          셀러플로우에 오신 것을 환영합니다. 오늘의 현황을 확인해보세요.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 매출"
          value="₩24,580,000"
          change={12.5}
          icon={<CreditCard className="h-6 w-6 text-primary" />}
          iconBgColor="bg-primary/10"
        />
        <StatsCard
          title="주문 건수"
          value="328건"
          change={8.2}
          icon={<ShoppingCart className="h-6 w-6 text-[oklch(0.65_0.18_145)]" />}
          iconBgColor="bg-[oklch(0.65_0.18_145)]/10"
        />
        <StatsCard
          title="등록 상품"
          value="156개"
          change={4.1}
          icon={<Package className="h-6 w-6 text-[oklch(0.75_0.15_85)]" />}
          iconBgColor="bg-[oklch(0.75_0.15_85)]/10"
        />
        <StatsCard
          title="총 고객"
          value="1,842명"
          change={-2.3}
          icon={<Users className="h-6 w-6 text-[oklch(0.6_0.15_30)]" />}
          iconBgColor="bg-[oklch(0.6_0.15_30)]/10"
        />
      </div>

      {/* Charts and Data */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Sales Chart */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}
