import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { createProductQueryBuilder } from "../query-builder/create-product.builder";

/**
 * 2단계: 상품 등록 서비스
 * Builder에서 만든 쿼리를 실행(await)하고 에러를 처리합니다.
 */
export const createProduct = async (
  supabaseClient: SupabaseClient<Database>,
  data: Record<string, unknown>
) => {
  const { data: product, error } = await createProductQueryBuilder(supabaseClient, data);

  if (error) {
    throw new Error("상품 등록에 실패했습니다: " + error.message);
  }

  return product;
};
