import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { ProductFilters } from "../types";

/**
 * 1단계: 상품 목록 조회 쿼리 빌더
 * Supabase 쿼리를 구성만 하고, 실제 실행(await)은 서비스 레이어에서 수행합니다.
 */
export const getProductsQueryBuilder = (
  supabaseClient: SupabaseClient<Database>,
  params?: ProductFilters
) => {
  let query = supabaseClient
    .from("products")
    .select("*, shops(name)", { count: "exact" });

  if (params?.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  if (params?.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params?.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  // 최신 등록 순 정렬
  query = query.order("created_at", { ascending: false });

  // 페이지네이션 처리
  if (params?.page !== undefined && params?.limit !== undefined) {
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;
    query = query.range(from, to);
  }

  return query;
};
