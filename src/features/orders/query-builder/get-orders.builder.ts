import { SupabaseClient } from "@supabase/supabase-js";

const PAGE_SIZE = 10;

/**
 * 1단계: 주문 목록 조회 쿼리 빌더
 * - orders 테이블만 조회합니다. (order_items는 서비스 레이어에서 별도 조회 후 병합)
 * - PostgREST 제약: or= 필터와 embedded resource(order_items(*))를 동시에 사용하면 400 에러 발생
 * 검색 범위: 주문자명(customer_name), 수령인명(receiver_name), 상품명(order_items.product_name)
 */
export const buildSearchOrdersQuery = async (
  supabaseClient: SupabaseClient<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  params?: { search?: string; status?: string; page?: number }
) => {
  const page = params?.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const keyword = params?.search?.trim();

  // order_items 조인 없이 orders만 조회 (or= 필터와 충돌 방지)
  let query = supabaseClient
    .from("orders")
    .select("*", { count: "exact" });

  // 상태 필터링
  if (params?.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  // 검색 필터링 (주문자명, 수령인명, 상품명 통합)
  if (keyword) {
    // 상품명이 일치하는 order_id 목록 먼저 조회
    const { data: matchedItems } = await supabaseClient
      .from("order_items")
      .select("order_id")
      .ilike("product_name", `%${keyword}%`);

    const matchedOrderIds = matchedItems?.map((item) => item.order_id) || [];

    // 실제 존재하는 컬럼으로만 OR 조건 구성
    const orFilters = [
      `customer_name.ilike.%${keyword}%`,
      `receiver_name.ilike.%${keyword}%`,
    ];

    if (matchedOrderIds.length > 0) {
      orFilters.push(`id.in.(${matchedOrderIds.join(",")})`);
    }

    query = query.or(orFilters.join(","));
  }

  // 최신순 정렬 및 페이지네이션
  query = query.order("created_at", { ascending: false }).range(from, to);

  return query;
};

export { PAGE_SIZE as ORDERS_PAGE_SIZE };
