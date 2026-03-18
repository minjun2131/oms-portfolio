import { SupabaseClient } from "@supabase/supabase-js";

/**
 * 1단계: 주문 및 주문 항목 등록 쿼리 빌더
 * Supabase insert 쿼리를 구성합니다.
 */
export const createOrderQueryBuilder = (
  supabaseClient: SupabaseClient<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  data: Record<string, unknown>
) => {
  return supabaseClient
    .from("orders")
    .insert(data as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .select()
    .single();
};

export const createOrderItemsQueryBuilder = (
  supabaseClient: SupabaseClient<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  data: Record<string, unknown>[]
) => {
  return supabaseClient
    .from("order_items")
    .insert(data as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .select();
};
