"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateOrderStatus } from "../../services/update-order";
import { updateOrderStatusSchema } from "./schema";
import { UpdateOrderStatusState } from "./types";

/**
 * 3단계: 주문 상태 수정 서버 액션
 */
export async function updateOrderStatusAction(
  orderId: string,
  payload: any // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<UpdateOrderStatusState> {
  try {
    // 1. Zod 유효성 검사
    const validatedFields = updateOrderStatusSchema.safeParse(payload);

    if (!validatedFields.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validatedFields.error.issues) {
        const fieldName = issue.path.join(".");
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = [];
        }
        fieldErrors[fieldName].push(issue.message);
      }

      return {
        success: false,
        message: "입력값을 확인해주세요.",
        errors: fieldErrors,
      };
    }

    // 2. 서버 클라이언트 생성
    const supabase = await createClient();

    // 3. 서비스 호출
    await updateOrderStatus(supabase, orderId, validatedFields.data);

    // 4. 캐시 무효화 (주문 목록 및 상세 갱신 목적)
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      message: "주문 정보가 성공적으로 업데이트되었습니다.",
    };
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
      success: false,
      message: error.message || "주문 정보 업데이트 중 에러가 발생했습니다.",
      errors: {},
    };
  }
}
