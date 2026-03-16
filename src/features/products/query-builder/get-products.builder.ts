import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * 1단계: 상품 목록 조회 쿼리 빌더
 * Supabase 쿼리를 구성만 하고, 실제 실행(await)은 서비스 레이어에서 수행합니다.
 */
export const getProductsQueryBuilder = (
  supabaseClient: SupabaseClient<Database>,
  params?: { category?: string; search?: string }
) => {
  let query = supabaseClient.from("products").select("*, shops(name)");

  if (params?.category) {
    query = query.eq("category", params.category);
  }

  if (params?.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  // 최신 등록 순 정렬
  query = query.order("created_at", { ascending: false });

  return query;
};
