import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { deleteProductQueryBuilder } from "../query-builder/delete-product.builder";

/**
 * 2단계: 상품 삭제 서비스
 * Builder에서 만든 쿼리를 실행(await)하고 에러를 처리합니다.
 */
export const deleteProduct = async (
  supabaseClient: SupabaseClient<Database>,
  id: string
) => {
  const { error } = await deleteProductQueryBuilder(supabaseClient, id);

  if (error) {
    throw new Error("상품을 삭제하는 데 실패했습니다: " + error.message);
  }

  return { id };
};
