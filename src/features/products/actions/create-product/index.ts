"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProduct } from "../../services/create-product";
import { getOrCreateShopByName } from "../../../stores/services/get-or-create-shop";
import { createProductSchema } from "./schema";
import { CreateProductState } from "./types";
import { ROUTES } from "@/constants/url";

/**
 * 3단계: 상품 등록 서버 액션
 * FormData를 검증하고 Supabase Server Client를 통해 서비스를 호출합니다.
 */
export async function createProductAction(
  _prevState: CreateProductState | null,
  formData: FormData
): Promise<CreateProductState> {
  try {
    // 1. FormData → 객체 변환
    const rawData = {
      name: formData.get("name"),
      price: formData.get("price"),
      stock_quantity: formData.get("stock_quantity"),
      shopName: formData.get("shopName"),
      compare_price: formData.get("compare_price"),
      shipping_fee: formData.get("shipping_fee"),
    };

    // 2. Zod 유효성 검사
    const validatedFields = createProductSchema.safeParse(rawData);

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
    const { shopName, ...productFields } = validatedFields.data;
    const shop_id = await getOrCreateShopByName(supabase, shopName);

    // 5. 상품 등록에 필요한 추가 필드 구성
    const productData = {
      ...productFields,
      shop_id,
      status: formData.get("status") === "false" ? "hidden" : "active",
      sku: (formData.get("sku") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
    };

    // 6. 서비스 호출 (상품 기본 정보 등록)
    const product = await createProduct(supabase, productData);

    // 7. 이미지 및 태그 추가 처리
    const imagesJson = formData.get("images") as string;
    if (imagesJson) {
      const images = JSON.parse(imagesJson);
      if (Array.isArray(images) && images.length > 0) {
        const imageInserts = images.map((url: string, index: number) => ({
          product_id: product.id,
          url,
          order_index: index,
        }));
        await supabase.from("product_images").insert(imageInserts);
        
        // 첫 번째 이미지를 메인 image_url로 업데이트 (이미 되어있지 않다면)
        if (!product.image_url) {
          await supabase.from("products").update({ image_url: images[0] }).eq("id", product.id);
        }
      }
    }

    // 8. 캐시 무효화
    revalidatePath(ROUTES.PRODUCTS);

    return {
      success: true,
      message: "상품이 성공적으로 등록되었습니다.",
      data: product,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "상품 등록 중 알 수 없는 에러가 발생했습니다.",
      errors: {},
    };
  }
}
