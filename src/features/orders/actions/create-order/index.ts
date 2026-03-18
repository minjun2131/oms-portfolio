"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createOrder } from "../../services/create-order";
import { createOrderSchema } from "./schema";
import { CreateOrderState } from "./types";

/**
 * 3단계: 주문 등록 서버 액션
 * 입력받은 객체 데이터를 검증하고 Supabase에 주문을 생성합니다.
 */
export async function createOrderAction(
  _prevState: CreateOrderState | null,
  payload: any // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<CreateOrderState> {
  try {
    // 1. Zod 유효성 검사 (주문은 보통 항목 배열을 포함하므로 FormData 대신 객체를 직접 받음)
    const validatedFields = createOrderSchema.safeParse(payload);

    if (!validatedFields.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validatedFields.error.issues) {
        // 객체 내부의 배열 요소(예: items.0.productId) 에러도 처리하기 위해 join 사용
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

    // 3. 주문 마스터와 항목 데이터 분리
    const { items, ...orderData } = validatedFields.data;

    // 4. 서비스 호출
    const result = await createOrder(supabase, orderData, items);

    // 5. 캐시 무효화 (주문 목록 갱신 목적)
    revalidatePath("/orders");

    return {
      success: true,
      message: "주문이 성공적으로 등록되었습니다.",
      data: result,
    };
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
      success: false,
      message: error.message || "주문 등록 중 알 수 없는 에러가 발생했습니다.",
      errors: {},
    };
  }
}
