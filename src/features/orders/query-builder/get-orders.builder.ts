import { SupabaseClient } from "@supabase/supabase-js";

const PAGE_SIZE = 10;

/**
 * 1단계: 주문 목록 조회 쿼리 빌더
 * 주문 마스터와 상세 항목(order_items)을 함께 검색합니다.
 * 검색 범위: 주문번호, 주문자명, 수령인명, 상품명
 */
export const buildSearchOrdersQuery = (
  supabaseClient: SupabaseClient<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  params?: { search?: string; status?: string; page?: number }
) => {
  const page = params?.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const keyword = params?.search?.trim();

  // 검색어 유무에 따른 조인 방식 결정
  // 상품명 검색을 포함하기 위해 검색어가 있을 때는 !inner 조인을 사용합니다.
  const selectStr = keyword 
    ? "*, order_items!inner(*)" 
    : "*, order_items(*)";

  let query = supabaseClient
    .from("orders")
    .select(selectStr, { count: "exact" });

  // 상태 필터링
  if (params?.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  // 검색 필터링 (주문번호, 주문자, 수령인, 상품명 통합)
  if (keyword) {
    // receiver_name 컬럼을 추가하여 홍길동이 수령인일 경우에도 검색되게 합니다.
    query = query.or(
      `order_number.ilike.%${keyword}%,customer_name.ilike.%${keyword}%,receiver_name.ilike.%${keyword}%,order_items.product_name.ilike.%${keyword}%`
    );
  }

  // 최신순 정렬 및 페이지네이션
  query = query.order("created_at", { ascending: false }).range(from, to);

  return query;
};

export { PAGE_SIZE as ORDERS_PAGE_SIZE };
