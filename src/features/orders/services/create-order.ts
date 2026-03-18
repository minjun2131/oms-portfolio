import { SupabaseClient } from "@supabase/supabase-js";
import {
  createOrderQueryBuilder,
  createOrderItemsQueryBuilder,
} from "../query-builder/create-order.builder";
import { Order, OrderItem } from "../types";

/**
 * 2단계: 주문 등록 서비스
 * 주문 정보와 주문(order_items) 항목을 순서대로 생성(insert)합니다.
 */
export const createOrder = async (
  supabaseClient: SupabaseClient<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  orderData: Record<string, unknown>,
  itemsData: Record<string, unknown>[]
): Promise<{ order: Order; items: OrderItem[] }> => {
  // 1. 주문 마스터 생성
  const { data: order, error: orderError } = await createOrderQueryBuilder(
    supabaseClient,
    orderData
  );

  if (orderError || !order) {
    throw new Error("주문 생성에 실패했습니다: " + orderError?.message);
  }

  // 2. 주문 항목에 새로 생성된 주문 ID를 주입
  const itemsWithOrderId = itemsData.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  // 3. 주문 항목들(다중) 생성
  const { data: items, error: itemsError } = await createOrderItemsQueryBuilder(
    supabaseClient,
    itemsWithOrderId
  );

  if (itemsError) {
    // 실무에서는 여기서 주문 마스터(order)를 삭제하는 보상 트랜잭션 등 처리가 필요할 수 있습니다.
    throw new Error("주문 항목 생성에 실패했습니다: " + itemsError.message);
  }

  return { order, items };
};
