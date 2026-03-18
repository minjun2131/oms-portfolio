import { SupabaseClient } from "@supabase/supabase-js";

/**
 * 1단계: 주문 상세 조회 쿼리 빌더
 */
export const buildGetOrderByIdQuery = (
  supabaseClient: SupabaseClient<any>,
  orderId: string
) => {
  return supabaseClient
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("id", orderId)
    .single();
};
