import { SupabaseClient } from "@supabase/supabase-js";
import { updateOrderStatusQueryBuilder } from "../query-builder/update-order.builder";
import { Order } from "../types";

/**
 * 주문 상태를 업데이트하는 서비스
 */
export const updateOrderStatus = async (
  supabaseClient: SupabaseClient<any>,
  orderId: string,
  updates: {
    status?: string;
    payment_status?: string;
    order_memo?: string | null;
    carrier?: string | null;
    tracking_number?: string | null;
  }
): Promise<Order> => {
  const { data: order, error } = await updateOrderStatusQueryBuilder(
    supabaseClient,
    orderId,
    updates
  );

  if (error || !order) {
    throw new Error("주문 상태 업데이트에 실패했습니다: " + error?.message);
  }

  return order as Order;
};
