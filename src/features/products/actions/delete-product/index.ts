"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "../../services/delete-product";
import { DeleteProductState } from "./types";
import { ROUTES } from "@/constants/url";

/**
 * 3단계: 상품 삭제 서버 액션
 * 삭제할 상품 ID를 직접 받아 검증 후 서비스를 호출합니다.
 */
export async function deleteProductAction(
  id: string
): Promise<DeleteProductState> {
  try {
    // 1. ID 유효성 검사
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return {
        success: false,
        message: "삭제할 상품 ID가 유효하지 않습니다.",
        errors: { id: ["상품 ID가 필요합니다."] },
      };
    }

    // 2. 서버 클라이언트 생성
    const supabase = await createClient();

    // 3. 서비스 호출
    const result = await deleteProduct(supabase, id);

    // 4. 캐시 무효화
    revalidatePath(ROUTES.PRODUCTS);

    return {
      success: true,
      message: "상품이 성공적으로 삭제되었습니다.",
      data: result,
    };
  } catch (error: any) {
    // 권한 오류 또는 DB 제약 조건 에러 처리
    const errorMessage = error.message || "상품 삭제 중 알 수 없는 에러가 발생했습니다.";

    return {
      success: false,
      message: errorMessage,
      errors: {},
    };
  }
}
