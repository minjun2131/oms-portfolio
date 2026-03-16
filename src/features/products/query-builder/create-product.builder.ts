import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * 1단계: 상품 등록 쿼리 빌더
 * Supabase insert 쿼리를 구성합니다.
 * Note: database.types.ts에 products 테이블 타입이 추가되면 타입 단언을 제거할 수 있습니다.
 */
export const createProductQueryBuilder = (
  supabaseClient: SupabaseClient<Database>,
  data: Record<string, unknown>
) => {
  return supabaseClient
    .from("products")
    .insert(data as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .select()
    .single();
};

