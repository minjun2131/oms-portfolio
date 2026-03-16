import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * 1단계: 상품 수정 쿼리 빌더
 * Supabase update 쿼리를 구성합니다.
 * Note: database.types.ts에 products 테이블 타입이 추가되면 타입 단언을 제거할 수 있습니다.
 */
export const updateProductQueryBuilder = (
  supabaseClient: SupabaseClient<Database>,
  id: string,
  data: Record<string, unknown>
) => {
  // Note: database.types.ts에 products 테이블 타입이 추가되면 타입 단언을 제거할 수 있습니다.
  return (supabaseClient.from("products") as any)
    .update(data)
    .eq("id", id)
    .select()
    .single();
};
