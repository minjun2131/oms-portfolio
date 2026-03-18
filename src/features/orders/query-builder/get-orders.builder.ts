import { SupabaseClient } from "@supabase/supabase-js";

/**
 * 1단계: 주문 목록 조회 쿼리 빌더
 * 주문 마스터와 상세 항목(order_items)을 한 번에 리턴하도록 쿼리를 구성합니다.
 */
export const buildSearchOrdersQuery = (
  supabaseClient: SupabaseClient<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  params?: { search?: string; status?: string }
) => {
  let query = supabaseClient.from("orders").select(`
    *,
    order_items (*)
  `);

  if (params?.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params?.search) {
    // 주문번호, 수령인명, 주문자명 등으로 필터링
    query = query.or(
      `id.ilike.%${params.search}%,customer_name.ilike.%${params.search}%,receiver_name.ilike.%${params.search}%`
    );
  }

  // 최신 주문 순 정렬
  query = query.order("created_at", { ascending: false });

  return query;
};
