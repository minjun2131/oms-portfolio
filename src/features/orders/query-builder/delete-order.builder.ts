import { SupabaseClient } from "@supabase/supabase-js";

/**
 * 4단계: 주문 삭제 쿼리 빌더
 */
export const deleteOrderQueryBuilder = (
  supabaseClient: SupabaseClient<any>,
  id: string
) => {
  return supabaseClient
    .from("orders")
    .delete()
    .eq("id", id);
};
