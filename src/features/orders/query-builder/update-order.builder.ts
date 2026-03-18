import { SupabaseClient } from "@supabase/supabase-js";

/**
 * 주문의 상태(status) 또는 결제 상태(payment_status)를 업데이트하는 쿼리 빌더
 */
export const updateOrderStatusQueryBuilder = (
  supabaseClient: SupabaseClient<any>,
  orderId: string,
  updates: {
    status?: string;
    payment_status?: string;
    order_memo?: string | null;
    carrier?: string | null;
    tracking_number?: string | null;
  }
) => {
  return supabaseClient
    .from("orders")
    .update(updates)
    .eq("id", orderId)
    .select()
    .single();
};
