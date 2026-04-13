import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getProductsQueryBuilder } from "../query-builder/get-products.builder";
import type { Product, ProductFilters } from "../types";
import { mapToProduct } from "./mapper";

export interface GetProductsResult {
  data: Product[];
  count: number | null;
  hasNextPage: boolean;
  nextPage: number | null;
}



/**
 * 2단계: 상품 목록 조회 서비스
 * Builder에서 만든 쿼리를 실행(await)하고 에러를 처리합니다.
 */
export const getProducts = async (
  supabaseClient: SupabaseClient<Database>,
  params?: ProductFilters
): Promise<GetProductsResult> => {
  const { data, error, count } = await getProductsQueryBuilder(supabaseClient, params);

  if (error) {
    throw new Error("상품 목록을 불러오는 데 실패했습니다: " + error.message);
  }

  const products = (data ?? []).map(mapToProduct);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const hasNextPage = count ? page * limit < count : false;

  return {
    data: products,
    count,
    hasNextPage,
    nextPage: hasNextPage ? page + 1 : null,
  };
};
