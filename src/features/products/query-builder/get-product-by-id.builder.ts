import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * 1단계: 단일 상품 조회 쿼리 빌더
 * Supabase 쿼리를 구성만 하고, 실제 실행(await)은 서비스 레이어에서 수행합니다.
 */
export const getProductByIdQueryBuilder = (
  supabaseClient: SupabaseClient<Database>,
  id: string
) => {
  return supabaseClient
    .from("products")
    .select("*, shops(name)")
    .eq("id", id)
    .single();
};
