import { SupabaseClient } from "@supabase/supabase-js";
import { deleteOrderQueryBuilder } from "../query-builder/delete-order.builder";

/**
 * 4단계: 주문 삭제 서비스
 */
export const deleteOrder = async (
  supabaseClient: SupabaseClient<any>,
  id: string
): Promise<void> => {
  const { error } = await deleteOrderQueryBuilder(supabaseClient, id);

  if (error) {
    console.error("Error deleting order:", error);
    throw new Error(error.message);
  }
};
