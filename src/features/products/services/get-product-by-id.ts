import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getProductByIdQueryBuilder } from "../query-builder/get-product-by-id.builder";

/**
 * 2단계: 단일 상품 조회 서비스
 * Builder에서 만든 쿼리를 실행(await)하고 에러를 처리합니다.
 */
export const getProductById = async (
  supabaseClient: SupabaseClient<Database>,
  id: string
) => {
  const { data, error } = await getProductByIdQueryBuilder(supabaseClient, id);

  if (error) {
    throw new Error("상품 정보를 불러오는 데 실패했습니다: " + error.message);
  }

  return data;
};
