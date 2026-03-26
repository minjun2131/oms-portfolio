import { SupabaseClient } from "@supabase/supabase-js";
import { ReportsQueryBuilder } from "./reports-query-builder";

export interface MonthlyRevenueData {
  date: string;
  revenue: number;
  refunds: number;
}

export interface CategorySalesData {
  name: string;
  value: number;
}

export interface ProductRankingData {
  name: string;
  quantity: number;
}

export class ReportsService {
  private queryBuilder: ReportsQueryBuilder;

  constructor(supabase: SupabaseClient) {
    this.queryBuilder = new ReportsQueryBuilder(supabase);
  }

  // 결제 완료 이상의 상태 (pending 제외, 정상 주문)
  private readonly REVENUE_STATUSES = ["paid", "preparing", "shipping", "shipped", "delivered"];
  // 취소/환불 상태
  private readonly REFUND_STATUSES = ["cancelled"];

  /**
   * 월별 매출/취소액 차트용 가공
   * - 매출: paid, preparing, shipping, shipped, delivered
   * - 환불: cancelled
   */
  async getMonthlyRevenueReport(from?: string, to?: string): Promise<MonthlyRevenueData[]> {
    const rawData = await this.queryBuilder.getMonthlyRevenue(from, to);
    
    // 월별로 그룹화
    const grouped = rawData.reduce((acc: any, current: any) => {
      const date = new Date(current.created_at);
      const month = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0');
      
      if (!acc[month]) {
        acc[month] = { date: month, revenue: 0, refunds: 0 };
      }
      
      if (this.REVENUE_STATUSES.includes(current.status)) {
        acc[month].revenue += current.total_amount || 0;
      } else if (this.REFUND_STATUSES.includes(current.status)) {
        acc[month].refunds += current.total_amount || 0;
      }
      
      return acc;
    }, {});

    return Object.values(grouped);
  }

  /**
   * 카테고리 점유율 차트용 가공
   * - 결제 완료 이상(paid~delivered) 주문만 집계
   */
  async getCategorySalesReport(from?: string, to?: string): Promise<CategorySalesData[]> {
    const rawData = await this.queryBuilder.getCategorySales(from, to);
    
    const categories = rawData.reduce((acc: any, current: any) => {
      const categoryName = current.product?.category?.name || "기타";
      
      if (this.REVENUE_STATUSES.includes(current.order?.status)) {
        if (!acc[categoryName]) acc[categoryName] = 0;
        acc[categoryName] += current.price * current.quantity;
      }
      
      return acc;
    }, {});

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: value as number,
    })) as CategorySalesData[];
  }

  /**
   * 상품 판매 TOP 5 순위 가공
   * - 결제 완료 이상(paid~delivered) 주문만 집계
   */
  async getProductRankingReport(from?: string, to?: string): Promise<ProductRankingData[]> {
    const rawData = await this.queryBuilder.getTopProducts(from, to);
    
    const ranking = rawData.reduce((acc: any, current: any) => {
      if (this.REVENUE_STATUSES.includes(current.order?.status)) {
        const name = current.product_name;
        if (!acc[name]) acc[name] = 0;
        acc[name] += current.quantity;
      }
      return acc;
    }, {});

    return Object.entries(ranking)
      .map(([name, quantity]) => ({
        name,
        quantity: quantity as number,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }

  /**
   * 실제 주문 건수 (pending 제외)
   */
  async getOrderCountReport(from?: string, to?: string): Promise<number> {
    return this.queryBuilder.getOrderCount(from, to);
  }

  /**
   * 일별 매출 (근 7일 기본, date range 있으면 해당 범위)
   */
  async getDailyRevenueReport(from?: string, to?: string): Promise<{ date: string; sales: number }[]> {
    // 기본값: 근 7일
    const toDate = to || new Date().toISOString();
    const fromDate = from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const rawData = await this.queryBuilder.getDailyRevenue(fromDate, toDate);

    const grouped = rawData.reduce((acc: any, current: any) => {
      const date = new Date(current.created_at);
      const day = `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

      if (!acc[day]) acc[day] = { date: day, sales: 0 };
      acc[day].sales += current.total_amount || 0;
      return acc;
    }, {});

    return Object.values(grouped);
  }
}
