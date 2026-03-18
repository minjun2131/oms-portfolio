"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteOrder } from "../../services/delete-order";
import { DeleteOrderState } from "./types";

/**
 * 4단계: 주문 삭제 서버 액션
 */
export async function deleteOrderAction(
  id: string
): Promise<DeleteOrderState> {
  try {
    if (!id) {
      return {
        success: false,
        message: "삭제할 주문 ID가 유효하지 않습니다."
      };
    }

    const supabase = await createClient();
    await deleteOrder(supabase, id);

    revalidatePath("/orders");

    return {
      success: true,
      message: "주문이 삭제되었습니다."
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "주문 삭제 중 오류가 발생했습니다."
    };
  }
}
