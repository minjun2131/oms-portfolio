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
      shopName: formData.get("shopName"),
      compare_price: formData.get("compare_price"),
      shipping_fee: formData.get("shipping_fee"),
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
      sku: (formData.get("sku") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
    };

    // 6. 서비스 호출 (기본 정보 업데이트)
    const product = await updateProduct(supabase, id, productData);

    // 7. 이미지 동기화 (기존 이미지 삭제 후 신규 등록 - 단순화된 방식)
    const imagesJson = formData.get("images") as string;
    if (imagesJson) {
      const images = JSON.parse(imagesJson);
      if (Array.isArray(images) && images.length > 0) {
        // 기존 이미지 데이터 삭제
        await supabase.from("product_images").delete().eq("product_id", id);
        
        // 신규 이미지 데이터 등록
        const imageInserts = images.map((url: string, index: number) => ({
          product_id: id,
          url,
          order_index: index,
        }));
        await supabase.from("product_images").insert(imageInserts);
        
        // image_url (대표 이미지) 동기화
        await supabase.from("products").update({ image_url: images[0] }).eq("id", id);
      }
    }

    // 8. 캐시 무효화 (목록 + 상세 페이지)
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
