import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * 1단계: 상품 삭제 쿼리 빌더
 * Supabase delete 쿼리를 구성합니다.
 * Note: database.types.ts에 products 테이블 타입이 추가되면 타입 단언을 제거할 수 있습니다.
 */
export const deleteProductQueryBuilder = (
  supabaseClient: SupabaseClient<Database>,
  id: string
) => {
  return (supabaseClient.from("products") as any)
    .delete()
    .eq("id", id);
};
