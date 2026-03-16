"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteShop } from "../../services/shops.service";
import type { ShopActionState } from "../types";

/**
 * 3단계: 상점 삭제 서버 액션
 */
export async function deleteShopAction(id: string): Promise<ShopActionState> {
  try {
    const supabase = await createClient();
    await deleteShop(supabase, id);

    revalidatePath("/stores");

    return { success: true, message: "상점이 삭제되었습니다.", errors: {} };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "상점 삭제 중 알 수 없는 에러가 발생했습니다.",
      errors: {},
    };
  }
}
