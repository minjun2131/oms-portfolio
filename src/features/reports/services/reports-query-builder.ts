import { SupabaseClient } from "@supabase/supabase-js";

export class ReportsQueryBuilder {
  constructor(private supabase: SupabaseClient) {}

  /**
   * 월별 매출 및 취소액 조회
   */
  async getMonthlyRevenue(from?: string, to?: string) {
    // orders 테이블 직접 조회 — pending 제외 (결제 미완료)
    let query = this.supabase
      .from("orders")
      .select("total_amount, status, created_at")
      .neq("status", "pending");

    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * 카테고리별 매출 비중 조회
   */
  async getCategorySales(from?: string, to?: string) {
    // ⚠️ Supabase는 관계 테이블(order.created_at) 기반 .gte/.lte를 지원하지 않음
    // 날짜 필터는 서비스 레이어에서 JS로 처리하거나, orders 기준 서브쿼리로 구현 필요
    // 현재는 전체 조회 후 서비스 레이어에서 status 기준으로만 필터링
    const query = this.supabase
      .from("order_items")
      .select(`
        price,
        quantity,
        product:products (
          category:categories (
            name
          )
        ),
        order:orders (
          status,
          created_at
        )
      `);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * 판매 상위 상품 정렬
   */
  async getTopProducts(from?: string, to?: string, limit = 5) {
    // ⚠️ Supabase는 관계 테이블(order.created_at) 기반 .gte/.lte를 지원하지 않음
    // 현재는 전체 조회 후 서비스 레이어에서 status 기준으로만 필터링
    const query = this.supabase
      .from("order_items")
      .select(`
        product_name,
        quantity,
        order:orders (
          status,
          created_at
        )
      `);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * 실제 주문 건수 카운트 (pending 제외)
   */
  async getOrderCount(from?: string, to?: string) {
    let query = this.supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .neq("status", "pending");

    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  /**
   * 일별 매출 조회 (날짜 범위 기준)
   */
  async getDailyRevenue(from: string, to: string) {
    let query = this.supabase
      .from("orders")
      .select("total_amount, status, created_at")
      .neq("status", "pending")
      .neq("status", "cancelled")
      .gte("created_at", from)
      .lte("created_at", to)
      .order("created_at", { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
