"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateShop } from "../../services/shops.service";
import { updateShopSchema } from "./schema";
import type { ShopActionState } from "../types";

/**
 * 3단계: 상점 수정 서버 액션
 */
export async function updateShopAction(
  _prevState: ShopActionState | null,
  formData: FormData
): Promise<ShopActionState> {
  try {
    const rawData = {
      id: formData.get("id"),
      name: formData.get("name"),
    };

    const validatedFields = updateShopSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validatedFields.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) fieldErrors[fieldName] = [];
        fieldErrors[fieldName].push(issue.message);
      }
      return { success: false, message: "입력값을 확인해주세요.", errors: fieldErrors };
    }

    const supabase = await createClient();
    const { id, ...updateFields } = validatedFields.data;

    const shop = await updateShop(supabase, id, updateFields);

    revalidatePath("/stores");

    return { success: true, message: "상점 정보가 수정되었습니다.", errors: {}, data: shop };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "상점 수정 중 알 수 없는 에러가 발생했습니다.",
      errors: {},
    };
  }
}
