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
 * - orders를 먼저 조회한 뒤, 반환된 order ID로 order_items를 별도 조회하여 병합합니다.
 * - PostgREST 제약(or= + embedded resource 400 에러)을 우회하기 위해 분리 조회합니다.
 */
export const getOrders = async (
  supabaseClient: SupabaseClient<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  params?: GetOrdersParams
): Promise<GetOrdersResult> => {
  // 1. orders 조회 (order_items 조인 없음)
  const query = await buildSearchOrdersQuery(supabaseClient, params);
  const { data: orders, error, count } = await query;

  if (error) {
    throw new Error("주문 목록을 불러오지 못했습니다: " + error.message);
  }

  if (!orders || orders.length === 0) {
    return { data: [], count: 0 };
  }

  // 2. 반환된 order ID 목록으로 order_items 별도 조회
  const orderIds = orders.map((o: any) => o.id); // eslint-disable-line @typescript-eslint/no-explicit-any
  const { data: orderItems } = await supabaseClient
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  // 3. order_items를 각 order에 병합
  const merged = orders.map((order: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
    ...order,
    order_items: orderItems?.filter((item: any) => item.order_id === order.id) ?? [], // eslint-disable-line @typescript-eslint/no-explicit-any
  }));

  return {
    data: merged,
    count: count ?? 0,
  };
};

export { ORDERS_PAGE_SIZE };
