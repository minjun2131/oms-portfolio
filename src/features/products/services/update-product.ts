import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { updateProductQueryBuilder } from "../query-builder/update-product.builder";
import type { Product } from "../types";
import { mapToProduct } from "./mapper";

/**
 * 2단계: 상품 수정 서비스
 * Builder에서 만든 쿼리를 실행(await)하고 에러를 처리합니다.
 */
export const updateProduct = async (
  supabaseClient: SupabaseClient<Database>,
  id: string,
  data: Record<string, unknown>
): Promise<Product> => {
  const { data: product, error } = await updateProductQueryBuilder(supabaseClient, id, data);

  if (error) {
    throw new Error("상품 정보를 수정하는 데 실패했습니다: " + error.message);
  }

  return mapToProduct(product);
};

