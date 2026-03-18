import { SupabaseClient } from "@supabase/supabase-js";
import { buildGetOrderByIdQuery } from "../query-builder/get-order-by-id.builder";
import { Order, OrderItem } from "../types";

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/**
 * 주문 ID로 주문 상세 정보를 조회하는 서비스
 */
export const getOrderById = async (
  supabaseClient: SupabaseClient<any>,
  orderId: string
): Promise<OrderWithItems> => {
  const { data, error } = await buildGetOrderByIdQuery(
    supabaseClient,
    orderId
  );

  if (error || !data) {
    throw new Error("주문 정보를 가져오는데 실패했습니다: " + error?.message);
  }

  return data as OrderWithItems;
};
