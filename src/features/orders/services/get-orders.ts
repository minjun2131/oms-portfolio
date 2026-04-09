import { SupabaseClient } from "@supabase/supabase-js";
import { buildSearchOrdersQuery, ORDERS_PAGE_SIZE } from "../query-builder/get-orders.builder";

export interface GetOrdersParams {
  search?: string;
  status?: string;
  page?: number;
}

export interface GetOrdersResult {
  data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  count: number;
}

/**
 * 2단계: 주문 목록 조회 서비스
 * - 주문 목록과 order_items를 함께 조회합니다.
 * - order_items는 product_id만 있으므로 product_name은 별도 조회 없이 "상품 #id"로 표시합니다.
 *   (order_items와 products 간 FK 없음 → Supabase 관계형 조인 불가)
 */
export const getOrders = async (
  supabaseClient: SupabaseClient<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  params?: GetOrdersParams
): Promise<GetOrdersResult> => {
  const query = buildSearchOrdersQuery(supabaseClient, params);
  const { data, error, count } = await query;

  if (error) {
    throw new Error("주문 목록을 불러오지 못했습니다: " + error.message);
  }

  return {
    data: data ?? [],
    count: count ?? 0,
  };
};

export { ORDERS_PAGE_SIZE };
