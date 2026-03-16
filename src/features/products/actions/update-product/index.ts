"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "../../services/update-product";
import { getOrCreateShopByName } from "../../../stores/services/get-or-create-shop";
import { updateProductSchema } from "./schema";
import { UpdateProductState } from "./types";
import { ROUTES } from "@/constants/url";

/**
 * 3단계: 상품 수정 서버 액션
 * FormData를 검증하고 Supabase Server Client를 통해 서비스를 호출합니다.
 */
export async function updateProductAction(
  _prevState: UpdateProductState | null,
  formData: FormData
): Promise<UpdateProductState> {
  try {
    // 1. FormData → 객체 변환
    const rawData = {
      id: formData.get("id"),
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      stock_quantity: formData.get("stock_quantity"),
      category: formData.get("category"),
      shopName: formData.get("shopName"),
    };

    // 2. Zod 유효성 검사
    const validatedFields = updateProductSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validatedFields.error.issues) {
        const fieldName = issue.path[0] as string;
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

    // 3. 서버 클라이언트 생성
    const supabase = await createClient();

    // 4. 상점명으로 shop_id 가져오기 (없으면 자동 생성)
    const { id, shopName, ...updateFields } = validatedFields.data;
    const shop_id = await getOrCreateShopByName(supabase, shopName);

    // 5. 수정할 데이터 구성
    const productData = {
      ...updateFields,
      shop_id,
      status: formData.get("status") === "false" ? "hidden" : "active",
      sku: formData.get("sku") || null,
      image_url: formData.get("image_url") || null,
    };

    // 6. 서비스 호출
    const product = await updateProduct(supabase, id, productData);

    // 7. 캐시 무효화 (목록 + 상세 페이지)
    revalidatePath(ROUTES.PRODUCTS);
    revalidatePath(`${ROUTES.PRODUCTS}/${id}`);

    return {
      success: true,
      message: "상품이 성공적으로 수정되었습니다.",
      data: product,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "상품 수정 중 알 수 없는 에러가 발생했습니다.",
      errors: {},
    };
  }
}
