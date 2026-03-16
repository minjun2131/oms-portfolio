"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createShop } from "../../services/shops.service";
import { createShopSchema } from "./schema";
import type { ShopActionState } from "../types";

/**
 * 3단계: 상점 등록 서버 액션
 */
export async function createShopAction(
  _prevState: ShopActionState | null,
  formData: FormData
): Promise<ShopActionState> {
  try {
    const rawData = {
      name: formData.get("name"),
    };

    const validatedFields = createShopSchema.safeParse(rawData);

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

    // 현재 로그인된 유저의 id를 owner_id로 설정
    const { data: { user } } = await supabase.auth.getUser();

    const shop = await createShop(supabase, {
      name: validatedFields.data.name,
      owner_id: user?.id ?? null,
    });

    revalidatePath("/stores");

    return { success: true, message: "상점이 성공적으로 등록되었습니다.", errors: {}, data: shop };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "상점 등록 중 알 수 없는 에러가 발생했습니다.",
      errors: {},
    };
  }
}
