import { createClient } from "@/lib/supabase/server";
import {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
} from "lucide-react";
import {
  StatsCard,
  RecentOrders,
  TopProducts,
  SalesChart,
  QuickActions,
} from "@/features/dashboard/components";
import { DashboardWidget } from "@/components/shared/dashboard-widget";

export default async function HomePage() {
  const supabase = await createClient();

  // 1. 통계 및 데이터 조회를 위한 기본 주문 데이터 (아이템 포함)
  const { data: allOrders } = await supabase
    .from("orders")
    .select(`
      total_amount,
      status,
      created_at,
      customer_name,
      order_items (
        product_name,
        quantity,
        price
      )
    `)
    .eq("status", "completed")
    .order("created_at", { ascending: true });

  // --- 데이터 가공 ---
  
  // A. 총 통계 (금액을 확실하게 숫자로 변환)
  const orders = allOrders || [];
  const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(c => c.customer_name)).size;

  // B. 매출 추이 그래프 데이터 (YYYY-MM-DD 형식으로 안정적인 그룹화)
  const salesByDate: Record<string, number> = {};
  orders.forEach((order: any) => {
    const date = new Date(order.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    salesByDate[date] = (salesByDate[date] || 0) + (Number(order.total_amount) || 0);
  });
  
  // 그래프 데이터가 비어있을 경우를 대비해 최소한의 배열 반환
  const chartData = Object.entries(salesByDate).length > 0 
    ? Object.entries(salesByDate).map(([name, 매출]) => ({ name, 매출 }))
    : [{ name: "데이터 없음", 매출: 0 }];

  // C. 인기 상품 집계 (정확한 품명 기준)
  const productStats: Record<string, { sales: number; revenue: number }> = {};
  orders.forEach((order: any) => {
    order.order_items?.forEach((item: any) => {
      const pName = item.product_name || "알 수 없는 상품";
      if (!productStats[pName]) {
        productStats[pName] = { sales: 0, revenue: 0 };
      }
      productStats[pName].sales += Number(item.quantity) || 0;
      productStats[pName].revenue += (Number(item.quantity) || 0) * (Number(item.price) || 0);
    });
  });

  const topProductsData = Object.entries(productStats)
    .map(([name, stats]) => ({
      name,
      sales: stats.sales,
      revenue: stats.revenue,
      stock: 50, // 재고는 일단 고정값
      progress: Math.min(100, Math.floor((stats.sales / 50) * 100))
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // D. 전체 등록 상품 수
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true });

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
        <DashboardWidget>
          <StatsCard
            title="총 매출"
            value={`₩${totalRevenue.toLocaleString()}`}
            icon={<CreditCard className="h-6 w-6 text-primary" />}
            iconBgColor="bg-primary/10"
          />
        </DashboardWidget>
        <DashboardWidget>
          <StatsCard
            title="주문 건수"
            value={`${totalOrders}건`}
            icon={<ShoppingCart className="h-6 w-6 text-[oklch(0.65_0.18_145)]" />}
            iconBgColor="bg-[oklch(0.65_0.18_145)]/10"
          />
        </DashboardWidget>
        <DashboardWidget>
          <StatsCard
            title="등록 상품"
            value={`${productCount || 0}개`}
            icon={<Package className="h-6 w-6 text-[oklch(0.75_0.15_85)]" />}
            iconBgColor="bg-[oklch(0.75_0.15_85)]/10"
          />
        </DashboardWidget>
        <DashboardWidget>
          <StatsCard
            title="총 고객"
            value={`${uniqueCustomers.toLocaleString()}명`}
            icon={<Users className="h-6 w-6 text-[oklch(0.6_0.15_30)]" />}
            iconBgColor="bg-[oklch(0.6_0.15_30)]/10"
          />
        </DashboardWidget>
      </div>

      {/* Charts and Data */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Sales Chart */}
        <div className="lg:col-span-2">
          <DashboardWidget>
            <SalesChart data={chartData} />
          </DashboardWidget>
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DashboardWidget>
          <RecentOrders />
        </DashboardWidget>
        <DashboardWidget>
          <TopProducts data={topProductsData} />
        </DashboardWidget>
      </div>
    </div>
  );
}
